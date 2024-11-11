import React, { useState, useEffect } from 'react';
import { db } from '../../../connection/firebase';
import { collection, onSnapshot, getDocs, setDoc, updateDoc, doc } from 'firebase/firestore';
import LocationHeader from './LocationHeader';
import LocationTable from './LocationTable';
import LocationMap from './LocationMap';
import AddLocationModal from './AddLocationModal';
import EditStatesModal from './EditStatesModal';
import EditLocationModal from './EditLocationModal';
import DirectionsModal from './DirectionsModal'; // Importamos el nuevo modal
import { useAuth } from '../../../context/AuthContext';

const defaultStates = [
  { id: 'Cotizacion_A', state: true, color: '#ADD8E6' },   // Light Blue
  { id: 'Cotizacion_M', state: true, color: '#0000FF' },   // Blue
  { id: 'Construccion', state: true, color: '#008000' },   // Green
  { id: 'Mantenimiento', state: true, color: '#FBBC04' },  // Yellow
  { id: 'Modernizacion', state: true, color: '#800080' },  // Purple
  { id: 'Competencia', state: true, color: '#808080' },    // Gray
  { id: 'Eliminar', state: true, color: '#FF0000' },       // Red
  { id: 'default', state: true, color: '#FFFFFF' }         // White (default)
];

const Location = () => {
  const [locations, setLocations] = useState([]); 
  const [mapLocations, setMapLocations] = useState([]);
  const [stateColors, setStateColors] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: -16.495543, lng: -68.133543 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false); // Estado para el modal de direcciones
  const [editingLocation, setEditingLocation] = useState(null);
  const [selectedLocationForDirections, setSelectedLocationForDirections] = useState(null); // Estado para la ubicación seleccionada
  const { currentUser } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);
  const userRole = currentUser?.role || 'Usuario';

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locationList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(locationList);
      setMapLocations(locationList);
    });

    const fetchLocationStates = async () => { 
      try {
        const locationStatesCol = collection(db, 'locationStates');
        const locationStatesSnapshot = await getDocs(locationStatesCol);
        
    
        // If the collection is empty, add the default states
        if (locationStatesSnapshot.empty ) {
          await Promise.all(
            defaultStates.map(async (state) => {
              const stateDocRef = doc(db, 'locationStates', state.id);
              await setDoc(stateDocRef, { state: state.state, color: state.color });

            })
          ); // Load default states

        } 

      } catch (error) {
        console.error('Error fetching location states: ', error);
      }
    };
    fetchLocationStates();

    const fetchStateColors = async () => {
      const statesCol = collection(db, 'locationStates');
      const statesSnapshot = await getDocs(statesCol);
      const stateData = {};
      statesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.state === true) {
          stateData[doc.id] = data.color;
        }
      });
      setStateColors(stateData);
    };

    fetchStateColors();
    return () => unsubscribe();
  }, []);

  const handleRowClick = (location) => {
    if (location.location && location.location.lat && location.location.lng) {
      // Mover el mapa
      setMapCenter({ lat: location.location.lat, lng: location.location.lng });
      
      // Copiar latitud y longitud al portapapeles
      const latLng = `${location.location.lat}, ${location.location.lng}`;
      navigator.clipboard.writeText(latLng)
        .then(() => {
          setCopySuccess(true); // Mostrar mensaje de éxito
          setTimeout(() => setCopySuccess(false), 2000); // Ocultar el mensaje después de 2 segundos
        })
        .catch(err => console.error('Error al copiar al portapapeles: ', err));
    }
  };


  const handleChangeState = async (locationId, newState) => {
    try {
      const locationRef = doc(db, 'locations', locationId);
      await updateDoc(locationRef, { state: newState });
    } catch (error) {
      console.error('Error updating state:', error);
    }
  };

  const handleStateRestore = () => {
    const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locationList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(locationList);
      setMapLocations(locationList);
    });

    return () => unsubscribe();
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
  };

  const handleShowDirections = (location) => {
    setSelectedLocationForDirections(location);
    setShowDirectionsModal(true);
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full h-full text-black">
      <LocationHeader
        userRole={userRole}
        onEdit={() => setShowEditModal(true)}
        onAdd={() => setShowAddModal(true)}
      />
      <div className="flex flex-col w-full mt-4 space-y-4">
        <LocationMap mapLocations={mapLocations} stateColors={stateColors} mapCenter={mapCenter} />
        <LocationTable
          locations={locations}
          userRole={userRole}
          stateColors={stateColors}
          onRowClick={handleRowClick}
          onChangeState={handleChangeState}
          onEdit={handleEditLocation}
          onShowDirections={handleShowDirections}
          onStateRestore={handleStateRestore}  // Agregamos la función para refrescar después de restaurar
        />
      </div>
      {showAddModal && <AddLocationModal onClose={() => setShowAddModal(false)} />}
      {showEditModal && <EditStatesModal onClose={() => setShowEditModal(false)} />}
      {editingLocation && (
        <EditLocationModal
          location={editingLocation}
          onClose={() => setEditingLocation(null)}
        />
      )}
      {showDirectionsModal && selectedLocationForDirections && (
        <DirectionsModal
          location={selectedLocationForDirections}
          onClose={() => setShowDirectionsModal(false)}
        />
      )}
      {copySuccess && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 p-2 bg-blue-700 text-white rounded shadow-lg">
          Coordenadas copiadas correctamente
        </div>
      )}

    </div>
  );
};

export default React.memo(Location);
