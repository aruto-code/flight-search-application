const Flight = require('../models/Flight');
const client = require('../redis/redisClient');
const moment = require('moment-timezone');

// Create a new flight
exports.createFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(200).json(flight);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create flight' });
  }
};

// Get all flights
exports.getFlights = async (req, res) => {
  try {
    const cacheKey = 'all_flights';

    const cached = await client.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const flights = await Flight.find();

    // Cache result for 5 minutes
    await client.set(cacheKey, JSON.stringify(flights), { EX: 300 });

    res.status(200).json(flights);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
};

// Search flights by origin and destination (only if both are provided)
exports.searchFlights = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
      console.log('Invalid request: missing origin, destination, or date');
      return res.status(200).json([]);
    }

    const cacheKey = `search:${origin}:${destination}:${date}`;
    console.log(`Checking cache for key: ${cacheKey}`);

    // Check Redis cache
    const cached = await client.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for ${cacheKey}`);
      return res.status(200).json(JSON.parse(cached)); // Return cached result
    }

    console.log(`Cache miss for ${cacheKey}. Fetching from database...`);

    const searchDate = new Date(date);
    const nextDate = new Date(searchDate);
    nextDate.setDate(searchDate.getDate() + 1);

    // Query the database for flights
    const flights = await Flight.find({
      origin: { $regex: new RegExp(origin.trim(), 'i') },
      destination: { $regex: new RegExp(destination.trim(), 'i') },
      departureTime: { $gte: searchDate, $lt: nextDate }
    });

    const formattedFlights = flights.map(flight => ({
      ...flight.toObject(),
      departureTimeIST: moment(flight.departureTime).tz('Asia/Kolkata').format('DD MMM YYYY, hh:mm A'),
      arrivalTimeIST: moment(flight.arrivalTime).tz('Asia/Kolkata').format('DD MMM YYYY, hh:mm A')
    }));

    console.log(`Caching result for ${cacheKey} for 5 minutes`);
    // Cache the result for 5 minutes (300 seconds)
    await client.set(cacheKey, JSON.stringify(formattedFlights), { EX: 300 }, (err, reply) => {
      if (err) {
        console.error(`Error setting cache for ${cacheKey}:`, err);
      } else {
        console.log(`Cache set for ${cacheKey}: ${reply}`);
      }
    });

    res.status(200).json(formattedFlights);
  } catch (err) {
    console.error('Error searching flights:', err);
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