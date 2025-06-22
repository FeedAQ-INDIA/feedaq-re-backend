const express = require("express");
const router = express.Router();
const genericController = require("../controller/Generic.controller.js");
const listingController = require("../controller/ManageListing.controller.js");
const propertySearchController = require("../controller/PropertySearch.controller.js");
const projectSearchController = require("../controller/ProjectSearch.controller.js");
const agentSearchController = require("../controller/AgentSearch.controller.js");
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


router.post("/saveProperty", userIdExtracter,   listingController.saveProperty);
router.post("/saveProject", userIdExtracter,   listingController.saveProject);
router.post("/saveDeveloper", userIdExtracter,   listingController.saveDeveloper);


module.exports = router;
