const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateMSSchema = new Schema({
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  brand: { type: String, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
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

module.exports = mongoose.model("TemplateMS", templateMSSchema);
