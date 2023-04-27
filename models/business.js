var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * business card Schema
 */
var businessSchema = new Schema({
  ownerID: {
    type: Number,
    required: [true, "owner id not provided "],
  },
  businessName: {
    type: String,
    required: [true, "business name not provided "],
  },
  description: {
    type: String,
    required: [true, "description not provided"],
  },
  address: {
    type: String,
    required: [true, "address not provided"],
  },
  phone: {
    type: Number,
    required: [true, "phone number not provided"],
  },
  photo: {
    type: String,
    required: [true, "photo url not provided"]
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('business', businessSchema);