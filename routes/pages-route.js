const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const store = require("../middleware/multer");

const pagesController = require("../controllers/pages-controllers");
const sectionController = require("../controllers/section-controllers");

const checkAuth = require("../middleware/check-auth");

router.get("/:pid", pagesController.getPageById);
router.get("/user/:uid", pagesController.getPagesByUser); //dynamic segment
router.get("/DT/:url", pagesController.getCustomUrl);

router.use(checkAuth); // Any route after this middleware, it will be secured
router.patch("/:pid", store.any(), pagesController.updatePageById);
router.post("/", check("name").not().isEmpty(), pagesController.createPage);

router.delete("/:pid", pagesController.deletePageById);

// Section
router.post(
  "/:pageId/aditional-section",
  store.any(),
  sectionController.createSection
);
router.get(
  "/:pageId/aditional-section",
  sectionController.getSectionByPageId
);

module.exports = router;
