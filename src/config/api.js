// API Configuration
// Remove trailing slash to avoid double slashes in API calls
const getApiUrl = () => {
  const url = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return url.replace(/\/+$/, ''); // Remove trailing slashes
};

const API_URL = getApiUrl();

export default API_URL;

