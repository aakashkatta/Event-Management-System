import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserGraduate, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { MdComputer } from 'react-icons/md';
import './Dashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/events/all`)
      .then(res => setEvents(res.data))
      .catch(() => alert('Failed to load events'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-container student-dashboard">
      <header className="dashboard-header">
        <div className="welcome-message">
          <h1>Welcome back, <span>Student!</span></h1>
          <p>Here's what's happening at your campus</p>
        </div>
        <div className="header-actions">
          <button className="header-btn" onClick={goHome} title="Home">
            <FaHome />
          </button>
          <button className="header-btn" onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </button>
          <div className="user-avatar">
            <FaUserGraduate />
          </div>
        </div>
      </header>

      <section className="dashboard-section">
        <div className="section-header">
          <h2><FaCalendarAlt /> Upcoming Events</h2>
          <button className="view-all">View All</button>
        </div>

        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-icon"><MdComputer /></div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <div className="event-details">
                  <p><FaCalendarAlt /> {event.date}</p>
                  <p><FaMapMarkerAlt /> {event.location}</p>
                </div>
                <a
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="register-btn">Register Now</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="quick-links">
        <h2>Quick Access</h2>
        <div className="links-grid">
          <div className="link-card">
            <div className="link-icon" style={{ backgroundColor: '#4e79a7' }}>📚</div>
            <span>Course Materials</span>
          </div>
          <div className="link-card">
            <div className="link-icon" style={{ backgroundColor: '#f28e2b' }}>📝</div>
            <span>Assignments</span>
          </div>
          <div className="link-card">
            <div className="link-icon" style={{ backgroundColor: '#e15759' }}>💯</div>
            <span>Grades</span>
          </div>
          <div className="link-card">
            <div className="link-icon" style={{ backgroundColor: '#76b7b2' }}>👥</div>
            <span>Clubs</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentDashboard;
