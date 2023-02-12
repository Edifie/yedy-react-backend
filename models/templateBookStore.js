const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateBSSchema = new Schema({
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  description: { type: String, required: true },
  adTitle: { type: String, required: true },
  writer: { type: String, required: true },
  language: { type: String, required: true },
  publisher: { type: String, required: true },
  numberOfPage: { type: Number, required: true },
  printYear: { type: Number, required: true },
  images: [
    {
      filename: {
        type: String,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
      imageBase64: {
        type: String,
        required: true,
      },
    },
  ],
  pageId: { type: mongoose.Types.ObjectId, required: true, ref: "Page" },
});

module.exports = mongoose.model("TemplateBS", templateBSSchema);
