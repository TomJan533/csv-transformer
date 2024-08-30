import './App.css';
import React from 'react';
import HealthCheck from './HealthCheck.js';
import CSVUpload from './CSVUpload.js';
import CSVList from './CSVList.js';

function App() {
  return (
    <div className="App">
      <div>
        <HealthCheck />
      </div>
      <div>
        <CSVUpload />
      </div>
      <div>
        <CSVList />
      </div>
    </div>
  );
}

export default App;
