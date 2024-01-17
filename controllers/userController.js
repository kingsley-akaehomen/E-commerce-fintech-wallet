const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
};

//api/users/register
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // valiodation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields")
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error("password must be up tp 6 characters")
    }
    //check if user exist
    const userExists = await User.findOne({ email }).exec();
    if (userExists) {
        res.status(400);
        throw new Error("Email has already been registered")
    }

    //create new user
    const user = await User.create({
        name,
        email,
        password
    })

    // Generate token
    const token = generateToken(user._id);
    if (user) {
        const { _id, name, email, role } = user
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            // secure: true,
            // sameSite: none

        })

        res.status(201).json({
            _id, name, email, role, token
        })
    } else {
        res.status(400);
        throw new Error("Invalid user data")
    }
});

// Login in User
//api/users/login

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password")
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error("User not found");
    }

    //user exists, check if the passwoed is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    //Generate token 
    const token = generateToken(user._id);
    if (user && passwordIsCorrect) {
        const newUser = await User.findOne({ email }).select("-password")
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            // secure: true,
            // sameSite: none
        })
        res.status(201).json({
            newUser,
            token: token
        })
    } else {
        res.status(400);
        throw new Error("Invalid email or password")
    }

});

// api/users/logout

const logOut = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        // secure: true,
        // sameSite: none
    })

    res.status(200).json({ message: "Logged out successfully" });
});

//Get User or logged in user
//api/users/getUser
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(400);
        throw new Error("User not found")
    }
})

//Get login status
const getLoginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }
    //verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
        res.json(true);
    } else {
        res.json(false);
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const { name, phone, address } = user;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.address = req.body.address || address;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error("User not found")
    }

});

//Update Photo end point
const updatePhoto = asyncHandler(async (req, res) => {
    //cloudinary implemented in the front end
    const { photo } = req.body;
    const user = await User.findById(req.user._id).select("-password");
    user.photo = photo;
    const updatedUser = await user.save();
    res.status(200).json(updatedUser)
})
module.exports = { registerUser, loginUser, logOut, getUser, getLoginStatus, updateUser, updatePhoto };