import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    // Apply Authorization Token to every Private Route Request
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    // Delete the auth header from the route
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;
