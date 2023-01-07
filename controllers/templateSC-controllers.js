const fs = require("fs");
const HttpError = require("../models/http-error");
const TemplateSC = require("../models/templateSellClothes");

// POST http://localhost:8080/api/SC/template
const createAd = (req, res, next) => {
  const files = req.files;

  const { price, category, size, color, details, material } = req.body;

  if (!files) {
    res.status(400).send("Please choose files");
    return;
  }

  let finalItem = {
    pageId,
    price,
    category,
    size,
    color,
    details,
    material,
    images: [],
  };

  files.forEach((file, index) => {
    let img = fs.readFileSync(file.path);
    let encode_image = img.toString("base64");

    finalItem.images.push({
      filename: file.originalname,
      contentType: file.mimetype,
      imageBase64: encode_image,
    });
  });

  let newItem = new TemplateSC(finalItem);
  newItem
    .save()
    .then(() => {
      res
        .status(200)
        .json({ message: "Files and other fields saved successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// GET http://localhost:8080/api/SC/template/:pageId
const getTemplatesByPageId = (req, res, next) => {};

// GET http://localhost:8080/api/SC/template/templates/:cid

const getTemplateById = async (req, res, next) => {};

// PATCH http://localhost:8080/api/SC/template/:cid
const updateTemplateById = async (req, res, next) => {};

// DELETE http://localhost:8080/api/SC/template/:cid
const deleteTemplateById = async (req, res, next) => {};

exports.createAd = createAd;
exports.getTemplatesByPageId = getTemplatesByPageId;
exports.updateTemplateById = updateTemplateById;
exports.getTemplateById = getTemplateById;
exports.deleteTemplateById = deleteTemplateById;
