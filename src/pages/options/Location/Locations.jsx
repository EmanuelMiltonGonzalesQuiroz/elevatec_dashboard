import React, { useState, useEffect } from 'react';
import { db } from '../../../connection/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import LocationStates from './LocationStates';
import { useAuth } from '../../../context/AuthContext';
import EditStatesModal from './EditStatesModal'; // Importar el modal para editar estados

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [mapLocations, setMapLocations] = useState([]);
  const [stateColors, setStateColors] = useState({}); // Para guardar los colores de los estados
  const { currentUser } = useAuth(); 
  const userRole = currentUser?.role || JSON.parse(localStorage.getItem('user'))?.role || 'Usuario';
  const [showEditModal, setShowEditModal] = useState(false); // Estado para el modal de editar estados

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsCol = collection(db, 'locations');
      const locationSnapshot = await getDocs(locationsCol);
      const locationList = locationSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const enrichedLocations = await Promise.all(locationList.map(async (location) => {
        if (location.location && location.location.lat && location.location.lng) {
          const address = await getAddressFromLatLng(location.location.lat, location.location.lng);
          return { ...location, address };
        } else {
          return { ...location, address: 'Ubicación no disponible' };
        }
      }));

      setLocations(enrichedLocations);
      setMapLocations(enrichedLocations);
    };

    const fetchStateColors = async () => {
      const statesCol = collection(db, 'locationStates');
      const statesSnapshot = await getDocs(statesCol);

      const stateData = {};
      statesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        stateData[doc.id] = data.color; // Guardar el color de cada estado
      });

      setStateColors(stateData); // Guardar colores en el estado
    };

    fetchLocations();
    fetchStateColors(); // Obtener colores de los estados desde la base de datos
  }, []);

  const handleChangeState = async (id, newState) => {
    try {
      const locationDoc = doc(db, 'locations', id);
      await updateDoc(locationDoc, { state: newState });
      const updatedLocations = locations.map(location => 
        location.id === id ? { ...location, state: newState } : location
      );
      setLocations(updatedLocations);
      setMapLocations(updatedLocations); 
    } catch (error) {
      console.error('Error updating location state: ', error);
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_MAPS_API_KEY}`);
    const data = await response.json();
    if (data.status === 'OK') {
      return data.results[0]?.formatted_address || 'Dirección no disponible';
    }
    return 'Dirección no disponible';
  };

  // Obtener la clase CSS basada en el color de la base de datos
  const getStateClass = (state) => {
    const color = stateColors[state] || 'black'; // Usar negro por defecto si no hay color en la BD
    return `text-${color}-600`; // Clase de color dinámico
  };

  // Obtener el ícono del marcador basado en el color de la base de datos
  const getMarkerColor = (state) => {
    const color = stateColors[state] || 'red'; // Usar rojo por defecto si no hay color en la BD
    return `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full h-full text-black">
      <h2 className="text-xl font-bold mb-4">Ubicaciones de Cotizaciones</h2>

      <div className="w-full h-48">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat: -16.495543, lng: -68.133543 }} 
            zoom={10}
          >
            {mapLocations.map((location) => (
              location.location && location.location.lat && location.location.lng && (
                <Marker
                  key={location.id}
                  position={{ lat: location.location.lat, lng: location.location.lng }}
                  icon={getMarkerColor(location.state)} // Usar color del estado desde la BD
                  title={`${location.client}: ${location.address}`}
                />
              )
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {userRole === 'Administrador' && (
        <div className="mt-4">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setShowEditModal(true)} // Mostrar el modal de editar estados
          >
            Editar Estados
          </button>
        </div>
      )}

      {/* Tabla de ubicaciones */}
      <div className="w-full overflow-y-auto mt-4 max-h-[40vh]">
        <table className="table-auto w-full mb-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Cliente</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Cambiar Estado</th>
            </tr>
          </thead>
          <tbody>
            {locations
              .filter(location => location.client) // Filtrar solo ubicaciones con cliente
              .map((location) => (
                location.id !== 'locationStates' && (
                  <tr key={location.id}>
                    <td className="border px-4 py-2">{location.client}</td>
                    <td className={`border px-4 py-2 ${getStateClass(location.state)}`}>
                      {location.state}
                    </td>
                    <td className="border px-4 py-2">
                      <LocationStates
                        currentLocationState={location.state}
                        onChangeState={(newState) => handleChangeState(location.id, newState)}
                      />
                    </td>
                  </tr>
                )
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para editar estados */}
      {showEditModal && (
        <EditStatesModal onClose={() => setShowEditModal(false)} /> // Llamada al modal
      )}
    </div>
  );
};

export default Location;
