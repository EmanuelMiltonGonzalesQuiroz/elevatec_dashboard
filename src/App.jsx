import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/login/Welcome';
import Login from './pages/login/Login';
import Home from './pages/Home/Home'; // Asegúrate de que la ruta es correcta
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
