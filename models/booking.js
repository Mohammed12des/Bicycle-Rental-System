const mongoose = require('mongoose');
const bikeSchema = new mongoose.Schema({
    company: {
        type: String,
        enum: ['Track', 'Trinx', 'Klyes']
    },
    type: {
        type: String,
        enum: ['Road', 'Mountain', 'Hybrid', 'Touring', 'Gravel', 'Cruiser']
    },
    color: String,
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
    adders: String,
    firstdate: Date,
    lastdate: Date,
    bikes: [bikeSchema]
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);