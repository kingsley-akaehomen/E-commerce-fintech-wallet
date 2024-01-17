const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        uppercase: true,
        required: [true, "Please add a Coupon name"],
        trim: true,
        minLength: [6, "minimum of 6 characters"],
        maxLength: [12, "maximum of 12 characters"]

    },

    discount: {
        type: Number,
        required: true
    },

    expiresAt: {
        type: Date,
        //type: String,
        required: true
    }

  
},
    {
        timestamps: true
    }
)

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;