const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateRESchema = new Schema({
  price: { type: Number, required: true },
  location: {
    type: String,
    required: true,
  },
  category: { type: String, required: true },
  numberOfRooms: { type: Number, required: true },
  adStatus: { type: String, required: true },
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  metreSquare: { type: Number, required: true },
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

module.exports = mongoose.model("TemplateRE", templateRESchema);
