import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Login from './Login';
import UserDashboard from './UserDashboard';
import './App.css'; // Import the CSS for the animations

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle login action
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <TransitionGroup>
        <CSSTransition
          timeout={500} // Duration of the animation
          classNames="page" // Add class for transitions
          unmountOnExit // Unmount when leaving
        >
          <Routes>
            {/* Route for login page */}
            <Route 
              path="/" 
              element={isLoggedIn ? <Navigate to="/user" /> : <Login onLogin={handleLogin} />} 
            />

            {/* Route for user dashboard page */}
            <Route 
              path="/user" 
              element={isLoggedIn ? <UserDashboard /> : <Navigate to="/" />} 
            />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </Router>
  );
};

export default App;
