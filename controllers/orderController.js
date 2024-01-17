const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const expressAsyncHandler = require("express-async-handler");
const calculateTotalPrice = require("../utils/index");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);



//Create order 
const createOrder = asyncHandler(async (req, res) => {
    const {
        orderDate,
        orderTime,
        orderAmount,
        orderStatus,
        cartItems,
        shippingAddress,
        paymentMethod,
        coupon
    } = req.body;


    // Data validation
    if (!cartItems || !orderStatus || !shippingAddress || !paymentMethod) {
        res.status(400);
        throw new Error("Data missing")
    }

    await Order.create({
        user: req.user._id,
        orderDate,
        orderTime,
        orderAmount,
        orderStatus,
        cartItems,
        shippingAddress,
        paymentMethod,
        coupon
    })

    res.status(201).json("Odrder was created")

});





//Get orders 
const getOrders = asyncHandler(async (req, res) => {
    let orders;
    if (req.user.role === "admin") {
        orders = await Order.find().sort("-createdAt");
        return res.status(200).json(orders);
    }
    orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    return res.status(200).json(orders);
})

//Get a sinle order
const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("order not found")
    };

    if (req.user.role === "admin") {
        return res.status(200).json(order)
    }

    if (order.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("you are not authorized");
    } else {
        res.status(200).json(order);
    }

});

//Delete order
const deleteOrder = asyncHandler(async (req, res) => {

});

//Update Order
const updateOrderStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { orderStatus } = req.body;
    const order = await Order.findById(id);

    //validation
    if (!order) {
        res.status(404);
        throw new Error("order not found")
    };

    await Order.findByIdAndUpdate(
        {
            _id: id
        },
        {
            orderStatus
        },
        {
            new: true,
            runValidators: true
        }
    )
    res.status(200).json({ message: "order status successfully changed" })
});

const payWithStripe = expressAsyncHandler(async (req, res) => {


    const { items, shipping, description, coupon } = req.body;

    //Checking the product on the database
    const products = await Product.find()
    let orderAmount;

    orderAmount = calculateTotalPrice(products, items)

    //Check if user inputs a coupon
    if (coupon !== null && coupon?.name !== "nil") {
        let totalAfterDiscount = orderAmount - (orderAmout * coupon.discount) / 100;
        orderAmount = totalAfterDiscount;
    }
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: orderAmount,
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
        description,
        shipping: {
            address: {
                line1: shipping.line1,
                line2: shipping.line2,
                city: shipping.city,
                country: shipping.country,
                postal_code: shipping.postal_code
            },
            name: shipping.name,
            phone: shipping.phone
        }
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

module.exports = { createOrder, getOrders, getOrder, deleteOrder, updateOrderStatus, payWithStripe };