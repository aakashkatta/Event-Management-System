// backend/routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Create new event
router.post('/create', createEvent);

// Get all events
router.get('/all', getAllEvents);

// Update event by ID
router.put('/update/:id', updateEvent);

// Delete event by ID
router.delete('/delete/:id', deleteEvent);

module.exports = router;
