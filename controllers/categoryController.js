const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const slugify = require("slugify");


// Create a Category
//api/categories/createCategory POST
const createCategory = asyncHandler(async(req, res) => {
  const { name } = req.body;
  console.log(name)
   
  //Validation
  if (!name) {
    res.status(400);
    throw new Error("Please add a category name")
  }
    const categoryExists = await Category.findOne({ name });

    if(categoryExists) {
        res.status(400);
        throw new Error("Category name already exists")
    };

    const category = await Category.create({
        name,
        slug: slugify(name)
    })

    res.status(201).json(category);
});

// Get  Categories
//api/categories/ GET
const getCategories = asyncHandler(async(req, res) => {
    const categoriess = await Category.find().sort("-createdAt");
    res.status(200).json(categoriess);
})

//Delete a category
//api/categories/:slug

const deleteCategory = asyncHandler(async(req, res) => {
    const slug = req.params.slug.toLowerCase(); 
    //Check if the category exist
    const brand = await Brand.findOne({slug});
    if (!brand) {
        res.status(400);
        throw new Error("This Brand was not found");
    }

    await Brand.findOneAndDelete({slug});
    res.status(200).json({message: "Brand was successfully deleted"});
})


module.exports = { createCategory, getCategories, deleteCategory };