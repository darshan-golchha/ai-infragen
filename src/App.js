import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/home';
import InfrastructureForm from './components/form';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/form" element={<InfrastructureForm />} />
      </Routes>
    </Router>
  );
}

export default App;
