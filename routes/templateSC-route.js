const express = require("express");
const router = express.Router();
const store = require("../middleware/multer");

const templateSCControllers = require("../controllers/templateSC-controllers");

const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

router.post("/template", store.any(), templateSCControllers.createAd);

module.exports = router;
