const express = require("express");
const router = express.Router();
const store = require("../middleware/multer");

const templateBSControllers = require("../controllers/templateBS-controllers");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth); // Any route after this middleware, it will be secured

router.post("/template", store.any(), templateBSControllers.createAd);
router.get("/template/:pageId", templateBSControllers.getTemplatesByPageId);
router.get("/template/templates/:tid", templateBSControllers.getTemplateById);
router.patch(
  "/template/:tid",
  store.any(),
  templateBSControllers.updateTemplateById
);
router.delete("/template/:tid", templateBSControllers.deleteTemplateById);

module.exports = router;
