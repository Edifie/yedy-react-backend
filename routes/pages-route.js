const express = require("express");

const pagesController = require("../controllers/pages-controllers");
const router = express.Router();

router.get("/:pid", pagesController.getPageById);
router.get("/user/:uid", pagesController.getPageByUser); //dynamic segment

router.post("/", pagesController.createPage);

module.exports = router;
