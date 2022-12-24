const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  area: { type: String, required: true },
  tema: { type: String, required: true },
  screenshot: { type: Buffer },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Page", pageSchema);
