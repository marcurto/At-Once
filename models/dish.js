const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
  name: String,
  description: String,
  characteristics: String,
  allergies: String,
  category: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  user: { type: Schema.Types.ObjectId, ref: 'Restaurant' }
});

dishSchema.set('timestamps', true);

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
