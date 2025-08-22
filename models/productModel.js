const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product must have a name'],
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
