const mongoose = require('mongoose');
const OrderStatus = require('./orderStatusModel');
const Product = require('./productModel');

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
    productsDetails: [],
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
  }).populate('status');

  next();
});

orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.status = await OrderStatus.create({});

    this.products.forEach(async (id) => {
      const product = await Product.findById(id);
      this.productsDetails.push(product);
    });
    next();
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

//TODO: copy product details to the order when created rather than populating from a reference.
