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
      if (files[i]) {
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
  }

  // save the object to the collection
  let newUpload = new Section(newSection);
  newUpload
    .save()
    .then(() => {
      res.status(200).json({ message: "Sections saved successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
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

const updateSection = async (req, res, next) => {
  const files = req.files;
  const {
    pageId,
    welcomeTitle,
    welcomeDescription,
    aboutUsTitle,
    aboutUsDescription,
    team,
    teamTitle,
  } = req.body;
  let updates = {};

  //update other fields if they are provided in the request body
  if (welcomeTitle) {
    updates.welcomeTitle = welcomeTitle;
  }
  if (welcomeDescription) {
    updates.welcomeDescription = welcomeDescription;
  }
  if (aboutUsTitle) {
    updates.aboutUsTitle = aboutUsTitle;
  }
  if (aboutUsDescription) {
    updates.aboutUsDescription = aboutUsDescription;
  }
  if (teamTitle) {
    updates.teamTitle = teamTitle;
  }

  if (team) {
    let teamPromises = []; //create an empty array to store promises for updating or creating team members
    team.forEach((item, i) => { // item -> current team member being processed, i-> index in the array
      let decodedImages = [];
      if (files[i]) {
        let file = files[i];
        let img = fs.readFileSync(file.path);
        let decode_image = img.toString("base64");

        decodedImages.push({
          filename: file.originalname,
          contentType: file.mimetype,
          imageBase64: decode_image,
        });
      }
      let teamMember = {
        memberName: item.memberName,
        memberJobTitle: item.memberJobTitle,
        memberDescription: item.memberDescription,
        images: decodedImages,
      };
      if (item._id) {
        //update existing team member
        teamPromises.push(
          Section.findByIdAndUpdate(
            item._id,
            { $set: teamMember },
            { new: true }
          )
        );
      } else {
        //create new team member
        let newTeamMember = new Section(teamMember);
        teamPromises.push(newTeamMember.save());
      }
    });

    Promise.all(teamPromises)
      .then((result) => {
        res.status(200).json({ message: "Section updated successfully!" });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  } else {
    //update other fields if no team member provided
    Section.findOneAndUpdate({ pageId: pageId }, updates)
      .then(() => {
        res.status(200).json({ message: "Section updated successfully!" });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }
};

exports.createSection = createSection;
exports.getSectionByPageId = getSectionByPageId;
exports.updateSection = updateSection;
