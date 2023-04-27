var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * client Schema
 */
var clientSchema = new Schema({
  id2: {
    type: Number,
    required: [true, "id not provided "],
    unique: [true, "id already exists in database!"]
  },
  fullName: {
    type: String,
    required: [true, "fullname not provided "],
  },
  email: {
    type: String,
    unique: [true, "email already exists in database!"],
    lowercase: true,
    trim: true,
    required: [true, "email not provided"],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '{VALUE} is not a valid email!'
    }

  },
  role: {
    type: String,
    enum: ["normal", "business"],
    required: [true, "Please specify user role"]
  },
  password: {
    type: String,
    required: true,
  },
  businesses: {
    type: Array,
    default: []
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('client', clientSchema);