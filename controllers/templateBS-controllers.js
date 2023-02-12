const fs = require("fs");
const HttpError = require("../models/http-error");
const TemplateBS = require("../models/templateBookStore");

// POST http://localhost:8080/api/BS/template
const createAd = (req, res, next) => {
  // get the uploaded files and other fields from the request
  const files = req.files;
  const {
    pageId,
    price,
    subCategory,
    category,
    writer,
    language,
    adTitle,
    description,
    publisher,
    numberOfPage,
    printYear,
  } = req.body;
  if (!files) {
    res.status(400).send("Please choose files");
    return;
  }

  // create object to store data in the collection
  let finalImg = {
    pageId,
    price,
    subCategory,
    category,
    writer,
    language,
    adTitle,
    description,
    publisher,
    numberOfPage,
    printYear,
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
  let newUpload = new TemplateBS(finalImg);
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

// GET http://localhost:8080/api/BS/template/:pageId
const getTemplatesByPageId = (req, res, next) => {
  const pageId = req.params.pageId;

  // Use the pageId to find the templates (houses) that belong to the page
  TemplateBS.find({ pageId: pageId })
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

// GET http://localhost:8080/api/BS/template/templates/:tid
const getTemplateById = async (req, res, next) => {
  const templateId = req.params.tid;
  let template;

  try {
    template = await TemplateBS.findById(templateId);
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

// PATCH http://localhost:8080/api/BS/template/:tid
const updateTemplateById = async (req, res, next) => {
  const templateId = req.params.tid;

  const files = req.files;
  const {
    pageId,
    price,
    subCategory,
    category,
    writer,
    language,
    adTitle,
    description,
    publisher,
    numberOfPage,
    printYear,
  } = req.body;

  const updates = {};

  if (price) {
    updates.price = price;
  }
  if (subCategory) {
    updates.subCategory = subCategory;
  }
  if (writer) {
    updates.writer = writer;
  }
  if (language) {
    updates.language = language;
  }
  if (adTitle) {
    updates.adTitle = adTitle;
  }
  if (description) {
    updates.description = description;
  }
  if (publisher) {
    updates.publisher = publisher;
  }
  if (numberOfPage) {
    updates.numberOfPage = numberOfPage;
  }
  if (printYear) {
    updates.printYear = printYear;
  }
  if (category) {
    updates.category = category;
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
  TemplateBS.findByIdAndUpdate(templateId, updates)
    .then(() => {
      res.status(200).json({ message: "Template updated successfully!" });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// DELETE http://localhost:8080/api/BS/template/:tid
const deleteTemplateById = async (req, res, next) => {
  const templateId = req.params.tid;

  let template;

  try {
    template = await TemplateBS.findById(templateId);
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
exports.getTemplateById = getTemplateById;
exports.updateTemplateById = updateTemplateById;
exports.deleteTemplateById = deleteTemplateById;
