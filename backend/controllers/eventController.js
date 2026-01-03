const db = require('../config/db');
const admin = require('firebase-admin');

// Admin creates a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, registration_link } = req.body;

    if (!title || !description || !date || !time || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const eventsRef = db.collection('events');
    await eventsRef.add({
      title,
      description,
      date,
      time,
      location,
      registration_link: registration_link || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// Student views all events
exports.getAllEvents = async (req, res) => {
  try {
    const eventsRef = db.collection('events');
    const snapshot = await eventsRef.orderBy('date', 'asc').get();

    const events = [];
    snapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

// Admin deletes an event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const eventRef = db.collection('events').doc(eventId);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await eventRef.delete();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Event deletion error:', error);
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

// Admin updates an existing event by ID
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, date, time, location, registration_link } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const eventRef = db.collection('events').doc(eventId);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = date;
    if (time !== undefined) updateData.time = time;
    if (location !== undefined) updateData.location = location;
    if (registration_link !== undefined) updateData.registration_link = registration_link;
    
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await eventRef.update(updateData);
    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};
