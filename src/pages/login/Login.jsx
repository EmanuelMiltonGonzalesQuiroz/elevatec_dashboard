import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateUserCredentials } from '../../services/auth'; // Asegúrate de que la ruta sea correcta

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    if (username === '' || password === '') {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const { success, userData } = await validateUserCredentials(username, password);
      if (success && userData) {
        login(userData.username);
        window.location.href = '/dashboard';
      } else {
        setError('Nombre de usuario o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Hubo un error al intentar iniciar sesión.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            className="w-full p-3 border rounded bg-gray-100 text-black focus:outline-none"
          />
        </div>
        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-3 border rounded bg-gray-100 text-black focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
          >
            {showPassword ? '🙈' : '👁️'} {/* Puedes usar un ícono adecuado aquí */}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default Login;
