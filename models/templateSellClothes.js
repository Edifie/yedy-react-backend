const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateSCSchema = new Schema({
  price: { type: Number, required: true },
  category: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  details: { type: String, required: true },
  material: { type: String, required: true },
  adTitle: { type: String, required: true },
  brand: { type: String, required: true },
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

module.exports = mongoose.model("TemplateSC", templateSCSchema);
