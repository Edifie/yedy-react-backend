const express = require("express");
const router = express.Router()
const store = require("../middleware/multer")

const templateREControllers = require("../controllers/templateRE-controllers")

router.post('/template',  store.any(), templateREControllers.createAd)
router.get('/template/:pageId', templateREControllers.getTemplatesByPageId)

module.exports = router;
