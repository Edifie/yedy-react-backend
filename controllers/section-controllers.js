const fs = require("fs");
const HttpError = require("../models/http-error");
const Section = require("../models/section");
const mongoose = require("mongoose");

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

  if (req.body.sectionId) {
    // update existing section
    if (team) {
      for (let i = 0; i < team.length; i++) {
        if (files[i]) {
          let file = files[i];
          let item = team[i];
          let img = fs.readFileSync(file.path);
          let decode_image = img.toString("base64");
          let decodedImages = [];

          decodedImages.push({
            filename: file.originalname,
            contentType: file.mimetype,
            imageBase64: decode_image,
          });
          // add the object_id to team member
          team[i]._id = new mongoose.Types.ObjectId();
          team[i].images = decodedImages;
        }
      }
    }
    Section.findByIdAndUpdate(
      req.body.sectionId,
      { $push: { team } },
      { new: true, useFindAndModify: false }
    )
      .then((result) => {
        if (result) {
          res.status(200).json({ message: "Section updated successfully" });
        } else {
          res.status(404).json({ message: "Section not found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  } else {
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
            _id: new mongoose.Types.ObjectId(),
            memberName: item.memberName,
            memberJobTitle: item.memberJobTitle,
            memberDescription: item.memberDescription,
            images: decodedImages,
          });
        }
      }
    }
    let newUpload = new Section(newSection);
    newUpload
      .save()
      .then(() => {
        res.status(200).json({ message: "Sections saved successfully" });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }

  // save the object to the collection
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

// PATCH http://localhost:8080/api/pages/:pid/aditional-section
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
    // updates.team.images = [];

    team.forEach((item, i) => {
      // item -> current team member being processed, i-> index in the array
      let teamMember = {
        _id: item._id,
        memberName: item.memberName,
        memberJobTitle: item.memberJobTitle,
        memberDescription: item.memberDescription,
      };

      if (files && files[i]) {
        let file = files[i];
        let img = fs.readFileSync(file.path);
        let decode_image = img.toString("base64");

        teamMember.images = [
          {
            filename: file.originalname,
            contentType: file.mimetype,
            imageBase64: decode_image,
          },
        ];
      }
      teamPromises.push(
        Section.updateOne(
          { pageId: pageId, "team._id": item._id },
          { $set: { "team.$": teamMember } },
          { new: false }
        )
      );
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
    Section.findOneAndUpdate({ pageId: pageId }, updates).then(() => {
      res.status(200).json({ message: "Section updated successfully!" });
    });
  }
};

// DELETE http://localhost:8080/api/pages/:sectionId/team/:teamMemberId
const deleteTeamMember = async (req, res, next) => {
  const { sectionId, teamMemberId } = req.body;

  let section;

  try {
    section = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { team: { _id: mongoose.Types.ObjectId(teamMemberId) } } },
      { new: true, useFindAndModify: false }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete team member.",
      500
    );
    return next(error);
  }

  if (!section) {
    const error = new HttpError("Could not find section for this ID.", 404);
    return next(error);
  }

  res.status(200).json({ message: "Deleted team member!" });
};

exports.createSection = createSection;
exports.getSectionByPageId = getSectionByPageId;
exports.updateSection = updateSection;
exports.deleteTeamMember = deleteTeamMember;
