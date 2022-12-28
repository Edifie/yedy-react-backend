const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  name: { type: String, required: true },
  area: { type: String, required: true },
  tema: { type: String, required: true },
  url: { type: String, required: true, unique: true, trim: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Page", pageSchema);
