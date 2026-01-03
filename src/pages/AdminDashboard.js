import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserTie, FaUsers } from 'react-icons/fa';
import { MdEventAvailable } from 'react-icons/md';
import CreateEventForm from './CreateEventForm';
import axios from 'axios';
import API_URL from '../config/api';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    registration_link: ''
  });

  const fetchEvents = () => {
    axios.get(`${API_URL}/api/events/all`)
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to fetch events", err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateClick = () => setShowCreateForm(true);
  const handleFormClose = () => {
    setShowCreateForm(false);
    setShowEditModal(false);
    fetchEvents();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`${API_URL}/api/events/delete/${id}`);
        setEvents(events.filter(e => e.id !== id));
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event); // Pre-fill form
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/events/update/${editingEvent.id}`, formData);
      setShowEditModal(false);
      fetchEvents();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const students = [
    { id: 1, name: 'Satish Veeravalli', department: 'CSE', email: 'satish@univ.edu', status: 'active' },
    { id: 2, name: 'Meena Reddy', department: 'ECE', email: 'meena@univ.edu', status: 'active' },
    { id: 3, name: 'Ravi Kumar', department: 'MECH', email: 'ravi@univ.edu', status: 'inactive' },
    { id: 4, name: 'Priya Sharma', department: 'CSE', email: 'priya@univ.edu', status: 'active' },
    { id: 5, name: 'Amit Patel', department: 'EEE', email: 'amit@univ.edu', status: 'active' }
  ];

  const stats = [
    { title: 'Total Students', value: '1,245', change: '+5.2%', trend: 'up' },
    { title: 'Active Events', value: '7', change: '+2', trend: 'up' },
    { title: 'Pending Requests', value: '23', change: '-8', trend: 'down' },
    { title: 'New Registrations', value: '48', change: '+12.5%', trend: 'up' }
  ];

  return (
    <div className="dashboard-container admin-dashboard">
      <header className="dashboard-header">
        <div className="welcome-message">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, <span>Administrator</span></p>
        </div>
        <div className="header-actions">
          <button className="notification-btn">🔔 <span className="badge">3</span></button>
          <div className="user-avatar"><FaUserTie /></div>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.title}</h3>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.trend}`}>
              {stat.change} {stat.trend === 'up' ? '↑' : '↓'}
            </div>
          </div>
        ))}
      </section>

      <div className="admin-content">
        <section className="events-section">
          <div className="section-header">
            <h2><FaCalendarAlt /> Upcoming Events</h2>
            <button className="create-btn" onClick={handleCreateClick}>+ Create Event</button>
          </div>

          <div className="admin-events-grid">
            {events.map(event => (
              <div key={event.id} className="admin-event-card">
                <div className="event-icon"><MdEventAvailable /></div>
                <div className="event-content">
                  <h3>{event.title}</h3>
                  <div className="event-details">
                    <p><FaCalendarAlt /> {event.date}</p>
                    <p><FaMapMarkerAlt /> {event.location}</p>
                    <p><FaUsers /> Link: <a href={event.registration_link} target="_blank" rel="noopener noreferrer">Register</a></p>
                  </div>
                  <div className="event-buttons">
                    <button onClick={() => handleEdit(event)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(event.id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="students-section">
          <div className="section-header">
            <h2><FaUsers /> Student Management</h2>
            <div className="search-bar">
              <input type="text" placeholder="Search students..." />
              <button className="search-btn">🔍</button>
            </div>
          </div>

          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(std => (
                  <tr key={std.id}>
                    <td>{std.id}</td>
                    <td>{std.name}</td>
                    <td>{std.department}</td>
                    <td>{std.email}</td>
                    <td>
                      <span className={`status-badge ${std.status}`}>
                        {std.status.charAt(0).toUpperCase() + std.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="table-action edit">✏️</button>
                      <button className="table-action delete">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-footer">
              <div className="pagination">
                <button>Previous</button>
                <span>Page 1 of 5</span>
                <button>Next</button>
              </div>
              <div className="records-count">Showing 1-5 of 1,245 records</div>
            </div>
          </div>
        </section>
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={handleFormClose}>
          <div onClick={(e) => e.stopPropagation()}>
            <CreateEventForm onClose={handleFormClose} onEventCreated={handleFormClose} />
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleFormClose}>
          <div className="createEventFormContainer" onClick={e => e.stopPropagation()}>
            <button onClick={handleFormClose} style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>&times;</button>
            <h2>Edit Event</h2>
            <form onSubmit={handleEditSubmit}>
              <input type="text" name="title" value={formData.title} onChange={handleEditChange} placeholder="Title" required />
              <textarea name="description" value={formData.description} onChange={handleEditChange} placeholder="Description" required />
              <input type="date" name="date" value={formData.date} onChange={handleEditChange} required />
              <input type="time" name="time" value={formData.time} onChange={handleEditChange} required />
              <input type="text" name="location" value={formData.location} onChange={handleEditChange} placeholder="Location" required />
              <input type="text" name="registration_link" value={formData.registration_link} onChange={handleEditChange} placeholder="Registration Link" required />
              <button type="submit" className="createEventFormSubmitBtn">Update Event</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
