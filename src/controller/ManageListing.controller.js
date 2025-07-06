const jwt = require("jsonwebtoken");
const lodash = require("lodash");
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const logger = require("../config/winston.config");
const ListingService = require("../service/ListingService.service.js");


async function saveProperty(req, res, next) {
    const {} = req.body;
    try {
        let val = await ListingService.saveProperty(req);
        res.status(200).send({
            status: 200, message: "Success", data: val != null ? val : [],
        });
    } catch (err) {
        console.error(`Error occured`, err.message);
        console.error("❌ Sequelize validation error:", err.errors || err);
        res.status(500).send({
            status: 500, message: err.message || "Some error occurred while creating the Tutorial.",
        });
        next(err);
    }
}


async function savePropertyAttachment(req, res, next) {
    const {propertyAttachmentList, propertyId} = req.body;
    try {
        let val = await ListingService.savePropertyAttachment(propertyAttachmentList, propertyId);
        res.status(200).send({
            status: 200, message: "Success", data: val != null ? val : [],
        });
    } catch (err) {
        console.error(`Error occured`, err.message);
        console.error("❌ Sequelize validation error:", err.errors || err);
        res.status(500).send({
            status: 500, message: err.message || "Some error occurred while creating the Tutorial.",
        });
        next(err);
    }
}



async function saveProjectAttachment(req, res, next) {
    const {projectAttachmentList, projectId} = req.body;
    try {
        let val = await ListingService.saveProjectAttachment(projectAttachmentList, projectId);
        res.status(200).send({
            status: 200, message: "Success", data: val != null ? val : [],
        });
    } catch (err) {
        console.error(`Error occured`, err.message);
        console.error("❌ Sequelize validation error:", err.errors || err);
        res.status(500).send({
            status: 500, message: err.message || "Some error occurred while creating the Tutorial.",
        });
        next(err);
    }
}


async function saveProject(req, res, next) {
    const {} = req.body;
    try {
        let val = await ListingService.saveProject(req);
        res.status(200).send({
            status: 200, message: "Success", data: val != null ? val : [],
        });
    } catch (err) {
        console.error(`Error occured`, err.message);
        console.error("❌ Sequelize validation error:", err.errors || err);
         res.status(500).send({
            status: 500, message: err.message || "Some error occurred while creating the Tutorial.",
        });
        next(err);
    }
}



async function saveDeveloper(req, res, next) {
    const {} = req.body;
    console.log("Request body:", req.body);

    try {
        let val = await ListingService.saveDeveloper(req);
        res.status(200).send({
            status: 200, message: "Success", data: val != null ? val : [],
        });
    } catch (err) {
        console.error(`Error occured`, err.message);
        console.error("❌ Sequelize validation error:", err.errors || err);
        res.status(500).send({
            status: 500, message: err.message || "Some error occurred while creating the Tutorial.",
        });
        next(err);
    }
}



