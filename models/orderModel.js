const mongoose = require('mongoose');
const OrderStatus = require('./orderStatusModel');

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: mongoose.Schema.ObjectId,
      ref: 'OrderStatus',
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Keep in mind populate takes resources
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email',
  })
    .populate({ path: 'products', select: 'name -_id' })
    .populate('status');

  next();
});

orderSchema.pre('save', async function () {
  if (this.isNew) {
    this.status = await OrderStatus.create({});
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
