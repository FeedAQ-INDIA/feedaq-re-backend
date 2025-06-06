const express = require("express");
const router = express.Router();
const genericController = require("../controller/Generic.controller.js");
const searchController = require("../controller/Search.controller.js");
 const authMiddleware = require("../middleware/authMiddleware");
 const logger = require('../config/winston.config.js')

router.get("/ping", function (req, res) {
    res.status(200).send({message: "Ping Successful"});
});

 router.post("/getUser", authMiddleware, genericController.getUser);


router.post("/search-v2", genericController.searchRecord);

router.post("/saveUserDetail", authMiddleware, genericController.saveUserDetail);

router.get("/search", authMiddleware,   searchController.searchProperties);




module.exports = router;
