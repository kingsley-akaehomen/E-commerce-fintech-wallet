const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
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
    }
},
    {
        timestamps: true
    }
)

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;