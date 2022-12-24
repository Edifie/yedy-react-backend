const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const pagesController = require("../controllers/pages-controllers");
const checkAuth = require("../middleware/check-auth");

router.get("/:pid", pagesController.getPageById);
router.get("/user/:uid", pagesController.getPagesByUser); //dynamic segment


router.use(checkAuth); // Any route after this middleware, it will be secured
router.put("/:pid", pagesController.updatePageById);
router.post("/", check("name").not().isEmpty(), pagesController.createPage);

router.delete("/:pid", pagesController.deletePageById);

module.exports = router;
