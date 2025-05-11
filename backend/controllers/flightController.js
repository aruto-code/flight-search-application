const Flight = require('../models/Flight');
const moment = require('moment-timezone');

// Create a new flight
exports.createFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create flight' });
  }
};

// Get all flights
exports.getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.status(200).json(flights);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
};

// Search flights by origin and destination (only if both are provided)
exports.searchFlights = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    // Return empty array if any parameter is missing
    if (!origin || !destination || !date) {
      return res.status(200).json([]);
    }

    const searchDate = new Date(date);
    const nextDate = new Date(searchDate);
    nextDate.setDate(searchDate.getDate() + 1);

    const flights = await Flight.find({
      origin: { $regex: new RegExp(origin.trim(), 'i') },
      destination: { $regex: new RegExp(destination.trim(), 'i') },
      departureTime: {
        $gte: searchDate,
        $lt: nextDate
      }
    });

    const formattedFlights = flights.map(flight => ({
      ...flight.toObject(),
      departureTimeIST: moment(flight.departureTime).tz('Asia/Kolkata').format('DD MMM YYYY, hh:mm A'),
      arrivalTimeIST: moment(flight.arrivalTime).tz('Asia/Kolkata').format('DD MMM YYYY, hh:mm A')
    }));

    res.status(200).json(formattedFlights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a flight by flightId
exports.updateFlight = async (req, res) => {
  try {
    const updatedFlight = await Flight.findOneAndUpdate(
      { flightId: req.params.flightId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFlight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.json(updatedFlight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a flight by flightId
exports.deleteFlight = async (req, res) => {
  try {
    const deletedFlight = await Flight.findOneAndDelete({ flightId: req.params.flightId });

    if (!deletedFlight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.json({ message: 'Flight deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};