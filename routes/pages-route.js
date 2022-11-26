const express = require("express");

const pagesController = require("../controllers/pages-controllers");
const router = express.Router();

router.get("/:pid", pagesController.getPageById);
router.get("/user/:uid", pagesController.getPagesByUser); //dynamic segment

router.post("/", pagesController.createPage);

router.patch('/:pid', pagesController.updatePageById)
router.delete('/:pid', pagesController.deletePageById)

module.exports = router;
