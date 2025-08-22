const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Pending Confirmation', 'Confirmed', 'Shipped', 'Delivered'],
      default: 'Pending Confirmation',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Order must contain at least one product'],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email',
  }).populate({ path: 'products', select: 'name -_id' });

  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
