const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  welcomeTitle: { type: String, required: false },
  welcomeDescription: { type: String, required: false },

  aboutUsTitle: { type: String, required: false },
  aboutUsDescription: { type: String, required: false },

  teamTitle: { type: String, required: false },

  team: [
    {
      memberName: {
        type: String,
        required: false,
      },
      memberJobTitle: {
        type: String,
        required: false,
      },
      memberDescription: {
        type: String,
        required: false,
      },
    },
  ],

  pageId: { type: mongoose.Types.ObjectId, required: true, ref: "Page" },
});

module.exports = mongoose.model("Section", sectionSchema);
