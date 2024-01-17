const express = require("express");
const {
    createCategory,
    getCategories,
    deleteCategory
} = require("../controllers/categoryController");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware")

//API endpoints - route
router.post("/createCategory", protect, adminOnly, createCategory)
router.get("/getCategories", protect, adminOnly, getCategories);
router.delete("/:slug", protect, adminOnly, deleteCategory);

module.exports = router;