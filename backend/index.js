// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');       // Login/Register routes
const eventRoutes = require('./routes/events');    // Event create/fetch routes

const app = express();

// Configure CORS to allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://event-management-system-nine-ebon.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
  credentials: true,
  origin: "https://event-management-system-kv66vuzs-katta-aakash-projects.vercel.app",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
