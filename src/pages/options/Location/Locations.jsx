import React, { useState, useEffect } from 'react';
import { db } from '../../../connection/firebase';
import { collection, getDocs, updateDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';  
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import LocationStates from './LocationStates';
import { useAuth } from '../../../context/AuthContext';
import EditStatesModal from './EditStatesModal';
import CustomSelect from '../../../components/UI/CustomSelect'; 
import MapComponent from '../../../components/UI/MapComponent';
import { FaTimes } from 'react-icons/fa'; 
import { calculateDistance } from '../../../components/layout/calculateDistance';

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [mapLocations, setMapLocations] = useState([]);
  const [stateColors, setStateColors] = useState({});
  const { currentUser } = useAuth();
  const userRole = currentUser?.role || JSON.parse(localStorage.getItem('user'))?.role || 'Usuario';
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); 
  const [markerPosition, setMarkerPosition] = useState({ lat: -16.495543, lng: -68.133543 }); 
  const [selectedClient, setSelectedClient] = useState(null); 
  const [selectedState, setSelectedState] = useState('Pendiente'); 
  const [description, setDescription] = useState('');  // Nuevo estado para descripción
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
  const [distanceWarning, setDistanceWarning] = useState(''); 

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locationList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLocations(locationList);
      setMapLocations(locationList);
    });

    const fetchStateColors = async () => {
      const statesCol = collection(db, 'locationStates');
      const statesSnapshot = await getDocs(statesCol);

      const stateData = {};
      statesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        stateData[doc.id] = data.color;
      });

      setStateColors(stateData);
    };

    fetchStateColors();

    return () => unsubscribe();  
  }, []);

  const handleChangeState = async (id, newState) => {
    try {
      const locationDoc = doc(db, 'locations', id);
      await updateDoc(locationDoc, { state: newState });
    } catch (error) {
      console.error('Error updating location state: ', error);
    }
  };

  const handleMapClick = (clickedLocation) => {
    const newLat = clickedLocation.lat;
    const newLng = clickedLocation.lng;

    setMarkerPosition({ lat: newLat, lng: newLng });

    let isTooClose = false;
    let distanceWarningMessage = '';

    locations.forEach((location) => {
      if (location.location && location.location.lat && location.location.lng) {
        const distance = calculateDistance(location.location.lat, location.location.lng, newLat, newLng);
        if (distance < 10) { 
          isTooClose = true;
          distanceWarningMessage = 'La ubicación seleccionada está demasiado cerca de otra ubicación existente.';
        }
      }
    });

    setIsButtonDisabled(isTooClose);
    setDistanceWarning(distanceWarningMessage);
  };

  const handleAddLocation = async () => {
    if (selectedClient && markerPosition) {
      try {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().replace(/[:.]/g, '_'); 
        const locationId = `${selectedClient.label}_${formattedDate}`;  

        await setDoc(doc(db, 'locations', locationId), {
          client: selectedClient.label,
          location: markerPosition,
          state: selectedState,
          description: description,  // Guardar la descripción
        });
  
        setShowAddModal(false);  
        setDescription('');  // Limpiar la descripción
      } catch (error) {
        console.error('Error al agregar la ubicación: ', error);
      }
    }
  };
  

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full h-full text-black">
      <h2 className="text-xl font-bold mb-4">Ubicaciones de Cotizaciones</h2>

      {(userRole === 'Administrador' || userRole === 'Gerencia') && (
        <div className="mt-4">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setShowEditModal(true)}
          >
            Editar Estados
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 ml-4 rounded hover:bg-green-700 transition"
            onClick={() => setShowAddModal(true)} 
          >
            Agregar Ubicación
          </button>
        </div>
      )}

      <div className="flex flex-row w-full mt-4">
        <div className="w-3/5 h-[68vh]">
          <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
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
                    icon={`http://maps.google.com/mapfiles/ms/icons/${stateColors[location.state] || 'red'}-dot.png`}
                    title={`${location.client}: ${location.address}`}
                  />
                )
              ))}
            </GoogleMap>
          </LoadScriptNext>
        </div>

        <div className="w-2/5 overflow-y-auto h-[68vh]">
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Descripción</th> {/* Nueva columna */}
                {userRole === 'Administrador' || userRole === 'Gerencia' ? (
                  <th className="px-4 py-2">Cambiar Estado</th>
                ) : (
                  <th className="px-4 py-2">Estado</th>
                )}
              </tr>
            </thead>
            <tbody>
              {locations
                .filter(location => location.client)
                .map((location) => (
                  location.id !== 'locationStates' && (
                    <tr key={location.id}>
                      <td className="border px-4 py-2">{location.client}</td>
                      <td className="border px-4 py-2">{location.description || 'Sin descripción'}</td> {/* Mostrar la descripción */}
                      {userRole === 'Administrador' || userRole === 'Gerencia' ? (
                        <td className="border px-4 py-2">
                          <LocationStates
                            currentLocationState={location.state}
                            onChangeState={(newState) => handleChangeState(location.id, newState)}
                          />
                        </td>
                      ) : (
                        <td className={`border px-4 py-2 text-${stateColors[location.state] || 'black'}-600`}>
                          {location.state}
                        </td>
                      )}
                    </tr>
                  )
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] h-[90%] text-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Agregar Ubicación</h2>
              <button
                className="text-red-500 bg-white border border-red-500 rounded-full p-2 hover:bg-red-500 hover:text-white"
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              <div>
                <label htmlFor="clientName" className="mb-2 font-semibold text-black">Seleccionar Cliente</label>
                <CustomSelect
                  collectionName="clients"
                  placeholder="Seleccionar Cliente"
                  onChange={(option) => setSelectedClient(option)}
                  selectedValue={selectedClient}
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-2 font-semibold text-black">Descripción</label>
                <input
                  type="text"
                  className="p-2 border rounded w-full"
                  placeholder="Añadir descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}  // Manejar la descripción
                />
              </div>

              <div>
                <label htmlFor="state" className="mb-2 font-semibold text-black">Seleccionar Estado</label>
                <LocationStates
                  currentLocationState={selectedState}
                  onChangeState={setSelectedState}
                />
              </div>

              <div className="w-full h-[39vh] border mt-4">
                <MapComponent
                  mapCenter={{ lat: -16.495543, lng: -68.133543 }}
                  markerPosition={markerPosition}
                  handleMapClick={handleMapClick}
                  setButtonDisabled={setIsButtonDisabled}
                />
              </div>

              {distanceWarning && (
                <p className="text-red-500">{distanceWarning}</p>
              )}

              <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700 transition"
                onClick={handleAddLocation}
                disabled={isButtonDisabled || !selectedClient}
              >
                Guardar Ubicación
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditStatesModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default React.memo(Location);