async function getProjectFeatures(req, res, next) {
    const {} =  req.query;
    const projectFeaturesList = [
        {
            featureKey: "floors",
            featureCategory: "Structure",
            featureName: "Number of Floors",
            featureValue: "10",
        },
        {
            featureKey: "towers",
            featureCategory: "Structure",
            featureName: "Number of Towers",
            featureValue: "3",
        },
        {
            featureKey: "basement_parking",
            featureCategory: "Parking",
            featureName: "Basement Parking",
            featureValue: "Yes",
        },
        {
            featureKey: "open_parking",
            featureCategory: "Parking",
            featureName: "Open Parking",
            featureValue: "Available",
        },
        {
            featureKey: "security",
            featureCategory: "Safety",
            featureName: "24x7 Security",
            featureValue: "Yes",
        },
        {
            featureKey: "cctv",
            featureCategory: "Safety",
            featureName: "CCTV Surveillance",
            featureValue: "Yes",
        },
        {
            featureKey: "power_backup",
            featureCategory: "Utilities",
            featureName: "Power Backup",
            featureValue: "Full",
        },
        {
            featureKey: "water_supply",
            featureCategory: "Utilities",
            featureName: "Water Supply",
            featureValue: "24 Hours",
        },
        {
            featureKey: "sewage_treatment",
            featureCategory: "Environment",
            featureName: "Sewage Treatment Plant",
            featureValue: "Yes",
        },
        {
            featureKey: "rainwater_harvesting",
            featureCategory: "Environment",
            featureName: "Rainwater Harvesting",
            featureValue: "Yes",
        },
        {
            featureKey: "clubhouse",
            featureCategory: "Amenities",
            featureName: "Clubhouse",
            featureValue: "Yes",
        },
        {
            featureKey: "gym",
            featureCategory: "Amenities",
            featureName: "Gym",
            featureValue: "Yes",
        },
        {
            featureKey: "swimming_pool",
            featureCategory: "Amenities",
            featureName: "Swimming Pool",
            featureValue: "Yes",
        },
        {
            featureKey: "children_play_area",
            featureCategory: "Amenities",
            featureName: "Children Play Area",
            featureValue: "Yes",
        },
        {
            featureKey: "garden",
            featureCategory: "Landscape",
            featureName: "Landscaped Garden",
            featureValue: "Yes",
        },
        {
            featureKey: "construction_type",
            featureCategory: "Construction",
            featureName: "Construction Type",
            featureValue: "RCC Frame",
        },
        {
            featureKey: "earthquake_resistant",
            featureCategory: "Construction",
            featureName: "Earthquake Resistant",
            featureValue: "Yes",
        },
        {
            featureKey: "fire_safety",
            featureCategory: "Safety",
            featureName: "Fire Safety Systems",
            featureValue: "Yes",
        },
        {
            featureKey: "elevator",
            featureCategory: "Utilities",
            featureName: "Elevator",
            featureValue: "Yes",
        },
        {
            featureKey: "visitor_parking",
            featureCategory: "Parking",
            featureName: "Visitor Parking",
            featureValue: "Yes",
        }
    ];

    try {
        let val = projectFeaturesList;
        res.status(200).send({
            status: 200, message: "Success", data: val != null ? val : [],
        });
    } catch (err) {
        console.error(`Error occured`, err.message);
        console.error("❌ Sequelize validation error:", err.errors || err);
        res.status(500).send({
            status: 500, message: err.message || "Some error occurred while creating the Tutorial.",
        });
        next(err);
    }
}


async function getPropertyFeatures(req, res, next) {
    const {} =  req.query;
    const propertyFeaturesList = [
        {
            featureKey: "bedrooms",
            featureCategory: "Interior",
            featureName: "Bedrooms",
            featureValue: "3",
        },
        {
            featureKey: "bathrooms",
            featureCategory: "Interior",
            featureName: "Bathrooms",
            featureValue: "2",
        },
        {
            featureKey: "balconies",
            featureCategory: "Interior",
            featureName: "Balconies",
            featureValue: "2",
        },
        {
            featureKey: "floor_number",
            featureCategory: "Structure",
            featureName: "Floor Number",
            featureValue: "5",
        },
        {
            featureKey: "total_floors",
            featureCategory: "Structure",
            featureName: "Total Floors in Building",
            featureValue: "10",
        },
        {
            featureKey: "furnishing",
            featureCategory: "Furnishing",
            featureName: "Furnishing Status",
            featureValue: "Semi-Furnished",
        },
        {
            featureKey: "wardrobes",
            featureCategory: "Furnishing",
            featureName: "Wardrobes",
            featureValue: "Yes",
        },
        {
            featureKey: "modular_kitchen",
            featureCategory: "Furnishing",
            featureName: "Modular Kitchen",
            featureValue: "Yes",
        },
        {
            featureKey: "air_conditioning",
            featureCategory: "Furnishing",
            featureName: "Air Conditioning",
            featureValue: "2 Units",
        },
        {
            featureKey: "geyser",
            featureCategory: "Utilities",
            featureName: "Geysers",
            featureValue: "2",
        },
        {
            featureKey: "flooring",
            featureCategory: "Interior",
            featureName: "Flooring Type",
            featureValue: "Vitrified Tiles",
        },
        {
            featureKey: "parking",
            featureCategory: "Utilities",
            featureName: "Parking Available",
            featureValue: "1 Covered",
        },
        {
            featureKey: "power_backup",
            featureCategory: "Utilities",
            featureName: "Power Backup",
            featureValue: "Partial",
        },
        {
            featureKey: "water_supply",
            featureCategory: "Utilities",
            featureName: "Water Supply",
            featureValue: "24 Hours",
        },
        {
            featureKey: "direction_facing",
            featureCategory: "Structure",
            featureName: "Property Facing",
            featureValue: "East",
        },
        {
            featureKey: "security_system",
            featureCategory: "Safety",
            featureName: "Video Door Security",
            featureValue: "Yes",
        },
        {
            featureKey: "intercom",
            featureCategory: "Safety",
            featureName: "Intercom Facility",
            featureValue: "Yes",
        },
        {
            featureKey: "servant_room",
            featureCategory: "Amenities",
            featureName: "Servant Room",
            featureValue: "No",
        },
        {
            featureKey: "study_room",
            featureCategory: "Amenities",
            featureName: "Study Room",
            featureValue: "Yes",
        },
        {
            featureKey: "pooja_room",
            featureCategory: "Amenities",
            featureName: "Pooja Room",
            featureValue: "Yes",
        },
    ];

    try {
        let val = propertyFeaturesList;
        res.status(200).send({
            status: 200, message: "Success", data: val != null ? val : [],
        });
    } catch (err) {
        console.error(`Error occured`, err.message);
        console.error("❌ Sequelize validation error:", err.errors || err);
        res.status(500).send({
            status: 500, message: err.message || "Some error occurred while creating the Tutorial.",
        });
        next(err);
    }
}



