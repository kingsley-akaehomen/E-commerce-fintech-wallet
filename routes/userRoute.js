const express = require("express");
const router = express.Router();
const { registerUser,
    loginUser,
    logOut,
    getUser,
    getLoginStatus,
    updateUser,
    updatePhoto
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);
router.get("/getUser", protect, getUser);
router.get("/getLoginStatus", getLoginStatus);
router.patch("/updateUser", protect, updateUser);
router.patch("/updatePhoto", protect, updatePhoto);


module.exports = router;