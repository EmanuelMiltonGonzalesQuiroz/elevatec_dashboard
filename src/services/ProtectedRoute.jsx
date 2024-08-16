import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Realizar una validación adicional si es necesario.
  if (currentUser && currentUser.username) {
    // Aquí podrías agregar lógica para verificar si los datos son válidos.
    // Por ejemplo, podrías hacer otra llamada a Firestore.
    return <Component />;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
