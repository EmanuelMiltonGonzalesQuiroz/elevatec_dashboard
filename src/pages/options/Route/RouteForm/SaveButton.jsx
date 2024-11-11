import React from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../connection/firebase';
import { useAuth } from '../../../../context/AuthContext';

const SaveButton = ({ routeData, resetFields }) => {
  const { currentUser } = useAuth();

  const handleSave = async () => {
    try {
      const dataToSave = {
        routeData: routeData,
        user: currentUser,
        fecha: new Date().toISOString(),
      };

      await addDoc(collection(db, 'list_of_routes'), dataToSave);
      console.log('Datos guardados correctamente en la colección list_of_routes.');

      // Llamamos a resetFields para reiniciar el formulario
      if (typeof resetFields === 'function') {
        resetFields();
      } else {
        console.error('resetFields no es una función:', resetFields);
      }
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
