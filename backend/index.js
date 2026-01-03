// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');       // Login/Register routes
const eventRoutes = require('./routes/events');    // Event create/fetch routes

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Register routes
app.use('/api', authRoutes);           // /api/login, /api/register
app.use('/api/events', eventRoutes);   // /api/events/create, /api/events/all

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
