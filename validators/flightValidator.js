const Joi = require('joi');

const flightSchema = Joi.object({
  flightId: Joi.string().required(),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  departureTime: Joi.date().iso().required(),
  arrivalTime: Joi.date().iso().required(),
  price: Joi.number().positive().required(),
  airline: Joi.string().required()
});

module.exports = flightSchema;
