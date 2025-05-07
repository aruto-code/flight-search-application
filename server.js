const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
// ✅ Enable CORS BEFORE routes
app.use(cors());
app.use(express.json());

// MongoDB Connection

mongoose.connect('mongodb://localhost:27017/flightDB', {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
