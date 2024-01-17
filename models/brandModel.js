const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Please add a category name"],
        trim: true,
        minLength: [2, "too short"],
        maxLength: [32, "too long"]

    },

    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },

    category: {
        type: String,
        required: true,
    },

},
    {
        timestamps: true
    }
)

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;