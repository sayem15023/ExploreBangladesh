const express = require("express");
const tipController = require("./../controller/tipsController");
const authController = require("./../controller/authController");

const router = express.Router({ mergeParams: true });

router.get("/", tipController.getAllTips);
router.post("/", authController.authenticate, tipController.createTip);

module.exports = router;
