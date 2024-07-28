const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
  name: String,
  adders: String,
  fristdate: Date,
  lastdate:Date,
  company: {
    type: String,
    enum: ['Track ', 'Trinx', 'klyes']
  },
  type: {
    type: String,
    enum: ['Road ', 'Mountain', 'Hybrid','Touring','Gravel','Cruiser']
  }
})
const userSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    Rental: [RentalSchema]
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;