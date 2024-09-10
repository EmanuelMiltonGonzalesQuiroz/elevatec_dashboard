import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../connection/firebase';  // Importar la conexión a Firestore

const MapComponent = ({ mapCenter, markerPosition, handleMapClick, setButtonDisabled }) => {
  const [mapLocations, setMapLocations] = useState([]); // Estado para las ubicaciones
  const [stateColors, setStateColors] = useState({});  // Estado para los colores de estado

  // Función para obtener las ubicaciones y los colores de Firestore
  useEffect(() => {
    const fetchLocationsAndColors = async () => {
      try {
        // Obtener las ubicaciones desde la colección 'locations'
        const locationsCol = collection(db, 'locations');
        const locationSnapshot = await getDocs(locationsCol);
        const locationList = locationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMapLocations(locationList); // Guardar las ubicaciones en el estado

        // Obtener los colores de estado desde la colección 'locationStates'
        const statesCol = collection(db, 'locationStates');
        const statesSnapshot = await getDocs(statesCol);

        const stateData = {};
        statesSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          stateData[doc.id] = data.color;
        });

        setStateColors(stateData);  // Guardar los colores de estado en el estado
      } catch (error) {
        console.error('Error obteniendo datos de Firestore:', error);
      }
    };

    fetchLocationsAndColors();  // Llamamos a la función para obtener datos
  }, []);  // Solo corre una vez cuando el componente se monta

  // Manejar clics en el mapa
  const handleMapClickWithCheck = (event) => {
    if (event && event.latLng) {
      const clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      handleMapClick(clickedLocation); // Actualizar la posición del marcador
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={10}
        onClick={handleMapClickWithCheck}
      >
        {/* Renderizar los marcadores con los colores basados en el estado */}
        {Array.isArray(mapLocations) &&
          mapLocations.map((location) => (
            location.location && location.location.lat && location.location.lng ? (
              <MarkerF
                key={location.id}
                position={{ lat: location.location.lat, lng: location.location.lng }}
                icon={`http://maps.google.com/mapfiles/ms/icons/${stateColors[location.state] || 'red'}-dot.png`}
              />
            ) : null
          ))
        }

        {/* Marcador para la nueva ubicación */}
        {markerPosition && markerPosition.lat && markerPosition.lng && (
          <MarkerF position={markerPosition} />
        )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default React.memo(MapComponent);
