const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  images: [{
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    imageBase64: {
        type: String,
        required: true
    }
}],
  pages: [{ type: mongoose.Types.ObjectId, required: true, ref: "Page" }],
});


userSchema.plugin(uniqueValidator); // tird party library of mongoose to get the unique property and check if it is unique in the db

module.exports = mongoose.model("User", userSchema);
