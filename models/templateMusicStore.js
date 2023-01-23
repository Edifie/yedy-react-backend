const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateMSSchema = new Schema({
  price: { type: Number, required: false },
  category: { type: String, required: false },
  subCategory: { type: String, required: false },
  brand: { type: String, required: false },
  adTitle: { type: String, required: false },
  description: { type: String, required: false },
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
