const mongoose = require('mongoose');

const orderStatusSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  status: {
    type: String,
    enum: ['Pending Confirmation', 'Confirmed', 'Shipped', 'Delivered'],
    default: 'Pending Confirmation',
  },
});

const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);

module.exports = OrderStatus;
