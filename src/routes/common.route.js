const express = require("express");
const router = express.Router();
const genericController = require("../controller/Generic.controller.js");
const listingController = require("../controller/ManageListing.controller.js");
const pgController = require("../controller/PGController.controller.js");
const propertySearchController = require("../controller/PropertySearch.controller.js");
const projectSearchController = require("../controller/ProjectSearch.controller.js");
const agentSearchController = require("../controller/AgentSearch.controller.js");
const pgSearchController = require("../controller/PGSearch.controller.js");
 const authMiddleware = require("../middleware/authMiddleware");
 const logger = require('../config/winston.config.js')
const userIdExtracter = require("../middleware/userIdExtracter");



router.get("/ping", function (req, res) {
    res.status(200).send({message: "Ping Successful"});
});

 router.post("/getUser", authMiddleware, genericController.getUser);


router.post("/search-v2", genericController.searchRecord);

router.post("/saveUserDetail", authMiddleware, genericController.saveUserDetail);
router.post("/saveUserSearchTrack", authMiddleware, genericController.saveUserSearchTrack);

router.post("/saveUserFav", authMiddleware, genericController.saveUserFav);
router.post("/deleteUserFav", authMiddleware, genericController.deleteUserFav);

router.post("/registerAgent", authMiddleware, genericController.registerAgent);
router.post("/deregisterAgent", authMiddleware, genericController.saveUserFav);


router.get("/search", userIdExtracter,   propertySearchController.searchProperties);
router.get("/searchProject", userIdExtracter,   projectSearchController.searchProjects);
router.get("/searchAgent", userIdExtracter,   agentSearchController.searchAgents);
router.get("/searchPG", userIdExtracter,   pgSearchController.searchPG);


router.post("/saveProperty", authMiddleware,   listingController.saveProperty);
router.post("/saveProject", authMiddleware,   listingController.saveProject);
router.post("/saveDeveloper", authMiddleware,   listingController.saveDeveloper);

router.get("/getProjectFeatures",   listingController.getProjectFeatures);
router.get("/getProjectConfiguration",  listingController.getProjectConfiguration);
router.get("/getPropertyFeatures",  listingController.getPropertyFeatures);
router.get("/getPropertyConfiguration", listingController.getPropertyConfiguration);


router.post("/savePG", authMiddleware,   pgController.savePG);
router.post("/savePGRoom", authMiddleware,   pgController.savePGRoom);
router.post("/savePGAttachment", authMiddleware,   pgController.savePGAttachment);
router.post("/savePGFeature", authMiddleware,   pgController.savePGFeature);



module.exports = router;
