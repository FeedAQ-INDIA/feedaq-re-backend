const express = require("express");
const router = express.Router();
const genericController = require("../controller/Generic.controller.js");
const searchController = require("../controller/Search.controller.js");
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

router.get("/search", userIdExtracter,   searchController.searchProperties);




module.exports = router;
