const express = require("express");
const {
    createCoupon,
    deleteCoupon,
    getCoupons,
    getCoupon
} = require("../controllers/couponController");
const { protect, adminOnly } = require("../middleware/authMiddleware")
const router = express.Router();

//API endpoints - route
router.post("/createCoupon", protect, adminOnly, createCoupon);
router.delete("/deleteCoupon/:id", protect, adminOnly, deleteCoupon);
router.get("/getCoupons", protect, adminOnly, getCoupons);
router.get("/:couponName", protect, getCoupon);

module.exports = router;