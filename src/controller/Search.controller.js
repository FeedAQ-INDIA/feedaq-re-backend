// controllers/propertyController.js
const { Op } = require('sequelize'); // Import Sequelize operators
const db = require("../entity/index.js");

// --- Helper Functions for Query Building ---

/**
 * Builds a range query for numeric fields (e.g., minPrice, maxPrice).
 * @param {string} fieldName - The name of the database field (e.g., 'price', 'bedrooms').
 * @param {string} minParam - The query parameter name for the minimum value (e.g., 'minPrice').
 * @param {string} maxParam - The query parameter name for the maximum value (e.g., 'maxPrice').
 * @param {object} query - The request's query object (req.query).
 * @returns {object|undefined} A Sequelize range object or undefined if no range parameters are provided.
 */
const buildRangeQuery = (fieldName, minParam, maxParam, query) => {
    const rangeQuery = {};
    if (query[minParam]) {
        rangeQuery[Op.gte] = parseFloat(query[minParam]);
    }
    if (query[maxParam]) {
        rangeQuery[Op.lte] = parseFloat(query[maxParam]);
    }
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : undefined;
};

/**
 * Builds an "in" query for fields that accept multiple discrete values (e.g., propertyType, furnishingStatus).
 * Assumes query parameter can be a single value or comma-separated string.
 * @param {string} fieldName - The name of the database field (not directly used here but good for context).
 * @param {string} param - The query parameter name.
 * @param {object} query - The request's query object (req.query).
 * @returns {object|undefined} A Sequelize `Op.in` object or undefined.
 */
const buildInQuery = (fieldName, param, query) => {
    if (query[param]) {
        const values = Array.isArray(query[param]) ? query[param] : query[param].split(',').map(v => v.trim());
        return { [Op.in]: values };
    }
    return undefined;
};

// --- Main Search Controller Function ---

