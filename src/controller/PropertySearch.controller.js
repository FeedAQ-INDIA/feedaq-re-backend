// controllers/propertyController.js
const { Op } = require('sequelize');
const db = require("../entity/index.js");


//http://localhost:8080/search?lat=19.17380000&lng=72.86000000&radius=5&transactionType=buy&featureFilters={%22hasSwimmingPool%22:%22Yes%22}

const buildRangeQuery = (minParam, maxParam, query) => {
    const range = {};
    if (query[minParam]) range[Op.gte] = parseFloat(query[minParam]);
    if (query[maxParam]) range[Op.lte] = parseFloat(query[maxParam]);
    return Object.keys(range).length ? range : undefined;
};

const buildInQuery = (param, query) => {
    if (query[param]) {
        return { [Op.in]: Array.isArray(query[param]) ? query[param] : query[param].split(',').map(v => v.trim()) };
    }
    return undefined;
};

const parseBoolean = val => val === 'true' || val === true;

exports.searchProperties = async (req, res) => {
    try {
        const {
            transactionType, propertyType, furnishingStatus, constructionStatus, ageOfProperty,
            floorNumber, facing, ownershipType, preferredTenants, availabilityDate,
            reraRegistered, developerName, projectName, projectStatus,
            locationLocality, locationCity, locationState, lat, lng, radius,
            sortBy, page = 1, limit = 10, keyword, status, featureFilters,
            minPrice, maxPrice, minRent, maxRent, minBedrooms, maxBedrooms, minBathrooms, maxBathrooms, minCarpetArea, maxCarpetArea,

        } = req.query;

        // hasParking, hasLift, hasPowerBackup, hasSecurity, hasGym, hasSwimmingPool, hasClubhouse

        let where = {};
        const include = [];
        const order = [];

        // Basic filters
        if (transactionType) {
            if (!['buy', 'rent'].includes(transactionType)) {
                return res.status(400).json({ message: 'Invalid transactionType. Must be "buy" or "rent".' });
            }
            where.transactionType = transactionType;
        }
        if (propertyType) where.propertyType = buildInQuery('propertyType', req.query);
        if (status) where.status = status;

        if (transactionType === 'buy' && minPrice && maxPrice) where.price = buildRangeQuery('minPrice', 'maxPrice', req.query);
        if (transactionType === 'rent' && minRent && maxRent) where.rent = buildRangeQuery('minRent', 'maxRent', req.query);

        if (minBedrooms && maxBedrooms) where.bedrooms = buildRangeQuery('minBedrooms', 'maxBedrooms', req.query);
        if (minBathrooms && maxBathrooms) where.bathrooms = buildRangeQuery('minBathrooms', 'maxBathrooms', req.query);
        if (minCarpetArea && maxCarpetArea) where.carpetArea = buildRangeQuery('minCarpetArea', 'maxCarpetArea', req.query);

        if (furnishingStatus) where.furnishingStatus = buildInQuery('furnishingStatus', req.query);
        if (constructionStatus) where.constructionStatus = buildInQuery('constructionStatus', req.query);
        if (ageOfProperty) where.ageOfProperty = buildInQuery('ageOfProperty', req.query);
        if (floorNumber) where.floorNumber = parseInt(floorNumber);
        if (facing) where.facing = buildInQuery('facing', req.query);
        if (ownershipType) where.ownershipType = buildInQuery('ownershipType', req.query);

        if (transactionType === 'rent') {
            if (preferredTenants) where.preferredTenants = { [Op.overlap]: preferredTenants.split(',') };
            if (availabilityDate) where.availabilityDate = { [Op.lte]: new Date(availabilityDate) };
        }

        // Feature key-value filters
        if (featureFilters) {
            const filters = typeof featureFilters === 'string' ? JSON.parse(featureFilters) : featureFilters;
            console.log('//////////////////////////////////////////////////////////////////////')
            console.log('Filters :: ',filters)
            let featureCond =  Object.entries(filters).map(([k, v]) => ({ featureKey: k, featureValue: v }))
            console.log('Filters Conf :: ',featureCond)
            include.push({
                model: db.PropertyFeature,
                as: 'features',
                where: { [Op.or]: featureCond},
                required: true
            });
        }

        // Location + Geospatial
        // let locationWhere = {};
        if (locationLocality) where.locality = { [Op.iLike]: `%${locationLocality}%` };
        if (locationCity) where.city = { [Op.iLike]: `%${locationCity}%` };
        if (locationState) where.state = { [Op.iLike]: `%${locationState}%` };

        const latObj = parseFloat(lat), lngObj = parseFloat(lng), radiusObj = parseFloat(radius);
        if (!isNaN(latObj) && !isNaN(lngObj) && !isNaN(radiusObj)) {
            const geoCond = db.sequelize.literal(`ST_DWithin(property_geoam, ST_SetSRID(ST_MakePoint(${lngObj}, ${latObj}), 4326), ${radiusObj * 1000}, true)`);
            where = Object.keys(where).length ? { [Op.and]: [where, geoCond] } : geoCond;
        }


        // Project & Developer
        const projectInclude = {
            model: db.Project,
            as: 'project',
            required: !!(projectName || projectStatus || reraRegistered || developerName),
            include: [
                {
                    model: db.Developer,
                    as: 'developer',
                    where: developerName ? { name: { [Op.iLike]: `%${developerName}%` } } : undefined,
                    required: !!developerName
                },
                {
                    model: db.ProjectAttachment,
                    as: 'attachment',
                    required: false
                }
            ],
            where: {
                ...(projectName && { name: { [Op.iLike]: `%${projectName}%` } }),
                ...(projectStatus && { status: buildInQuery('projectStatus', req.query) }),
                ...(reraRegistered === 'true' && { reraRegistrationNumber: { [Op.ne]: null } })
            }
        };
        include.push(projectInclude);

        // Keyword search
        if (keyword) {
            const keywordClause = {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${keyword}%` } },
                    { description: { [Op.iLike]: `%${keyword}%` } },
                    { '$features.propertyfeature_value$': { [Op.iLike]: `%${keyword}%` } },
                    { '$project.name$': { [Op.iLike]: `%${keyword}%` } },
                    { '$project.developer.name$': { [Op.iLike]: `%${keyword}%` } }
                ]
            };
            where[Op.and] = where[Op.and] ? [...where[Op.and], keywordClause] : [keywordClause];
        }

        // Sorting
        if (sortBy) {
            const [field, direction] = sortBy.split(':');
            order.push([field, direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']);
        } else {
            order.push(['createdAt', 'DESC']);
        }

        // Attachments + Fav
        include.push({ model: db.PropertyAttachment, as: 'attachment', where: { isPrimary: true }, required: false });
        include.push({
            model: db.PropertyConfiguration,
            as: "configurations",
            required: false,
        });

        if (req.user) {
            include.push({
                model: db.UserFav,
                as: 'fav',
                where: { userId: req.user.userId },
                required: false
            });
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const result = await db.Property.findAndCountAll({
            where,
            include,
            order,
            limit: parseInt(limit),
            offset,
            distinct: true
        });

        res.status(200).json({
            totalProperties: result.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(result.count / limit),
            properties: result.rows
        });
    } catch (err) {
        console.error("Property search error:", err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};