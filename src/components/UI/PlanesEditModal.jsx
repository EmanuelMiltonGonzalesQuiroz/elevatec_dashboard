import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../connection/firebase';

const PlanesEditModal = ({ docId, plan, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: plan.name,
    note: plan.note,
    value: plan.value,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación: asegúrate de que los campos no estén vacíos
    for (let key in formData) {
      if (!formData[key]) {
        setError(`El campo ${key} es obligatorio y no puede estar vacío.`);
        return;
      }
    }

    try {
      // Obtener el documento de Firestore
      const docRef = doc(db, 'planes', docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();

        // Actualizar el array 'data' con el plan editado
        const updatedData = currentData.data.map(item => {
          if (item.name === plan.name) {
            return { ...formData }; // Reemplazar el plan con los nuevos datos
          }
          return item; // Mantener los planes que no se están editando
        });

        // Actualizar el documento en Firestore
        await updateDoc(docRef, { data: updatedData });
        onSuccess(); // Ejecutar callback de éxito después de guardar
      }
    } catch (error) {
      console.error('Error al guardar el elemento: ', error);
      setError('Hubo un problema al guardar los cambios.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar Plan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre del Plan</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descripción</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Valor</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
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
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanesEditModal;