exports.searchProperties = async (req, res) => {
    // Destructure all possible query parameters
    const {
        transactionType,
        propertyType,
        minPrice, maxPrice,
        minRent, maxRent,
        minBedrooms, maxBedrooms,
        minBathrooms, maxBathrooms,
        minCarpetArea, maxCarpetArea,
        furnishingStatus,
        constructionStatus,
        ageOfProperty,
        floorNumber,
        facing,
        ownershipType,
        preferredTenants, // For rent (e.g., 'family', 'bachelors_male,bachelors_female')
        availabilityDate, // For rent (e.g., 'YYYY-MM-DD')
        hasParking, hasLift, hasPowerBackup, hasSecurity, hasGym, hasSwimmingPool, hasClubhouse, // Common features
        reraRegistered, // For projects ('true')
        developerName, // For projects
        projectName, // For projects
        projectStatus, // For projects (e.g., 'under_construction')
        locationLocality, locationCity, locationState, // For location search
        centerLat, centerLon, radiusKm, // For geospatial radius search
        sortBy, // e.g., 'price:asc', 'createdAt:desc', 'locatedIn.city:asc' (note 'locatedIn' alias)
        page = 1, // Default page is 1
        limit = 10, // Default limit is 10 items per page
        keyword // For general full-text search across title, description, and potentially location
    } = req.query;

    let whereClause = {}; // Main WHERE clause for the Property model
    let includeClause = []; // Array of associated models to include
    let orderClause = []; // Array for sorting order

    // --- 1. Basic Property Filters (Direct on Property Model) ---
    if (transactionType) {
        if (!['buy', 'rent'].includes(transactionType)) {
            return res.status(400).json({ message: 'Invalid transactionType. Must be "buy" or "rent".' });
        }
        whereClause.transactionType = transactionType;
    }
    if (propertyType) {
        whereClause.propertyType = buildInQuery('propertyType', 'propertyType', req.query);
    }

    // Price/Rent Range based on transactionType
    if (whereClause.transactionType === 'buy') {
        const priceRange = buildRangeQuery('price', 'minPrice', 'maxPrice', req.query);
        if (priceRange) whereClause.price = priceRange;
    } else if (whereClause.transactionType === 'rent') {
        const rentRange = buildRangeQuery('rent', 'minRent', 'maxRent', req.query);
        if (rentRange) whereClause.rent = rentRange;
    }

    // Bedroom/Bathroom Ranges
    const bedroomsRange = buildRangeQuery('bedrooms', 'minBedrooms', 'maxBedrooms', req.query);
    if (bedroomsRange) whereClause.bedrooms = bedroomsRange;

    const bathroomsRange = buildRangeQuery('bathrooms', 'minBathrooms', 'maxBathrooms', req.query);
    if (bathroomsRange) whereClause.bathrooms = bathroomsRange;

    // Area Range (using carpetArea as the primary example)
    const carpetAreaRange = buildRangeQuery('carpetArea', 'minCarpetArea', 'maxCarpetArea', req.query);
    if (carpetAreaRange) whereClause.carpetArea = carpetAreaRange;

    // Enum/Direct Value Filters
    if (furnishingStatus) {
        whereClause.furnishingStatus = buildInQuery('furnishingStatus', 'furnishingStatus', req.query);
    }
    if (constructionStatus) {
        whereClause.constructionStatus = buildInQuery('constructionStatus', 'constructionStatus', req.query);
    }
    if (ageOfProperty) {
        whereClause.ageOfProperty = buildInQuery('ageOfProperty', 'ageOfProperty', req.query);
    }
    if (floorNumber) {
        whereClause.floorNumber = parseInt(floorNumber, 10);
        if (isNaN(whereClause.floorNumber)) {
            return res.status(400).json({ message: 'Invalid floorNumber. Must be an integer.' });
        }
    }
    if (facing) {
        whereClause.facing = buildInQuery('facing', 'facing', req.query);
    }
    if (ownershipType) {
        whereClause.ownershipType = buildInQuery('ownershipType', 'ownershipType', req.query);
    }

    // --- 2. Filters for Rent Specifics ---
    if (whereClause.transactionType === 'rent') {
        if (preferredTenants) {
            const tenantsArray = Array.isArray(preferredTenants) ? preferredTenants : preferredTenants.split(',').map(t => t.trim());
            whereClause.preferredTenants = { [Op.overlap]: tenantsArray };
        }
        if (availabilityDate) {
            whereClause.availabilityDate = { [Op.lte]: new Date(availabilityDate) };
        }
    }

    // --- 3. Associated Model Filters (Includes) ---

    // PropertyFeatures (Amenities)
    let featureWhere = {};
    if (hasParking === 'true') featureWhere.hasParking = true;
    if (hasLift === 'true') featureWhere.hasLift = true;
    if (hasPowerBackup === 'true') featureWhere.hasPowerBackup = true;
    if (hasSecurity === 'true') featureWhere.hasSecurity = true;
    if (hasGym === 'true') featureWhere.hasGym = true;
    if (hasSwimmingPool === 'true') featureWhere.hasSwimmingPool = true;
    if (hasClubhouse === 'true') featureWhere.hasClubhouse = true;

    if (Object.keys(featureWhere).length > 0) {
        includeClause.push({
            model: db.PropertyFeature,
            as: 'features',
            where: featureWhere,
            required: true // INNER JOIN
        });
    } else {
        includeClause.push({
            model: db.PropertyFeature,
            as: 'features',
            required: false // LEFT JOIN
        });
    }

    // Location (Standard address fields + Geospatial)
    let locationWhere = {}; // This will be the `where` object for the `locatedIn` include

    if (locationLocality) locationWhere.locality = { [Op.iLike]: `%${locationLocality}%` };
    if (locationCity) locationWhere.city = { [Op.iLike]: `%${locationCity}%` };
    if (locationState) locationWhere.state = { [Op.iLike]: `%${locationState}%` };

    // Handle Geospatial Filter (Radius Search)
    const parsedLat = parseFloat(centerLat);
    const parsedLon = parseFloat(centerLon);
    const parsedRadiusKm = parseFloat(radiusKm);

    const hasGeospatialFilter = !isNaN(parsedLat) && !isNaN(parsedLon) && !isNaN(parsedRadiusKm) && parsedRadiusKm > 0;

    if (hasGeospatialFilter) {
        // Validate coordinates
        if (parsedLat < -90 || parsedLat > 90 || parsedLon < -180 || parsedLon > 180) {
            return res.status(400).json({ message: 'Invalid latitude or longitude range.' });
        }

        const searchPoint = `ST_SetSRID(ST_MakePoint(${parsedLon}, ${parsedLat}), 4326)`; // [longitude, latitude]
        const distanceInMeters = parsedRadiusKm * 1000;

        // Add geospatial condition to locationWhere. Use Op.and if other location filters exist.
        const geospatialCondition = db.sequelize.literal(`ST_DWithin("locatedIn".location_geoam, ${searchPoint}, ${distanceInMeters}, true)`);

        if (Object.keys(locationWhere).length > 0) {
            locationWhere = { [Op.and]: [locationWhere, geospatialCondition] };
        } else {
            locationWhere = geospatialCondition;
        }
    }

    // Conditionally include Location. It becomes 'required' if any location-based filters (including geospatial) exist.
    const isLocationRequired = Object.keys(locationWhere).length > 0;

    includeClause.push({
        model: db.Location,
        as: 'locatedIn',
        where: isLocationRequired ? locationWhere : undefined, // Apply locationWhere if needed
        required: isLocationRequired // INNER JOIN if filtering on location (or geospatial)
    });


    // Project & Developer Filters
    let projectWhere = {};
    let developerWhere = {};
    let includeDeveloper = false;

    if (projectName) projectWhere.name = { [Op.iLike]: `%${projectName}%` };
    if (projectStatus) projectWhere.status = buildInQuery('status', 'projectStatus', req.query);
    if (reraRegistered === 'true') projectWhere.reraRegistrationNumber = { [Op.ne]: null };
    if (developerName) {
        developerWhere.name = { [Op.iLike]: `%${developerName}%` };
        includeDeveloper = true;
    }

    const isProjectOrDeveloperFilter = Object.keys(projectWhere).length > 0 || includeDeveloper;

    if (isProjectOrDeveloperFilter) {
        let projectInclude = {
            model: db.Project,
            as: 'project',
            required: true // INNER JOIN
        };
        if (Object.keys(projectWhere).length > 0) {
            projectInclude.where = projectWhere;
        }
        if (includeDeveloper) {
            projectInclude.include = [{
                model: db.Developer,
                as: 'developer',
                where: developerWhere,
                required: true // INNER JOIN
            }];
        }
        projectInclude.include.push({
            model: db.PropertyImage,
            as: 'images',
            required: false
        })
        includeClause.push(projectInclude);
    } else {
        // LEFT JOIN
        includeClause.push({
            model: db.Project,
            as: 'project',
            required: false,
            include: [{
                model: db.Developer,
                as: 'developer',
                required: false
            },
                {
                    model: db.PropertyImage,
                    as: 'images',
                    required: false
                }]
        });
    }

    // --- 4. Full-Text Search (Keyword) ---
    if (keyword) {
        const searchQuery = {
            [Op.or]: [
                { title: { [Op.iLike]: `%${keyword}%` } },
                { description: { [Op.iLike]: `%${keyword}%` } },
            ]
        };

        // Combine with main where clause for Property model
        whereClause = Object.keys(whereClause).length > 0
            ? { [Op.and]: [whereClause, searchQuery] }
            : searchQuery;

        // Additionally, if no specific location filters (locality, city, state, geospatial) are applied,
        // we can expand the keyword search to location fields.
        if (!isLocationRequired && !hasGeospatialFilter) {
            const locationKeywordSearch = {
                [Op.or]: [
                    { locality: { [Op.iLike]: `%${keyword}%` } },
                    { city: { [Op.iLike]: `%${keyword}%` } },
                    { state: { [Op.iLike]: `%${keyword}%` } },
                ]
            };
            // Find the existing location include and add keyword search to its where clause
            const locationInclude = includeClause.find(inc => inc.as === 'locatedIn');
            if (locationInclude) {
                locationInclude.where = locationKeywordSearch;
                locationInclude.required = false; // Ensure it's a LEFT JOIN for keyword widening
            }
        }
    }

    // --- 5. Pagination ---
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({ message: 'Invalid page number. Must be a positive integer.' });
    }
    if (isNaN(limitNum) || limitNum < 1) {
        return res.status(400).json({ message: 'Invalid limit. Must be a positive integer.' });
    }

    // --- 6. Sorting ---
    if (sortBy) {
        const [field, direction] = sortBy.split(':');
        const orderDirection = direction && ['asc', 'desc'].includes(direction.toLowerCase()) ? direction.toUpperCase() : 'ASC';

        if (field) {
            if (field.includes('.')) {
                const [associationAlias, assocField] = field.split('.');
                const associatedInclude = includeClause.find(inc => inc.as === associationAlias);

                if (associatedInclude) {
                    orderClause.push([
                        { model: associatedInclude.model, as: associationAlias },
                        assocField,
                        orderDirection
                    ]);
                } else {
                    console.warn(`Attempted to sort by unincluded or incorrectly aliased association: ${field}. Falling back to default sort.`);
                    orderClause.push(['createdAt', 'DESC']);
                }
            } else {
                orderClause.push([field, orderDirection]);
            }
        }
    } else {
        orderClause.push(['createdAt', 'DESC']); // Default sort by newest first
    }

    includeClause.push({
        model: db.PropertyImage,
        as: 'images',
        required: false,
    });

    console.log('-----------------------------------------------------------------------------------------------------------')
    console.log(JSON.stringify({
        where: whereClause,
        include: includeClause,
        order: orderClause,
        limit: limitNum,
        offset: offset,
        distinct: true // Crucial for accurate count when using 'required: true' includes
    }))
    console.log('-----------------------------------------------------------------------------------------------------------')

    try {
        const { count, rows: properties } = await db.Property.findAndCountAll({
            where: whereClause,
            include: includeClause,
            order: orderClause,
            limit: limitNum,
            offset: offset,
            distinct: true // Crucial for accurate count when using 'required: true' includes
        });

        res.status(200).json({
            totalProperties: count,
            currentPage: pageNum,
            totalPages: Math.ceil(count / limitNum),
            properties: properties
        });

    } catch (error) {
        console.error('Error searching properties:', error);
        res.status(500).json({ message: 'Internal server error during property search', error: error.message });
    }
};