const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const brandRoute = require("./routes/brandRoute");
const couponRoute = require("./routes/couponRoute");
const orderRoute = require("./routes/orderRoute");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: ["http://localhost:3000", "https://shoppar.vercel.app"],
    credentials: true
}))

//Routes
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/brands", brandRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/orders", orderRoute);

app.get("/", (req, res) => {
    res.send("Home Page....")
});

//Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database is successfully connected");
        app.listen(PORT, () => {
            console.log(`App is listening on port 🚀 ${PORT}`)
        })
    })
    .catch((err) => console.log(err))