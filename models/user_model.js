const mongoose = require('mongoose');

const { Schema } = mongoose;

const users = new Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  isCertified: Boolean,
  wishlist: Array,
  profileImage: String
});

const User = mongoose.model('User', users);

module.exports = {
  User,
};
