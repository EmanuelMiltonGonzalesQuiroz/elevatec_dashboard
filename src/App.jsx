import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/login/Welcome';
import Login from './pages/login/Login';
import { useAuth } from './context/AuthContext';

function TestComponent() {
  const auth = useAuth();
  console.log(auth); // Debería no lanzar ningún error
  return <div>Test Component</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        {/* Agrega más rutas según sea necesario */}
        <Route path="/test" element={<TestComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
