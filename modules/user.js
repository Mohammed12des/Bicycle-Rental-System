const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
        type: Number,
        required: true,
      },
      booking:[bookingSchema],
      bike: [bikeSchema]
  });
  const bookingSchema = mongoose.Schema({
    fristdate: Date,
    lastdate:Date,
    bike:[bikeSchema],
  });
  const bikeSchema = mongoose.Schema({
    company: {
        type: String,
        enum: ['Track ', 'Trinx', 'klyes']
      },
      type: {
        type: String,
        enum: ['Road ', 'Mountain', 'Hybrid','Touring','Gravel','Cruiser']
      },
      color:String,
  });
  

  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;