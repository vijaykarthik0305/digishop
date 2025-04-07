import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc  Create New order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Check for order items
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No Order Items');
  }

  // Create a new order
  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Save the order and return the created order
  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc  Get order by id
// @route GET  /api/order/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  // Check if the order exists and populate the user information
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order Not Found');
  }
});

// @desc  Update order to paid (Handles COD)
// @route PUT  /api/order/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check if payment method is Cash on Delivery (COD)
    if (order.paymentMethod === 'Cash on Delivery') {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: 'COD', // No need for a payment gateway ID
        status: 'paid',
        update_time: Date.now(),
        email_address: 'N/A', // No payment email needed for COD
      };
    } else {
      // Process for other payment methods (e.g., online payments)
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
    }

    // Save the updated order
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order Not Found');
  }
});

// @desc  Update order to Delivered
// @route PUT  /api/order/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order Not Found');
  }
});

// @desc  Get logged in user orders
// @route GET  /api/order/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc  Get all orders
// @route GET  /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc Cancel an order
// @route PUT /api/orders/:id/cancel
// @access Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isCancelled = true;
    order.cancelledAt = Date.now();

    const cancelledOrder = await order.save();
    res.json(cancelledOrder);
  } else {
    res.status(404);
    throw new Error('Order Not Found');
  }
});

export { cancelOrder };

// Export controller functions
export {
  getOrderById,
  addOrderItems,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
