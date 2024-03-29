const fs = require("fs");
const HttpError = require("../models/http-error");
const TemplateJS = require("../models/templateJewelleryStore");

// POST http://localhost:8080/api/RE/template
const createAd = (req, res, next) => {
  // get the uploaded files and other fields from the request
  const files = req.files;
  const {
    pageId,
    price,
    category,
    brand,
    adTitle,
    description,
    gems,
    color,
    metal,
  } = req.body;
  if (!files) {
    res.status(400).send("Please choose files");
    return;
  }

  // create object to store data in the collection
  let finalImg = {
    pageId,
    price,
    category,
    brand,
    adTitle,
    description,
    gems,
    color,
    metal,
    images: [],
  };

  // iterate over the files and push them into the array
  files.forEach((file, index) => {
    let img = fs.readFileSync(file.path);
    let encode_image = img.toString("base64");

    finalImg.images.push({
      filename: file.originalname,
      contentType: file.mimetype,
      imageBase64: encode_image,
    });
  });

  // save the object to the collection
  let newUpload = new TemplateJS(finalImg);
  newUpload
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

// GET http://localhost:8080/api/RE/template/:pageId
const getTemplatesByPageId = (req, res, next) => {
  const pageId = req.params.pageId;

  // Use the pageId to find the templates (houses) that belong to the page
  TemplateJS.find({ pageId: pageId })
    .then((templates) => {
      // Transform the templates into plain JavaScript objects with the correct field names and formatting
      const transformedTemplates = templates.map((template) =>
        template.toObject({ getters: true })
      );

      res.status(200).json({
        message: "Templates retrieved successfully",
        templates: transformedTemplates,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

// GET http://localhost:8080/api/RE/template/templates/:tid
const getTemplateById = async (req, res, next) => {
  const templateId = req.params.tid;
  let template;

  try {
    template = await TemplateJS.findById(templateId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a template with that ID.",
      500
    );
    return next(error);
  }

  if (!template) {
    // HttpError(messsage, status code)
    const error = new HttpError(
      "Could not find a template for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ template: template.toObject({ getters: true }) });
};

// PATCH http://localhost:8080/api/RE/template/:tid
const updateTemplateById = async (req, res, next) => {
  const templateId = req.params.tid;

  const files = req.files;
  const { price, category, brand, adTitle, description, gems, metal, color } =
    req.body;

  const updates = {};

  if (price) {
    updates.price = price;
  }

  if (brand) {
    updates.brand = brand;
  }

  if (adTitle) {
    updates.adTitle = adTitle;
  }
  if (description) {
    updates.description = description;
  }

  if (category) {
    updates.category = category;
  }

  if (gems) {
    updates.gems = gems;
  }

  if (metal) {
    updates.metal = metal;
  }

  if (color) {
    updates.color = color;
  }
  console.log("Updates object:", updates);

  if (files && files.length > 0) {
    // create an images array to store the images
    updates.images = [];
    // iterate over the files and push them into the array
    files.forEach((file, index) => {
      let img = fs.readFileSync(file.path);
      let encode_image = img.toString("base64");

      updates.images.push({
        filename: file.originalname,
        contentType: file.mimetype,
        imageBase64: encode_image,
      });
    });
  }

  // update the template document in the database
  TemplateJS.findByIdAndUpdate(templateId, updates)
    .then(() => {
      res.status(200).json({ message: "Template updated successfully!" });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// DELETE http://localhost:8080/api/RE/template/:tid
const deleteTemplateById = async (req, res, next) => {
  const templateId = req.params.tid;

  let template;

  try {
    template = await TemplateJS.findById(templateId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete template.",
      500
    );
    return next(error);
  }

  if (!template) {
    const error = new HttpError("Could find template for this ID.", 404);
    return next(error);
  }

  try {
    await template.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the template.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted template!" });
};

exports.createAd = createAd;
exports.getTemplatesByPageId = getTemplatesByPageId;
exports.updateTemplateById = updateTemplateById;
exports.getTemplateById = getTemplateById;
exports.deleteTemplateById = deleteTemplateById;
