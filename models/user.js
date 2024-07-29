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
      },
      email:{type:String},
      bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
  });

  
  

  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;