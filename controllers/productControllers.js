const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { default: mongoose } = require("mongoose");
const { ObjectId } = mongoose.Schema;



//api/products
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        sku,
        category,
        brand,
        quantity,
        price,
        description,
        image,
        regularPrice,
        color
    } = req.body

    const isSku = await Product.findOne({ sku }).exec();
    if (isSku) {
        res.status(400);
        throw new Error(`A product with this sku number ${sku} already exist `)
    }
    //check for empty fields
    if (!name || !category || !brand || !quantity || !description || !price) {
        return res.status(400).json("All fields are mandatory");
    }

    const product = await Product.create({
        name,
        sku,
        category,
        brand,
        quantity,
        price,
        description,
        image,
        regularPrice,
        color
    })

    res.status(201).json(product);

});


//Get all products
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().sort("-createdAt");
    res.status(200).json(products);
});

//Get single product
//api/products/:id
const getProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);
    //check if product exists
    if (!product) {
        res.status(404);
        throw new Error("Product not found")
    };

    res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);
    //check if product exists
    if (!product) {
        res.status(404);
        throw new Error("Product not found")
    };

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product was deleted" });

});

//Update product
//api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
    const { name,
        category,
        brand,
        quantity,
        price,
        description,
        image,
        regularPrice,
        color } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found")
    };

    // update a product
    const updatedProduct = await Product.findByIdAndUpdate(
        { _id: req.params.id },
        {
            name,
            category,
            brand,
            quantity,
            price,
            description,
            image,
            regularPrice,
            color
        },
        {
            new: true,
            runValidators: true // mongoose will enforce all validation rules in your schema
        }
    );

    res.status(200).json(updatedProduct);
});

// To review a product
const reviewProduct = asyncHandler(async (req, res) => {
    const { star, review, reviewDate } = req.body;
    const { id } = req.params;

    //validation
    if (star < 1 || !review) {
        res.status(400);
        throw new Error("Please add a star and a review")
    };

    //check for product
    const product = await Product.findById(id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    };

    //Update product rating
    product.ratings.push(
        {
            star,
            review,
            reviewDate,
            name: req.user.name,
            userId: req.user._id
        }
    )

    product.save();
    res.status(200).json({ message: "Product review has been added" });
});

//Delete a review
//api/products/deleteReview/:id
const deleteReview = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    //const { userId } = req.body;
    //Check if the product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("This product is not found")
    };

    const newRatings = product.ratings.filter((rating) => {
        return rating.userId.toString() !== userId.toString()
    });
    product.ratings = newRatings
    product.save()
    res.status(200).json("Product review deleted ")
});

//Update review
const updateReview = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { star, review, reviewDate } = req.body;
    const id = req.params.id;

    //Validation
    if (star < 1 || !review) {
        res.status(400);
        throw new Error("Please add a star and a review")
    };

    //check for product 
    const product = await Product.findById(id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    };

    const rating = product.ratings.find((rating) => {
        return rating.userId.toString() === userId.toString();
    });

    if (!rating || rating.userId.toString() !== userId.toString()) {
        res.status();
        throw new Error("User not authorized")
    }

    //Update the product
    const updatedProduct = await Product.findOneAndUpdate(
        {
            _id: id,
            "ratings.userId": userId
        },
        {
            $set: {
                "ratings.$.star": star,
                "ratings.$.review": review,
                "ratings.$.reviewDate": reviewDate
            },
        },
        {
            new: true
        }

    )

    if (updatedProduct) {
        res.status(200).json({message: "Review successfully updated", product: updatedProduct})
    } else {
        res.status(400).json({status: "Failed to update review"})
    }

})

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    reviewProduct,
    deleteReview,
    updateReview
};