const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const Category = require("../models/categoryModel");
const slugify = require("slugify");

//Creating a brand POST
const createBrand = asyncHandler(async(req, res) => {
    const { name, category } = req.body;
     
    //Validation
    if (!name || !category) {
      res.status(400);
      throw new Error("All fields are required")
    }
      const categoryExists = await Category.findOne({ name: category });
  
      if(!categoryExists) {
          res.status(400);
          throw new Error("Parent Category  not found")
      };
  
      const brand = await Brand.create({
          name,
          slug: slugify(name),
          category
      })
  
      res.status(201).json(brand);
});

// Get brand
const getBrands = asyncHandler(async(req, res) => {
    const brands = await Brand.find().sort("-createdAt");
    res.status(200).json(brands);
});

//Delete brand
const deleteBrand = asyncHandler(async(req, res) => {
    const slug = req.params.slug.toLowerCase(); 
    //Check if the category exist
    const brand = await Brand.findOne({slug});
    if (!brand) {
        res.status(404);
        throw new Error("This Category was not found");
    }

    await Brand.findOneAndDelete({slug});
    res.status(200).json({message: "This brand was successfully deleted"});
});

module.exports = { createBrand, getBrands, deleteBrand };