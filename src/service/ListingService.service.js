const {Op, fn, col, QueryTypes} = require("sequelize");
const db = require("../entity/index.js");
const lodash = require("lodash");
const logger = require("../config/winston.config.js");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const {toJSON} = require("lodash/seq");
const AcademyService = require("./AcademyService.service");
async function saveProperty(req) {
    const {
        id,
        title,
        description,
        rules,
        transactionType,
        category,
        propertyType,
        price,
        rent,
        bhkType,
        bedrooms,
        bathrooms,
        balconies,
        carpetArea,
        builtupArea,
        superBuiltupArea,
        areaUnit,
        furnishingStatus,
        constructionStatus,
        possessionDate,
        ageOfProperty,
        floorNumber,
        totalFloors,
        facing,
        ownershipType,
        preferredTenants,
        availabilityDate,
        additionalPriceBreakup,
        isVerified,
        hasVirtualTour,
        userId,
        projectId,
        mapReferenceId,
        mapReferenceAddress,
        addressLine1,
        addressLine2,
        locality,
        city,
        state,
        zipCode,
        country,
        latitude,
        longitude,
        propertyConfiguration = [],
        propertyFeatures = [],
    } = req.body;

    let property;

    if (id) {
        // Update property
        await db.Property.update({
            title,
            description,
            rules,
            transactionType,
            category,
            propertyType,
            price,
            rent,
            bhkType,
            bedrooms,
            bathrooms,
            balconies,
            carpetArea,
            builtupArea,
            superBuiltupArea,
            areaUnit,
            furnishingStatus,
            constructionStatus,
            possessionDate,
            ageOfProperty,
            floorNumber,
            totalFloors,
            facing,
            ownershipType,
            preferredTenants,
            availabilityDate,
            additionalPriceBreakup,
            isVerified,
            hasVirtualTour,
            userId,
            projectId,
            mapReferenceId,
            mapReferenceAddress,
            addressLine1,
            addressLine2,
            locality,
            city,
            state,
            zipCode,
            country,
            latitude,
            longitude,
        }, {
            where: { id },
        });

        property = await db.Property.findByPk(id);

        // Delete old configs/features to avoid duplicates on update
        await db.PropertyConfiguration.destroy({ where: { propertyId: id } });
        await db.PropertyFeature.destroy({ where: { propertyId: id } });
    } else {
        // Create new property
        property = await db.Property.create({
            title,
            description,
            rules,
            transactionType,
            category,
            propertyType,
            price,
            rent,
            bhkType,
            bedrooms,
            bathrooms,
            balconies,
            carpetArea,
            builtupArea,
            superBuiltupArea,
            areaUnit,
            furnishingStatus,
            constructionStatus,
            possessionDate,
            ageOfProperty,
            floorNumber,
            totalFloors,
            facing,
            ownershipType,
            preferredTenants,
            availabilityDate,
            additionalPriceBreakup,
            isVerified,
            hasVirtualTour,
            userId,
            projectId,
            mapReferenceId,
            mapReferenceAddress,
            addressLine1,
            addressLine2,
            locality,
            city,
            state,
            zipCode,
            country,
            latitude,
            longitude,
        });
    }

    // Save property configuration
    if (propertyConfiguration.length > 0) {
        await db.PropertyConfiguration.bulkCreate(propertyConfiguration.map(a => ({
            configurationKey: a.configurationKey,
            configurationCategory: a.configurationCategory,
            configurationName: a.configurationName,
            configurationValue: a.configurationValue,
            propertyId: property.id,
        })));
    }

    // Save property features
    if (propertyFeatures.length > 0) {
        await db.PropertyFeature.bulkCreate(propertyFeatures.map(a => ({
            featureKey: a.featureKey,
            featureCategory: a.featureCategory,
            featureName: a.featureName,
            featureValue: a.featureValue,
            propertyId: property.id,
        })));
    }

    return property;
}

async function saveProject(req) {
    const {
        id,
        name,
        description,
        status,
        expectedCompletionDate,
        totalLandArea,
        landAreaUnit,
        projectUnitDetail,
        numberOfTowers,
        reraRegistrationNumber,
        developerId,
        isVerified,
        minPrice,
        maxPrice,
        mapReferenceId,
        mapReferenceAddress,
        addressLine1,
        addressLine2,
        locality,
        city,
        state,
        zipCode,
        country,
        latitude,
        longitude,
        projectConfiguration = [],
        projectFeatures = []
    } = req.body;

    let project;

    if (id) {
        // Update project
        await db.Project.update({
            name,
            description,
            status,
            expectedCompletionDate,
            totalLandArea,
            landAreaUnit,
            projectUnitDetail,
            numberOfTowers,
            reraRegistrationNumber,
            developerId,
            isVerified,
            minPrice,
            maxPrice,
            mapReferenceId,
            mapReferenceAddress,
            addressLine1,
            addressLine2,
            locality,
            city,
            state,
            zipCode,
            country,
            latitude,
            longitude,
        }, {
            where: { id }
        });

        project = await db.Project.findByPk(id);

        // Remove old related data before inserting new
        await db.ProjectConfiguration.destroy({ where: { projectId: id } });
        await db.ProjectFeature.destroy({ where: { projectId: id } });

    } else {
        // Create new project
        project = await db.Project.create({
            name,
            description,
            status,
            expectedCompletionDate,
            totalLandArea,
            landAreaUnit,
            projectUnitDetail,
            numberOfTowers,
            reraRegistrationNumber,
            developerId,
            isVerified,
            minPrice,
            maxPrice,
            mapReferenceId,
            mapReferenceAddress,
            addressLine1,
            addressLine2,
            locality,
            city,
            state,
            zipCode,
            country,
            latitude,
            longitude,
        });
    }

    // Create new configuration records
    if (projectConfiguration.length > 0) {
        await db.ProjectConfiguration.bulkCreate(projectConfiguration.map(a => ({
            configurationKey: a.configurationKey,
            configurationCategory: a.configurationCategory,
            configurationName: a.configurationName,
            configurationValue: a.configurationValue,
            projectId: project.id
        })));
    }

    // Create new feature records
    if (projectFeatures.length > 0) {
        await db.ProjectFeature.bulkCreate(projectFeatures.map(a => ({
            featureKey: a.featureKey,
            featureCategory: a.featureCategory,
            featureName: a.featureName,
            featureValue: a.featureValue,
            projectId: project.id
        })));
    }

    return project;
}



async function saveDeveloper(req) {
    console.log("Request body:", req.body);

    const {
        id,
        name,
        website,
        email,
        contactNumber,
        description,
    } = req.body;

    let res;

    if (id) {
        res = await db.Developer.upsert({
            id,
            name,
            website,
            email,
            contactNumber,
            description,
        });
    } else {
        console.log({
            name : name,
            website :website,
            email : email,
            contactNumber,
            description,
        })
        res = await db.Developer.create({
            name,
            website,
            email,
            contactNumber,
            description,
        })
    }
    return res;
}


module.exports = {
    saveProperty,
    saveProject,
    saveDeveloper,
};

