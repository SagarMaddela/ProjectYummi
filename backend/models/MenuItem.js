const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    data: { type: Buffer },
    contentType: { type: String },
  },
  foodType : {type:String, required: true},
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }, // Reference to the Restaurant model
  averageRating: { type: Number, default: 0 }, // Calculated average rating
  totalRatings: { type: Number, default: 0 }, // Number of ratings received
});

// Create the model
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem; // Export the model
