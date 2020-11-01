const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  table: Number,
  dishes: [{type: Schema.Types.ObjectId, ref: 'Dish'}],
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant'}
});

orderSchema.set('timestamps', true);

const Comanda = mongoose.model('Comanda', orderSchema);

module.exports = Comanda;