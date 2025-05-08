const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const flightSchema = require('../validators/flightValidator');
const flightController = require('../controllers/flightController');

// GET all flights
router.get('/', flightController.getFlights);

// GET search flights
router.get('/search', flightController.searchFlights);

// POST create flight
router.post('/', validate(flightSchema), flightController.createFlight);

// PUT update flight
router.put('/:flightId', flightController.updateFlight);

// DELETE flight
router.delete('/:flightId', flightController.deleteFlight);

module.exports = router;