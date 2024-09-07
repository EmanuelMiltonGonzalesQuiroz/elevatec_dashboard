import React, { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const defaultStates = [
  { id: 'Pendiente', state: true, color: 'green' },
  { id: 'Perdida', state: true, color: 'gray' },
  { id: 'Concretada', state: true, color: 'blue' },
  { id: 'Default', state: false, color: 'white' },
];

const LocationStates = ({ currentLocationState, onChangeState }) => {
  const [availableStates, setAvailableStates] = useState([]);

  useEffect(() => {
    const fetchLocationStates = async () => {
      try {
        const locationStatesCol = collection(db, 'locationStates');
        const locationStatesSnapshot = await getDocs(locationStatesCol);

        // Si la colección está vacía, agregar los estados por defecto
        if (locationStatesSnapshot.empty) {
          await Promise.all(
            defaultStates.map(async (state) => {
              const stateDocRef = doc(db, 'locationStates', state.id);
              await setDoc(stateDocRef, { state: state.state, color: state.color });
            })
          );
          setAvailableStates(defaultStates); // Cargar los estados por defecto
        } else {
          // Si la colección no está vacía, cargar los estados disponibles
          const states = locationStatesSnapshot.docs
            .filter(doc => doc.data().state === true) // Solo incluir estados con 'state' en true
            .map(doc => ({
              id: doc.id,
              color: doc.data().color,
            })); // Obtener los IDs y colores de los estados

          setAvailableStates(states);
        }
      } catch (error) {
        console.error('Error fetching location states: ', error);
      }
    };

    fetchLocationStates();
  }, []);

  return (
    <div>
      <select
        value={currentLocationState}
        onChange={(e) => onChangeState(e.target.value)}
        className="p-2 rounded border text-black font-bold"
      >
        {availableStates.map((state) => (
          <option key={state.id} value={state.id}>
            {state.id.charAt(0).toUpperCase() + state.id.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationStates;
