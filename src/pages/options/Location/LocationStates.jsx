import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const LocationStates = ({ currentLocationState, onChangeState }) => {
  const [availableStates, setAvailableStates] = useState([]);

  useEffect(() => {
    const fetchLocationStates = async () => {
      try {
        const locationStatesDoc = doc(db, 'locations', 'locationStates');
        const locationStatesSnapshot = await getDoc(locationStatesDoc);
        if (locationStatesSnapshot.exists()) {
          const data = locationStatesSnapshot.data();
          const trueStates = Object.keys(data).filter((key) => data[key] === true); // Solo estados en true
          setAvailableStates(trueStates);
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
          <option key={state} value={state}>
            {state.charAt(0).toUpperCase() + state.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationStates;
