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
            userId: req.user.userId,
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
            userId: req.user.userId,
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




async function savePropertyAttachment(propertyAttachmentList, propertyId) {
    try {
        for (const attachment of propertyAttachmentList) {
            if (attachment._deleted && attachment.id) {
                // DELETE
                await db.PropertyAttachment.destroy({
                    where: { id: attachment.id },
                });
            } else if (attachment.id) {
                // UPDATE
                await db.PropertyAttachment.update(
                    {
                        url: attachment.url,
                        caption: attachment.caption,
                        isPrimary: attachment.isPrimary,
                        order: attachment.order,
                        type: attachment.type,
                    },
                    {
                        where: { id: attachment.id },
                    }
                );
            } else {
                // CREATE
                await db.PropertyAttachment.create({
                    url: attachment.url,
                    caption: attachment.caption || null,
                    isPrimary: attachment.isPrimary || false,
                    order: attachment.order || 0,
                    type: attachment.type || 'IMAGE',
                    propertyId: propertyId,
                });
            }
        }
        return { success: true };
    } catch (error) {
        console.error('Error saving property attachments:', error);
        return { success: false, error: error.message };
    }
}



async function saveProjectAttachment(projectAttachmentList, projectId) {
    try {
        for (const attachment of projectAttachmentList) {
            if (attachment._deleted && attachment.id) {
                // DELETE
                await db.ProjectAttachment.destroy({
                    where: { id: attachment.id },
                });
            } else if (attachment.id) {
                // UPDATE
                await db.ProjectAttachment.update(
                    {
                        url: attachment.url,
                        caption: attachment.caption,
                        isPrimary: attachment.isPrimary,
                        order: attachment.order,
                        type: attachment.type,
                    },
                    {
                        where: { id: attachment.id },
                    }
                );
            } else {
                // CREATE
                await db.ProjectAttachment.create({
                    url: attachment.url,
                    caption: attachment.caption || null,
                    isPrimary: attachment.isPrimary || false,
                    order: attachment.order || 0,
                    type: attachment.type || 'IMAGE',
                    projectId: attachment.projectId,
                });
            }
        }
        return { success: true };
    } catch (error) {
        console.error('Error saving property attachments:', error);
        return { success: false, error: error.message };
    }
}

async function saveProject(req) {

    console.log(req.body)
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
            userId: req.user.userId,

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
            userId: req.user.userId,
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
        avatar
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
            avatar,
            userId: req.user.userId,
        });
    } else {
        console.log({
            name : name,
            website :website,
            email : email,
            contactNumber,
            avatar,
            description,
        })
        res = await db.Developer.create({
            name,
            website,
            email,
            contactNumber,
            description,
            avatar,
            userId: req.user.userId,
        })
    }
    return res;
}


module.exports = {
    saveProperty,
    saveProject,
    saveDeveloper,
    savePropertyAttachment,
    saveProjectAttachment
};

