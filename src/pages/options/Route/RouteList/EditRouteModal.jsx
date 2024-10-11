import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';

const EditRouteModal = ({ isOpen, routeData, onClose, onSave }) => {
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (isOpen && routeData) {
      setEditedData(routeData); // Inicializar el estado con los datos de la ruta seleccionada
    }
  }, [isOpen, routeData]);

  const handleNestedChange = (e, parentField, index = 0) => {
    const { name, value } = e.target;
    setEditedData((prevData) => {
      const updatedNestedData = [...prevData.routeData];
      if (!updatedNestedData[index]) {
        updatedNestedData[index] = {};
      }
      updatedNestedData[index][name] = value;
      return { ...prevData, routeData: updatedNestedData };
    });
  };

  const handleSave = async () => {
    try {
      const db = getFirestore();
      const routeDocRef = doc(db, 'list_of_routes', editedData.id);

      // Actualizar el documento en Firestore con los nuevos datos
      await updateDoc(routeDocRef, editedData);

      onSave(editedData); // Actualiza el estado en el componente padre con los nuevos datos
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al actualizar la ruta:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Editar Ruta</h2>

        <label className="block mb-2 font-bold">Nombre del Cliente:</label>
        <input
          type="text"
          name="cliente"
          value={editedData.routeData?.[0]?.cliente || ''}
          onChange={(e) => handleNestedChange(e, 'routeData')}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-bold">Número de Teléfono:</label>
        <input
          type="text"
          name="clientPhone"
          value={editedData.routeData?.[0]?.clientPhone || ''}
          onChange={(e) => handleNestedChange(e, 'routeData')}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-bold">Ancho de puertas:</label>
        <input
          type="text"
          name="Ancho de puertas"
          value={editedData.routeData?.[0]?.['Ancho de puertas'] || ''}
          onChange={(e) => handleNestedChange(e, 'routeData')}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-bold">Pasajeros:</label>
        <input
          type="text"
          name="Pasajeros"
          value={editedData.routeData?.[0]?.Pasajeros || ''}
          onChange={(e) => handleNestedChange(e, 'routeData')}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-bold">Tipo de Edificio:</label>
        <input
          type="text"
          name="Nombre"
          value={editedData.routeData?.[0]?.TipoDeEdificio?.Nombre || ''}
          onChange={(e) => handleNestedChange(e, 'routeData', 0)}
          className="w-full p-2 border rounded mb-4"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRouteModal;
