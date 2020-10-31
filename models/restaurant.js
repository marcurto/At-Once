const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  name: String,
  description: String,
  contactInfo: {
      address: String,
      phone: Number,
      email: String,
      website: String
  },
  imgPath: String,
  //imgName: String alt descripció
  user: { type: Schema.Types.ObjectId, ref: 'User', unique: true }
});

restaurantSchema.set('timestamps', true);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
