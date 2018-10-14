import React, { Component } from 'react';
import './App.css';

import setAuthToken from './utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { setCurrentUser } from './actions/authActions';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

// Check for jwtToken in the localStorage on refresh or routing to a page
if (localStorage.jwtToken) {
  // Set Auth Token to Header auth
  setAuthToken(localStorage.jwtToken);
  // Decode the token to get User data and Token expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set Current User and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
