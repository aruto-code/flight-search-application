const Flight = require('../models/Flight');

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

// Search flights by origin and/or destination
exports.searchFlights = async (req, res) => {
  try {
    const query = {};

    if (req.query.origin) {
      const origin = req.query.origin.trim();
      query.origin = { $regex: new RegExp(origin, 'i') };
    }

    if (req.query.destination) {
      const destination = req.query.destination.trim();
      query.destination = { $regex: new RegExp(destination, 'i') };
    }

    const flights = await Flight.find(query);
    res.json(flights);
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