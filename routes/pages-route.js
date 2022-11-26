const express = require("express");
const { check } = require("express-validator");

const pagesController = require("../controllers/pages-controllers");
const router = express.Router();

router.get("/:pid", pagesController.getPageById);
router.get("/user/:uid", pagesController.getPagesByUser); //dynamic segment

router.post("/", check("name").not().isEmpty(), pagesController.createPage);

router.patch("/:pid", check("name").not().isEmpty(), pagesController.updatePageById);
router.delete("/:pid", pagesController.deletePageById);

module.exports = router;
