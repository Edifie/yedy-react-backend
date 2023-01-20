const express = require("express");
const router = express.Router();
const store = require("../middleware/multer");

const templateSCControllers = require("../controllers/templateSC-controllers");

const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

router.post("/template", store.any(), templateSCControllers.createAd);

router.get("/template/:pageId", templateSCControllers.getTemplatesByPageId);

router.get("/template/templates/:tid", templateSCControllers.getTemplateById);

router.patch(
  "/template/:tid",
  store.any(),
  templateSCControllers.updateTemplateById
);

router.delete("/template/:tid", templateSCControllers.deleteTemplateById);

module.exports = router;
