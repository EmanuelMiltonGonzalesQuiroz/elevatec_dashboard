import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase'; // Asegúrate de que esta sea tu configuración de Firebase
import { useAuth } from '../../../context/AuthContext';
import { RiLockPasswordLine, RiCloseLine } from 'react-icons/ri';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Profile = () => {
  const { currentUser, login } = useAuth(); // Usar 'login' para actualizar el usuario localmente
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.username,
    email: currentUser.email,
    phone: currentUser.phone,
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes for form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update the user's data in Firebase and also locally
  const handleUpdate = async () => {
    try {
      if (!formData.name || !formData.email || !formData.phone) {
        setError('Todos los campos son obligatorios.');
        return;
      }

      if (currentUser.id) {
        const userDocRef = doc(db, 'login firebase', currentUser.id);
        await updateDoc(userDocRef, {
          username: formData.name,
          email: formData.email,
          phone: formData.phone,
        });

        // Actualizar el estado local con los nuevos datos
        login({
          ...currentUser,
          username: formData.name,
          email: formData.email,
          phone: formData.phone
        });

        setIsEditing(false);
      } else {
        setError('No se pudo encontrar el documento del usuario.');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil: ', error);
      setError('Hubo un error al actualizar los datos.');
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    try {
      if (password.length > 0) {
        if (currentUser.id) {
          const userDocRef = doc(db, 'login firebase', currentUser.id);
          await updateDoc(userDocRef, {
            password: password,
          });

          setIsPasswordModalOpen(false);
          setPassword('');
        } else {
          setError('No se pudo encontrar el documento del usuario para cambiar la contraseña.');
        }
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña: ', error);
      setError('Hubo un error al actualizar la contraseña.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 text-black">
      <h2 className="text-2xl font-bold mb-6 text-center">Perfil</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="relative flex justify-center items-center mb-6">
          <h3 className="text-xl font-semibold text-center w-full">Mi Información</h3>
          
          {!isEditing && (currentUser.role === 'Administrador' || currentUser.role === 'Gerencia') && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute right-0 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Actualizar mis datos
            </button>
          )}
        </div>

        <div className="space-y-4 flex flex-col items-center text-center">
          <div className="w-full max-w-md">
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
          <div className="space-y-4 flex flex-col items-center text-center">
          {currentUser?.role !== 'Trabajador' && (
            <div className="w-full max-w-md">
              <label className="font-semibold">Rol de Usuario:</label>
              <p>{currentUser.role}</p>
            </div>
          )}
          </div>
          <div className="w-full max-w-md">
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
          <div className="w-full max-w-md">
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
            <>
              {error && <p className="text-red-500">{error}</p>}
              <button
                onClick={handleUpdate}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Guardar cambios
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Cancelar
              </button>
            </>
          )}
        </div>

        {/* Botón para abrir el modal de cambiar contraseña */}
        {!isEditing &&  (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Administrar mi contraseña</h3>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-700 transition"
            >
              Cambiar Contraseña
            </button>
          </div>
        )}
      </div>

      {/* Modal para cambiar contraseña */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <RiCloseLine size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                Nueva contraseña
              </label>
              <div className="flex items-center border rounded bg-gray-100 overflow-hidden">
                <RiLockPasswordLine className="text-gray-500 ml-3" size={24} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="flex-1 p-3 bg-transparent text-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-3 text-gray-600 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              <button
                onClick={handlePasswordChange}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Guardar contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
