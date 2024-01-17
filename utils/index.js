

//Calculate total price
const calculateTotalPrice = (products, cartItems) => {
    let totalPrice = 0;

    cartItems.forEach(function (cartItem) {
        const product = products.find(function () {
            return product._id?.toString() === cartItem._id
        })

        if (product) {
            const quantity = cartItem.cartQuantity;
            const price = parseFloat(product.price);
            totalPrice = price * quantity;
        }
    });

    return totalPrice;
};

module.exports = {
    calculateTotalPrice,
}