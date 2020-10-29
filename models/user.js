const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  isRestaurant: { type: Boolean, default: true }
});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;