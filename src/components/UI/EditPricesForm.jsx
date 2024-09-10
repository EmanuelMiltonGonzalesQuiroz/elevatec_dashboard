// src/components/UI/EditPricesForm.jsx
import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../connection/firebase';

const EditPricesForm = ({ docId, collectionName, pisos, initialPrice, onClose, onSuccess }) => {
  const [precios, setPrecios] = useState(initialPrice);
  const [error, setError] = useState('');

  const handlePriceChange = (e) => {
    setPrecios(e.target.value);
  };

  const handleSave = async () => {
    if (precios === '') {
      setError('El campo de precios no puede estar vacío.');
      return;
    }

    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();

        if (Array.isArray(currentData.items)) {
          // Actualizar el precio dentro de los 'items'
          const updatedItems = currentData.items.map(item =>
            item.pisos === pisos ? { ...item, precios } : item
          );

          await updateDoc(docRef, { items: updatedItems });
        } else {
          // Actualizar directamente si no hay 'items'
          await updateDoc(docRef, { precios });
        }

        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al actualizar el documento: ', error);
      setError('Hubo un error al actualizar los precios.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar Precios</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Pisos: {pisos}</label>
          <input
            type="text"
            name="precios"
            value={precios}
            onChange={handlePriceChange}
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPricesForm;
