const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    createOrder,
    getOrders,
    getOrder,
    deleteOrder,
    updateOrderStatus,
    payWithStripe
} = require("../controllers/orderController");


//API endpoints - route
router.post("/createOrder", protect, createOrder);
router.get("/getOrders", protect, getOrders);
router.get("/getOrder/:id", protect, getOrder);
router.delete('/deleteOrder/:id', protect, deleteOrder);
router.patch("/updateOrder/:id", protect, adminOnly, updateOrderStatus)

router.post("/create-payment-intent", protect, payWithStripe);





module.exports = router;