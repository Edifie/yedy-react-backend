const express = require("express");
const router = express.Router();
const store = require("../middleware/multer");

const templateMSControllers = require("../controllers/templateMS-controllers");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth); // Any route after this middleware, it will be secured
router.post("/template", store.any(), templateMSControllers.createAd);

router.get("/template/:pageId", templateMSControllers.getTemplatesByPageId);
router.get("/template/templates/:tid", templateMSControllers.getTemplateById);

router.patch(
  "/template/:tid",
  store.any(),
  templateMSControllers.updateTemplateById
);

router.delete("/template/:tid", templateMSControllers.deleteTemplateById);

module.exports = router;
