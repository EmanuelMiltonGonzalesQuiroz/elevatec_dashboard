import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../connection/firebase'; // Importar la conexión a Firestore
import { calculateDistance } from '../../../../components/layout/calculateDistance'; // Asegúrate de tener la función de cálculo de distancia.

const MapComponentM = ({ mapCenter, markerPosition, handleMapClick }) => {
  const [locations, setLocations] = useState([]); // Estado para guardar las ubicaciones existentes
  const [stateColors, setStateColors] = useState({}); // Estado para los colores de las ubicaciones

  // Función para obtener las ubicaciones y colores de Firestore
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
        setLocations(locationList); // Guardamos las ubicaciones obtenidas

        // Obtener los colores de estado desde la colección 'locationStates'
        const statesCol = collection(db, 'locationStates');
        const statesSnapshot = await getDocs(statesCol);
        const stateData = {};
        statesSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          stateData[doc.id] = data.color;
        });
        setStateColors(stateData); // Guardamos los colores de estado
      } catch (error) {
        console.error('Error obteniendo datos de Firestore:', error);
      }
    };

    fetchLocationsAndColors();
  }, []);

  // Función para manejar clics en el mapa
  const handleMapClickWithCheck = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    let tooClose = false;
    const threshold = 10; // 10 metros de distancia

    // Verificamos si la ubicación seleccionada está cerca de alguna ubicación existente
    locations.forEach((location) => {
      if (location.location && location.location.lat && location.location.lng) {
        const distance = calculateDistance(
          location.location.lat,
          location.location.lng,
          clickedLocation.lat,
          clickedLocation.lng
        );
        if (distance < threshold) {
          tooClose = true;
        }
      }
    });

    // Si la ubicación está demasiado cerca, deshabilitamos el botón
    if (tooClose) {
    } else {
      handleMapClick(event); // Continuar con la lógica del clic en el mapa
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={10}
        onClick={handleMapClickWithCheck} // Usamos la nueva función de manejo de clics
      >
        {/* Renderizar los marcadores con los colores basados en el estado */}
        {Array.isArray(locations) &&
          locations.map((location) => (
            location.location && location.location.lat && location.location.lng ? (
              <MarkerF
                key={location.id}
                position={{ lat: location.location.lat, lng: location.location.lng }}
                // Usa el color basado en el estado de la ubicación
                icon={`http://maps.google.com/mapfiles/ms/icons/blue-dot.png`}
              />
            ) : null
          ))
        }

        {/* Marcador para la nueva ubicación */}
        <MarkerF position={markerPosition} />
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default React.memo(MapComponentM);
