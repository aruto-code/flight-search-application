const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightId: {
        type: String,
        required: true,
        unique: true
        
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    airline: {
        type: String,
        required: true
    }
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
