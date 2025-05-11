const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Flight = require('../../models/Flight');

describe('Flight Controller (Integration with real DB)', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterEach(async () => {
    await Flight.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return empty array if no flights', async () => {
    const res = await request(app).get('/api/flights');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new flight and return it', async () => {
    const flightData = {
      flightId: '6E123',
      origin: 'delhi',
      destination: 'chennai',
      airline: 'IndiGo',
      price: 3200,
      departureTime: new Date('2025-05-10T06:00:00.000Z'),
      arrivalTime: new Date('2025-05-10T07:30:00.000Z')
    };

    // Create a flight
    const postRes = await request(app)
      .post('/api/flights')
      .send(flightData);

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.flightId).toBe('6E123');  // Change here from flightNumber to flightId

    // Get the list of flights
    const getRes = await request(app).get('/api/flights');
    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0].flightId).toBe('6E123');  // Change here from flightNumber to flightId
  });

  it('should update an existing flight by flightId', async () => {
    // Insert a flight to update
    const flight = await Flight.create({
      flightId: 'AI999',
      origin: 'kolkata',
      destination: 'delhi',
      airline: 'Air India',
      price: 4500,
      departureTime: new Date('2025-05-11T10:00:00.000Z'),
      arrivalTime: new Date('2025-05-11T12:30:00.000Z')
    });

    const updatedData = {
      price: 4800,
      destination: 'mumbai'
    };

    const res = await request(app)
      .put(`/api/flights/${flight.flightId}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(4800);
    expect(res.body.destination.toLowerCase()).toBe('mumbai');
  });

  it('should delete an existing flight by flightId', async () => {
    // Create a flight using the API to ensure it's in the DB
    const flightData = {
      flightId: '6E321',
      origin: 'jaipur',
      destination: 'goa',
      airline: 'IndiGo',
      price: 3700,
      departureTime: new Date('2025-06-01T08:00:00.000Z'),
      arrivalTime: new Date('2025-06-01T10:30:00.000Z')
    };

    // Insert the flight into the database
    await Flight.create(flightData);

    // Now delete the flight
    const res = await request(app).delete(`/api/flights/${flightData.flightId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Flight deleted successfully');

    // Confirm flight is deleted
    const deleted = await Flight.findOne({ flightId: flightData.flightId });
    expect(deleted).toBeNull();
  });

  it('should return flights matching both origin and destination', async () => {
    // Create multiple flights
    const flights = [
      {
        flightId: '6E456',
        origin: 'delhi',
        destination: 'bangalore',
        airline: 'IndiGo',
        price: 4200,
        departureTime: new Date('2025-05-11T06:00:00.000Z'),
        arrivalTime: new Date('2025-05-11T08:30:00.000Z')
      },
      {
        flightId: 'AI789',
        origin: 'delhi',
        destination: 'mumbai',
        airline: 'Air India',
        price: 5000,
        departureTime: new Date('2025-05-11T09:00:00.000Z'),
        arrivalTime: new Date('2025-05-11T11:00:00.000Z')
      }
    ];

    await Flight.insertMany(flights);

    const res = await request(app).get('/api/flights/search?origin=del&destination=mum');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].origin.toLowerCase()).toBe('delhi');
    expect(res.body[0].destination.toLowerCase()).toBe('mumbai');
  });

  it('should not return flights when no query params are given', async () => {
    const flightData = {
      flightId: '6E123',
      origin: 'delhi',
      destination: 'chennai',
      airline: 'IndiGo',
      price: 3200,
      departureTime: new Date('2025-05-10T06:00:00.000Z'),
      arrivalTime: new Date('2025-05-10T07:30:00.000Z')
    };

    await Flight.insertMany(flightData);

    const res = await request(app).get('/api/flights/search');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it('should not return flights matching source only', async () => {

    const flightData = {
      flightId: '6E123',
      origin: 'delhi',
      destination: 'chennai',
      airline: 'IndiGo',
      price: 3200,
      departureTime: new Date('2025-05-10T06:00:00.000Z'),
      arrivalTime: new Date('2025-05-10T07:30:00.000Z')
    };

    await Flight.insertMany(flightData);

    const resDest = await request(app).get('/api/flights/search?destination=delhi');
    expect(resDest.statusCode).toBe(200);
    expect(resDest.body.length).toBe(0);
  });


  it('should not return flights matching destination only', async () => {

    const flightData = {
      flightId: '6E123',
      origin: 'delhi',
      destination: 'chennai',
      airline: 'IndiGo',
      price: 3200,
      departureTime: new Date('2025-05-10T06:00:00.000Z'),
      arrivalTime: new Date('2025-05-10T07:30:00.000Z')
    };

    await Flight.insertMany(flightData);

    const resDest = await request(app).get('/api/flights/search?destination=chennai');
    expect(resDest.statusCode).toBe(200);
    expect(resDest.body.length).toBe(0);
  });
});