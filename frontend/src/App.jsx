import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* URL หลัก (/) ให้แสดงหน้า Home */}
        <Route path="/" element={<Home />} />
        
        {/* URL (/dashboard) ให้แสดงหน้า Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project" element={<ProjectDetail />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;