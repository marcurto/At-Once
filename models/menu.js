const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  name: String,
  dishes: [{type: Schema.Types.ObjectId, ref: 'Dish'}],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  user: { type: Schema.Types.ObjectId, ref: 'Restaurant' }
});

menuSchema.set('timestamps', true);

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;