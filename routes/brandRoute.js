const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    createBrand,
    deleteBrand,
    getBrands
} = require("../controllers/brandController");

//API endpoints - route
router.post("/createBrand", protect, adminOnly, createBrand)
router.get("/getBrands", protect, adminOnly, getBrands);
router.delete("/:slug", protect, adminOnly, deleteBrand);

module.exports = router;