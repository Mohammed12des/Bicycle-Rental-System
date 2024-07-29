const mongoose = require('mongoose');
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
  },{ timestamps: true });



  const bookingSchema = mongoose.Schema({
    adders: String,
    fristdate: Date,
    lastdate:Date,
    bike:[bikeSchema],
  },{ timestamps: true });
  
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
      },
      email:{type:String},
      booking:[bookingSchema],
  });

  
  

  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;