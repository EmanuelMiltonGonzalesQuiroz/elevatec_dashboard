import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../connection/firebase'; // Importar la conexión a Firestore
import { calculateDistance } from '../../../../components/layout/calculateDistance';

const MapComponent = ({ mapCenter, markerPosition, handleMapClick, setButtonDisabled }) => {
  const [locations, setLocations] = useState([]); // Estado para guardar las ubicaciones existentes

  // Función para obtener las ubicaciones de Firestore
  useEffect(() => {
    const fetchLocations = async () => {
      const locationsCol = collection(db, 'locations');
      const locationSnapshot = await getDocs(locationsCol);
      const locationList = locationSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLocations(locationList); // Guardamos las ubicaciones obtenidas
    };

    fetchLocations();
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
      setButtonDisabled(true); // Señal para deshabilitar el botón
    } else {
      setButtonDisabled(false); // Señal para habilitar el botón
      handleMapClick(event); // Continuar con la lógica del clic en el mapa
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={10}
        onClick={handleMapClickWithCheck} // Usamos la nueva función de manejo de clics
      >
        <MarkerF position={markerPosition} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
