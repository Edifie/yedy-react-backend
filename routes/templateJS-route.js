const express = require("express");
const router = express.Router();
const store = require("../middleware/multer");

const templateJSControllers = require("../controllers/templateJS-controllers");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth); // Any route after this middleware, it will be secured
router.post("/template", store.any(), templateJSControllers.createAd);

router.get("/template/:pageId", templateJSControllers.getTemplatesByPageId);
router.get("/template/templates/:tid", templateJSControllers.getTemplateById);

router.patch(
  "/template/:tid",
  store.any(),
  templateJSControllers.updateTemplateById
);

router.delete("/template/:tid", templateJSControllers.deleteTemplateById);

module.exports = router;
