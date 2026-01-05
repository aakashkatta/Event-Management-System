// API Configuration
// Remove trailing slash to avoid double slashes in API calls
const getApiUrl = () => {
  const url = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return url.replace(/\/+$/, ''); // Remove trailing slashes
};

const API_URL = getApiUrl();

// Helper function to construct API endpoints safely
export const getApiEndpoint = (endpoint) => {
  // Remove leading slash from endpoint if present, then add it back
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${cleanEndpoint}`;
};

export default API_URL;