async function getPropertyConfiguration(req, res, next) {
    const {} =  req.query;
    const propertyConfigList = [
        {
            featureKey: "bedrooms",
            featureCategory: "Interior",
            featureName: "Bedrooms",
            featureValue: "3",
        },
        {
            featureKey: "bathrooms",
            featureCategory: "Interior",
            featureName: "Bathrooms",
            featureValue: "2",
        },
        {
            featureKey: "balconies",
            featureCategory: "Interior",
            featureName: "Balconies",
            featureValue: "2",
        },
        {
            featureKey: "floor_number",
            featureCategory: "Structure",
            featureName: "Floor Number",
            featureValue: "5",
        },
        {
            featureKey: "total_floors",
            featureCategory: "Structure",
            featureName: "Total Floors in Building",
            featureValue: "10",
        },
        {
            featureKey: "furnishing",
            featureCategory: "Furnishing",
            featureName: "Furnishing Status",
            featureValue: "Semi-Furnished",
        },
        {
            featureKey: "wardrobes",
            featureCategory: "Furnishing",
            featureName: "Wardrobes",
            featureValue: "Yes",
        },
        {
            featureKey: "modular_kitchen",
            featureCategory: "Furnishing",
            featureName: "Modular Kitchen",
            featureValue: "Yes",
        },
        {
            featureKey: "air_conditioning",
            featureCategory: "Furnishing",
            featureName: "Air Conditioning",
            featureValue: "2 Units",
        },
        {
            featureKey: "geyser",
            featureCategory: "Utilities",
            featureName: "Geysers",
            featureValue: "2",
        },
        {
            featureKey: "flooring",
            featureCategory: "Interior",
            featureName: "Flooring Type",
            featureValue: "Vitrified Tiles",
        },
        {
            featureKey: "parking",
            featureCategory: "Utilities",
            featureName: "Parking Available",
            featureValue: "1 Covered",
        },
        {
            featureKey: "power_backup",
            featureCategory: "Utilities",
            featureName: "Power Backup",
            featureValue: "Partial",
        },
        {
            featureKey: "water_supply",
            featureCategory: "Utilities",
            featureName: "Water Supply",
            featureValue: "24 Hours",
        },
        {
            featureKey: "direction_facing",
            featureCategory: "Structure",
            featureName: "Property Facing",
            featureValue: "East",
        },
        {
            featureKey: "security_system",
            featureCategory: "Safety",
            featureName: "Video Door Security",
            featureValue: "Yes",
        },
        {
            featureKey: "intercom",
            featureCategory: "Safety",
            featureName: "Intercom Facility",
            featureValue: "Yes",
        },
        {
            featureKey: "servant_room",
            featureCategory: "Amenities",
            featureName: "Servant Room",
            featureValue: "No",
        },
        {
            featureKey: "study_room",
            featureCategory: "Amenities",
            featureName: "Study Room",
            featureValue: "Yes",
        },
        {
            featureKey: "pooja_room",
            featureCategory: "Amenities",
            featureName: "Pooja Room",
            featureValue: "Yes",
        },
    ];

    try {
        let val = propertyConfigList;
        res.status(200).send({
            status: 200, message: "Success", data: val != null ? val : [],
        });
    } catch (err) {
        console.error(`Error occured`, err.message);
        console.error("❌ Sequelize validation error:", err.errors || err);
        res.status(500).send({
            status: 500, message: err.message || "Some error occurred while creating the Tutorial.",
        });
        next(err);
    }
}




