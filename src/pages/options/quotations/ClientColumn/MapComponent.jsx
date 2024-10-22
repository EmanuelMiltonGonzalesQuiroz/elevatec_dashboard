import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../connection/firebase'; // Importar la conexión a Firestore
import { calculateDistance } from '../../../../components/layout/calculateDistance';

const MapComponent = ({ mapCenter, markerPosition, handleMapClick, setButtonDisabled }) => {
  const [locations, setLocations] = useState([]); // Estado para guardar las ubicaciones existentes

  // Función para obtener las ubicaciones desde Firestore
  useEffect(() => {
    const fetchLocationsAndColors = async () => {
      try {
        const locationsCol = collection(db, 'locations');
        const locationSnapshot = await getDocs(locationsCol);
        const locationList = locationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLocations(locationList);
      } catch (error) {
        console.error('Error obteniendo datos de Firestore:', error);
      }
    };

    fetchLocationsAndColors();
  }, []);

  // Validar si las coordenadas son válidas
  const isValidLatLng = (lat, lng) => {
    return typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
  };

  // Función para manejar los clics en el mapa
  const handleMapClickWithCheck = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    // Verificar si las coordenadas son válidas
    if (!isValidLatLng(clickedLocation.lat, clickedLocation.lng)) {
      console.error('Coordenadas no válidas:', clickedLocation);
      return;
    }

    let tooClose = false;
    const threshold = 10; // Distancia mínima de 10 metros

    // Verificar si la nueva ubicación está muy cerca de alguna ubicación existente
    locations.forEach((location) => {
      if (isValidLatLng(location.location?.lat, location.location?.lng)) {
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

    if (tooClose) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
      handleMapClick(event); // Procesar la lógica normal del clic
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={isValidLatLng(mapCenter.lat, mapCenter.lng) ? mapCenter : { lat: -16.495543, lng: -68.133543 }}
        zoom={10}
        onClick={handleMapClickWithCheck} // Usamos la función modificada de clic en el mapa
      >
        {/* Renderizar los marcadores de las ubicaciones existentes */}
        {Array.isArray(locations) &&
          locations
            .filter((location) => isValidLatLng(location.location?.lat, location.location?.lng) && location.state !== 'Eliminar' && location.state !== 'default')
            .map((location) => (
              <MarkerF
                key={location.id}
                position={{ lat: location.location.lat, lng: location.location.lng }}
                icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              />
            ))
        }

        {/* Marcador para la nueva ubicación seleccionada */}
        {isValidLatLng(markerPosition.lat, markerPosition.lng) && (
          <MarkerF position={markerPosition} />
        )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default React.memo(MapComponent);
