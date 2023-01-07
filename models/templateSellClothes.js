const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateSCSchema = new Schema({
  price: { type: Number, required: false },
  category: { type: String, required: false },
  size: { type: String, required: false },
  color: { type: String, required: false },
  details: { type: String, required: false },
  material: { type: String, required: false },
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
