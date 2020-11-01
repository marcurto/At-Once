const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  table: Number,
  dishes: [{type: Schema.Types.ObjectId, ref: 'Dish'}],
  user: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', unique: true}
});

orderSchema.set('timestamps', true);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;