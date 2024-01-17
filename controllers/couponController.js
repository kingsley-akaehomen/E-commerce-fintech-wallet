const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");



//create a coupon
const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiresAt } = req.body;
    //validation
    if (!name || !discount || !expiresAt) {
        res.status(400);
        throw new Error("All fields must be filled");
    }

    const coupon = await Coupon.create({
        name,
        discount,
        expiresAt
    });


    res.status(201).json(coupon);
});

// Delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {

});

//get all coupons
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort("-createdAt");
    res.status(200).json(coupons);

});


//get a single coupon
const getCoupon = asyncHandler(async (req, res) => {
    //Check if coupn exists 
    const coupon = await Coupon.findOne({
        name: req.params.couponName,
        expiresAt: {
            $gt: Date.now()
        }
    });

    if (!coupon) {
        res.status(404);
        throw new Error("coupon not found or has expired")
    };

    res.status(200).json(coupon);
});

module.exports = { createCoupon, deleteCoupon, getCoupons, getCoupon };

