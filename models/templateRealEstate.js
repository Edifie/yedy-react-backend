const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const templateRESchema = new Schema({
    price: { type: Number, required: false },
    location: {
        type: String,
        required: false
    },
    category: { type: String, required: false },
    numberOfRooms: { type: Number, required: false },
    adStatus: { type: String, required: false },
    adTitle: { type: String, required: false },
    description: { type: String, required: false },
    metreSquare: { type: Number, required: false },
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
    pageId: { type: mongoose.Types.ObjectId, required: true, ref: "Page" },

});

module.exports = mongoose.model("TemplateRE", templateRESchema)