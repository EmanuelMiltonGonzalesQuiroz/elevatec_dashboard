import React, { useState, useEffect } from 'react';
import { doc, getDocs, collection, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { FaTimes } from 'react-icons/fa';

const RestoreStateModal = ({ location, onClose, onStateRestore }) => {
  const [state, setState] = useState(location.state || '');
  const [availableStates, setAvailableStates] = useState([]);
  const [locationDocId, setLocationDocId] = useState(null);  // Guardar el ID del documento
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableStates = async () => {
      try {
        // Obtenemos los estados disponibles desde la colección "locationStates"
        const statesSnapshot = await getDocs(collection(db, 'locationStates'));
        const states = statesSnapshot.docs.map(doc => ({
          id: doc.id,
          color: doc.data().color,
          state: doc.data().state,
        }));
        // Filtramos los estados, excluyendo "Eliminar" y "default"
        const filteredStates = states.filter(state => state.state === true && state.id !== 'Eliminar' && state.id !== 'default');
        setAvailableStates(filteredStates); // Solo mostramos estados activos y válidos
      } catch (error) {
        console.error('Error al obtener los estados: ', error);
      }
    };

    const fetchLocationDocument = async () => {
      try {
        // Buscar el documento de la ubicación en Firestore usando el campo 'id' numérico
        const q = query(collection(db, 'locations'), where('id', '==', location.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          setLocationDocId(docSnapshot.id);  // Guardamos el ID del documento Firestore
        } else {
          console.error('No se encontró ningún documento con el id proporcionado.');
        }
      } catch (error) {
        console.error('Error al buscar el documento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableStates();
    fetchLocationDocument();
  }, [location.id]);

  const handleSave = async () => {
    try {
      // Verificar que se haya encontrado un ID válido del documento
      if (!locationDocId) {
        throw new Error('No se encontró el ID del documento para actualizar.');
      }

      // Actualizar el estado del documento en Firestore
      const locationRef = doc(db, 'locations', locationDocId);
      await updateDoc(locationRef, { state: state });

      // Llamar la función de restauración y cerrar el modal
      onStateRestore();
      onClose();
    } catch (error) {
      console.error('Error al restaurar el estado:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end sm:items-center sm:justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[45vh] sm:w-[60%] max-h-[90vh] text-black overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold mb-4">Restaurar Estado</h2>
          <button className="text-red-500" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-black">Estado</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="" disabled>
                  Selecciona un estado
                </option>
                {availableStates.map((availableState) => (
                  <option key={availableState.id} value={availableState.id}>
                    {availableState.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Guardar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RestoreStateModal;