async function getProjectConfiguration(req, res, next) {
    const {} =  req.query;
    const projectConfigList = [
        {
            featureKey: "bedrooms",
            featureCategory: "Interior",
            featureName: "Bedrooms",
            featureValue: "3",
        },
        {
            featureKey: "bathrooms",
            featureCategory: "Interior",
            featureName: "Bathrooms",
            featureValue: "2",
        },
        {
            featureKey: "balconies",
            featureCategory: "Interior",
            featureName: "Balconies",
            featureValue: "2",
        },
        {
            featureKey: "floor_number",
            featureCategory: "Structure",
            featureName: "Floor Number",
            featureValue: "5",
        },
        {
            featureKey: "total_floors",
            featureCategory: "Structure",
            featureName: "Total Floors in Building",
            featureValue: "10",
        },
        {
            featureKey: "furnishing",
            featureCategory: "Furnishing",
            featureName: "Furnishing Status",
            featureValue: "Semi-Furnished",
        },
        {
            featureKey: "wardrobes",
            featureCategory: "Furnishing",
            featureName: "Wardrobes",
            featureValue: "Yes",
        },
        {
            featureKey: "modular_kitchen",
            featureCategory: "Furnishing",
            featureName: "Modular Kitchen",
            featureValue: "Yes",
        },
        {
            featureKey: "air_conditioning",
            featureCategory: "Furnishing",
            featureName: "Air Conditioning",
            featureValue: "2 Units",
        },
        {
            featureKey: "geyser",
            featureCategory: "Utilities",
            featureName: "Geysers",
            featureValue: "2",
        },
        {
            featureKey: "flooring",
            featureCategory: "Interior",
            featureName: "Flooring Type",
            featureValue: "Vitrified Tiles",
        },
        {
            featureKey: "parking",
            featureCategory: "Utilities",
            featureName: "Parking Available",
            featureValue: "1 Covered",
        },
        {
            featureKey: "power_backup",
            featureCategory: "Utilities",
            featureName: "Power Backup",
            featureValue: "Partial",
        },
        {
            featureKey: "water_supply",
            featureCategory: "Utilities",
            featureName: "Water Supply",
            featureValue: "24 Hours",
        },
        {
            featureKey: "direction_facing",
            featureCategory: "Structure",
            featureName: "Property Facing",
            featureValue: "East",
        },
        {
            featureKey: "security_system",
            featureCategory: "Safety",
            featureName: "Video Door Security",
            featureValue: "Yes",
        },
        {
            featureKey: "intercom",
            featureCategory: "Safety",
            featureName: "Intercom Facility",
            featureValue: "Yes",
        },
        {
            featureKey: "servant_room",
            featureCategory: "Amenities",
            featureName: "Servant Room",
            featureValue: "No",
        },
        {
            featureKey: "study_room",
            featureCategory: "Amenities",
            featureName: "Study Room",
            featureValue: "Yes",
        },
        {
            featureKey: "pooja_room",
            featureCategory: "Amenities",
            featureName: "Pooja Room",
            featureValue: "Yes",
        },
    ];

    try {
        let val = projectConfigList;
        res.status(200).send({
            status: 200, message: "Success", data: val != null ? val : [],
        });
    } catch (err) {
        console.error(`Error occured`, err.message);
        console.error("❌ Sequelize validation error:", err.errors || err);
        res.status(500).send({
            status: 500, message: err.message || "Some error occurred while creating the Tutorial.",
        });
        next(err);
    }
}



module.exports = {
    saveDeveloper,
    saveProject,
    saveProperty,
    savePropertyAttachment,
    saveProjectAttachment,
    getProjectFeatures,
    getProjectConfiguration,
    getPropertyFeatures,
    getPropertyConfiguration
};
