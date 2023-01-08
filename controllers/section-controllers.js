const fs = require("fs");
const HttpError = require("../models/http-error");
const Section = require("../models/section");

// POST http://localhost:8080/api/pages/:pid/aditional-section
const createSection = (req, res, next) => {
  const files = req.files;
  console.log(req.body); // log the request object
  console.log(req.body.pageId); // log the pageId field from the request body

  const {
    pageId, // use the pageId field from the request body directly
    welcomeTitle,
    welcomeDescription,
    aboutUsTitle,
    aboutUsDescription,
    teamTitle,
    team,
  } = req.body;

  // create object to store data in the collection
  let newSection = {
    pageId,
    welcomeTitle,
    welcomeDescription,
    aboutUsTitle,
    aboutUsDescription,
    teamTitle,
    team: [],
  };

  if (team) {
    for (let i = 0; i < team.length; i++) {
      let file = files[i];
      let item = team[i];
      let img = fs.readFileSync(file.path);
      let decode_image = img.toString("base64");

      // create an array to store the decoded images
      let decodedImages = [];

      decodedImages.push({
        filename: file.originalname,
        contentType: file.mimetype,
        imageBase64: decode_image,
      });

      newSection.team.push({
        memberName: item.memberName,
        memberJobTitle: item.memberJobTitle,
        memberDescription: item.memberDescription,
        images: decodedImages,
      });
    }
  }

  // save the object to the collection
  Section.findOneAndUpdate(
    { pageId: pageId },
    newSection,
    { upsert: true, new: true, useFindAndModify: false },
    (error, doc) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res
          .status(200)
          .json({ message: "Section created/updated successfully" });
      }
    }
  );
};

// GET http://localhost:8080/api/pages/:pid/aditional-section
const getSectionByPageId = (req, res, next) => {
  const pageId = req.params.pageId;

  Section.find({ pageId: pageId })
    .then((sections) => {
      const transformedSections = sections.map((section) =>
        section.toObject({ getters: true })
      );

      res.status(200).json({
        message: "Sections retrieved successfully",
        sections: transformedSections,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.createSection = createSection;
exports.getSectionByPageId = getSectionByPageId;
