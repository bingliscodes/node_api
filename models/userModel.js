const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name for the this user'],
  },
  email: {
    type: String,
    required: [true, 'Please enter a valid email for this user'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
