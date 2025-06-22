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
};
