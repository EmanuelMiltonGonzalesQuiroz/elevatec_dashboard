import React from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../connection/firebase';
import { useAuth } from '../../../../context/AuthContext';

const SaveButton = ({ routeData, resetFields }) => {
  const { currentUser } = useAuth();

  const handleSave = async () => {
    try {
      const dataToSave = {
        routeData: routeData, // Datos de la ruta
        user: currentUser, // Email del usuario actual o un valor por defecto
        fecha: new Date().toISOString() // Fecha y hora actual en formato ISO
      };

      await addDoc(collection(db, 'list_of_routes'), dataToSave);
      console.log('Datos guardados correctamente en la colección list_of_routes.');

      // Resetea los campos después de guardar
      resetFields();
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  };

  return (
    <button
      onClick={handleSave}
      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
    >
      Guardar
    </button>
  );
};

export default SaveButton;
