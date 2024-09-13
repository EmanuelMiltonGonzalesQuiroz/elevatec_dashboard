import React, { useState, useEffect } from 'react';
import { db } from '../../../connection/firebase';
import { collection, onSnapshot, getDocs, updateDoc, doc } from 'firebase/firestore';
import LocationHeader from './LocationHeader';
import LocationTable from './LocationTable';
import LocationMap from './LocationMap';
import AddLocationModal from './AddLocationModal';
import EditStatesModal from './EditStatesModal';
import { useAuth } from '../../../context/AuthContext';

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [mapLocations, setMapLocations] = useState([]);
  const [stateColors, setStateColors] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: -16.495543, lng: -68.133543 }); // Initial center
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { currentUser } = useAuth();
  const userRole = currentUser?.role || 'Usuario';

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locationList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(locationList);
      setMapLocations(locationList);
    });

    const fetchStateColors = async () => {
      const statesCol = collection(db, 'locationStates');
      const statesSnapshot = await getDocs(statesCol);
      const stateData = {};
      statesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.state === true) {  // Solo agregar estados activos
          stateData[doc.id] = data.color;
        }
      });
      setStateColors(stateData);
    };

    fetchStateColors();
    return () => unsubscribe();
  }, []);

  const handleRowClick = (location) => {
    if (location && location.lat && location.lng) {
      setMapCenter({ lat: location.lat, lng: location.lng });
    }
  };

  const handleChangeState = async (locationId, newState) => {
    try {
      const locationRef = doc(db, 'locations', locationId);
      await updateDoc(locationRef, { state: newState });
    } catch (error) {
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full h-full text-black">
      <LocationHeader
        userRole={userRole}
        onEdit={() => setShowEditModal(true)}
        onAdd={() => setShowAddModal(true)}
      />
      <div className="flex flex-row w-full mt-4">
        <LocationMap mapLocations={mapLocations} stateColors={stateColors} mapCenter={mapCenter} />
        <LocationTable
          locations={locations}
          userRole={userRole}
          stateColors={stateColors}
          onRowClick={handleRowClick}
          onChangeState={handleChangeState} // Pasar la función handleChangeState
        />
      </div>
      {showAddModal && <AddLocationModal onClose={() => setShowAddModal(false)} />}
      {showEditModal && <EditStatesModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
};

export default React.memo(Location);
