import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase.js';

const EditStatesModal = ({ onClose }) => {
  const [states, setStates] = useState({});
  const [newStateName, setNewStateName] = useState('');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const docRef = doc(db, 'locations', 'locationStates');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStates(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = async (state, value) => {
    const updatedStates = { ...states, [state]: value };
    setStates(updatedStates);

    try {
      const docRef = doc(db, 'locations', 'locationStates');
      await updateDoc(docRef, updatedStates);
    } catch (error) {
      console.error('Error updating states:', error);
    }
  };

  const handleAddState = async () => {
    if (newStateName.trim() === '') return;
    const updatedStates = { ...states, [newStateName]: true };
    setStates(updatedStates);
    setNewStateName('');

    try {
      const docRef = doc(db, 'locations', 'locationStates');
      await updateDoc(docRef, updatedStates);
    } catch (error) {
      console.error('Error adding state:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Editar Estados</h2>

        {/* Listar los estados */}
        {Object.keys(states).map((state) => (
          <div key={state} className="flex justify-between items-center mb-4">
            <span>{state}</span>
            <select
              value={states[state] ? 'true' : 'false'}
              onChange={(e) => handleStateChange(state, e.target.value === 'true')}
              className="p-2 rounded border"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        ))}

        {/* Agregar nuevo estado */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            placeholder="Nuevo Estado"
            value={newStateName}
            onChange={(e) => setNewStateName(e.target.value)}
            className="p-2 rounded border flex-grow"
          />
          <button
            onClick={handleAddState}
            className="bg-blue-500 text-white px-4 py-2 ml-2 rounded hover:bg-blue-700 transition"
          >
            Agregar
          </button>
        </div>

        {/* Botón para cerrar */}
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default EditStatesModal;
