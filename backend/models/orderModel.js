import mongoose from 'mongoose';

// Define the order schema
const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    orderItems: [
      {
        name: { type: String, required: true }, // Name of the product
        quantity: { type: Number, required: true }, // Quantity ordered
        image: { type: String, required: true }, // Image URL of the product
        price: { type: Number, required: true }, // Price of the product
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product', // Reference to the Product model
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true }, // Shipping address
      city: { type: String, required: true }, // City of shipping address
      PostalCode: { type: String, required: true }, // Postal code
      country: { type: String, required: true }, // Country of shipping address
    },
    paymentMethod: {
      type: String,
      required: true, // Payment method used
    },
    paymentResult: {
      id: { type: String }, // Payment ID from the payment provider
      status: { type: String }, // Payment status
      update_time: { type: String }, // Update time of the payment
      email_address: { type: String }, // Email address associated with the payment
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0, // Default tax price
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0, // Default shipping price
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0, // Default total price
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false, // Default payment status
    },
    paidAt: {
      type: Date, // Date when the payment was made
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false, // Default delivery status
    },
    deliveredAt: {
      type: Date, // Date when the order was delivered
    },
  },
  {
    timestamps: true, // Automatically create 'createdAt' and 'updatedAt' fields
  }
);

// Create the Order model based on the order schema
const Order = mongoose.model('Order', orderSchema);

export default Order;
