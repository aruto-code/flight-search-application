const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const app = express();
// ✅ Enable CORS BEFORE routes
app.use(cors());
app.use(express.json());

// Log the database URI being used
console.log('Using DB URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ DB Connection Error:', err));

// Routes
const flightRoutes = require('./routes/flightRoutes');
app.use('/api/flights', flightRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong' });
});

// Export app for testing
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;