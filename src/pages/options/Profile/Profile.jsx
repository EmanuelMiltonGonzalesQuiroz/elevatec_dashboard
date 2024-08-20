// src/pages/Profile/Profile.jsx

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-gray-100 text-black">
      <h2 className="text-2xl font-bold mb-6">Perfil de usuario</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Mi Información</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Actualizar mis datos
            </button>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Nombre:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              />
            ) : (
              <p>{currentUser.username}</p>
            )}
          </div>
          <div>
            <label className="font-semibold">Rol de Usuario:</label>
            <p>{currentUser.role}</p>
          </div>
          <div>
            <label className="font-semibold">Correo electrónico:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              />
            ) : (
              <p>{currentUser.email}</p>
            )}
          </div>
          <div>
            <label className="font-semibold">Teléfono:</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              />
            ) : (
              <p>{currentUser.phone}</p>
            )}
          </div>
          {isEditing && (
            <button
              onClick={handleUpdate}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Guardar cambios
            </button>
          )}
        </div>
        {!isEditing && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Administrar mi contraseña</h3>
            <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-700 transition">
              Cambiar Contraseña
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
