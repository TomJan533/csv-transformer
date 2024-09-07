import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home.js';
import HealthCheck from './pages/HealthCheck/HealthCheck.js';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/health-check" element={<HealthCheck />} />
      </Routes>
    </Router>
  );
};

export default App;
