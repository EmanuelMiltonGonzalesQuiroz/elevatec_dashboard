// src/pages/options/RouteSettings/AddDataForm.jsx

import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const collectionFieldMapping = {
  configuraciones_de_edificios: {
    'Nombre': 'text',
    'Descripcion': 'text',
    'Demora recomendable': 'text',
    'Persona': 'number',
    'intervalo de espera seg.': 'array',
    'm^2': 'number',
  },
  configuraciones_de_ascensor: {
    'Ancho': 'number',
    'Pasajeros': 'number',
  },
  puertas_info: {
    'Ancho': 'number',
    'Pasajeros': 'number',
  },
  puertas_tiempo_total: {
    'ANCHO DE PUERTA (m)': 'text',
    'TIEMPO TOTAL (seg.)': 'number',
  },
  velocidades_tiempos: {
    'VELOCIDADES (m/s)': 'number',
    'TIEMPOS SUMADOS DE ACELERACIÓN Y DESACELERACIÓN (m/s)': 'number',
  },
  valores_de_salto: {
    'VALORES DE SALTO (m)': 'number',
    'VELOCIDAD DESARROLLADA (m/s)': 'number',
  },
  configuraciones_de_pisos: {
    'pisos': 'number',
    '4': 'number',
    '5': 'number',
    '6': 'number',
    '7': 'number',
    '8': 'number',
    '9': 'number',
    '10': 'number',
    '11': 'number',
    '12': 'number',
    '13': 'number',
    '14': 'number',
    '15': 'number',
    '16': 'number',
    '17': 'number',
    '18': 'number',
    '19': 'number',
    '20': 'number',
    '21': 'number',
    '50': 'number',
  },
};

const AddDataForm = ({ collectionName, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});

  // Inicializar campos en blanco para cada colección
  const initializeFormData = () => {
    const fields = collectionFieldMapping[collectionName] || {};
    const initialData = Object.keys(fields).reduce((acc, key) => {
      acc[key] = fields[key] === 'array' ? [] : '';
      return acc;
    }, {});
    setFormData(initialData);
  };

  // Se ejecuta solo cuando cambia la colección
  useState(() => {
    initializeFormData();
  }, [collectionName]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleArrayChange = (index, value) => {
    setFormData((prevData) => {
      const updatedArray = [...prevData['intervalo de espera seg.']];
      updatedArray[index] = parseInt(value, 10);
      return { ...prevData, 'intervalo de espera seg.': updatedArray };
    });
  };

  const addArrayElement = () => {
    setFormData((prevData) => ({
      ...prevData,
      'intervalo de espera seg.': [...(prevData['intervalo de espera seg.'] || []), ''],
    }));
  };

  const handleAdd = async () => {
    try {
      // Referencia al documento actual de la colección
      const docRef = doc(db, collectionName, collectionName); // Usa collectionName como el ID del documento

      // Añadir el nuevo objeto `formData` al array `data`
      await updateDoc(docRef, {
        data: arrayUnion(formData), // Agregar el nuevo registro al final del array `data`
      });

      if (onSuccess) {
        onSuccess();
      } 
      onClose();
    } catch (error) {
      console.error('Error al agregar el nuevo registro al documento existente:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Agregar Nuevo Registro</h2>
          <button
            onClick={onClose}
            className="bg-red-500 text-white rounded-lg px-3 py-1"
          >
            X
          </button>
        </div>

        <div className="mb-4">
          {Object.entries(collectionFieldMapping[collectionName] || {}).map(([key, type]) => (
            <div key={key} className="mb-2">
              <label className="block text-sm font-medium text-gray-700 font-bold">
                {key}
              </label>
              {type === 'array' ? (
                <>
                  {formData[key]?.map((item, index) => (
                    <input
                      key={index}
                      type="number"
                      value={item}
                      onChange={(e) => handleArrayChange(index, e.target.value)}
                      className="mt-1 p-2 mb-2 block w-full border border-gray-300 rounded-md"
                    />
                  ))}
                  <button
                    onClick={addArrayElement}
                    className="text-blue-500 underline"
                  >
                    Agregar valor
                  </button>
                </>
              ) : (
                <input
                  type={type === 'number' ? 'number' : 'text'}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAdd}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDataForm;
