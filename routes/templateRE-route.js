const express = require("express");
const router = express.Router();
const store = require("../middleware/multer");

const templateREControllers = require("../controllers/templateRE-controllers");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth); // Any route after this middleware, it will be secured
router.post("/template", store.any(), templateREControllers.createAd);

router.get("/template/:pageId", templateREControllers.getTemplatesByPageId);
router.get("/template/templates/:tid", templateREControllers.getTemplateById);

router.patch(
  "/template/:tid",
  store.any(),
  templateREControllers.updateTemplateById
);

router.delete("/template/:tid", templateREControllers.deleteTemplateById);

module.exports = router;
