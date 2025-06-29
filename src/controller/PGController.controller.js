const jwt = require("jsonwebtoken");
const lodash = require("lodash");
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const logger = require("../config/winston.config");
 const PGListingService =  require("../service/PGListingService.service.js");

async function savePG(req, res, next) {
    const {} = req.body;
    console.log("Request body:", req.body);

    try {
        let val = await PGListingService.savePG(req);
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

async function savePGRoom(req, res, next) {
    const {} = req.body;
    console.log("Request body:", req.body);

    try {
        let val = await PGListingService.savePGRoom(req);
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


async function savePGAttachment(req, res, next) {
    const {} = req.body;
    console.log("Request body:", req.body);

    try {
        let val = await PGListingService.savePGAttachment(req);
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


async function savePGFeature(req, res, next) {
    const {} = req.body;
    console.log("Request body:", req.body);

    try {
        let val = await PGListingService.savePGFeature(req);
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
    savePGFeature, savePGRoom, savePGAttachment, savePG
};