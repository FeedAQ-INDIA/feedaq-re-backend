const jwt = require("jsonwebtoken");
const lodash = require("lodash");
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const logger = require("../config/winston.config");
const AcademyService = require("../service/AcademyService.service.js");


async function getUser(req, res, next) {
    const {} = req.body;
    try {
        let val = await AcademyService.getUser(req.user.userId);
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



async function searchRecord(req, res, next) {
    const {
        searchValue, searchKey, attributes, limit, offset, sortBy, sortOrder, filters, associate,
    } = req.body;
    try {
        let val = await AcademyService.searchRecord(req, res);
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



async function saveUserDetail(req, res, next) {
    const {
        firstName ,
        lastName ,
        number ,
        profilePic
    } = req.body;
    try {
        let val = await AcademyService.saveUserDetail(req.user.userId, firstName ,
            lastName ,
            number ,
            profilePic );
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



async function saveUserSearchTrack(req, res, next) {
    const {
         propertyId ,
        projectId ,
        developerId ,
        isContacted
    } = req.body;
    try {
        let val = await AcademyService.saveUserSearchTrack(req.user.userId,
            propertyId ,
            projectId ,
            developerId ,
            isContacted);
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


async function saveUserFav(req, res, next) {
    const {
        propertyId ,
        projectId ,
        developerId ,
    } = req.body;
    try {
        let val = await AcademyService.saveUserFav(req.user.userId,
            propertyId ,
            projectId ,
            developerId);
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


async function deleteUserFav(req, res, next) {
    const {
        userId,
        favId
    } = req.body;
    try {
        let val = await AcademyService.deleteUserFav(req.user.userId,
            favId);
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
     getUser,
    searchRecord,
    deleteUserFav,
    saveUserFav,
    saveUserDetail,
    saveUserSearchTrack
};
