import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../connection/firebase'; // Importar la conexión a Firestore
import { calculateDistance } from '../../../../components/layout/calculateDistance'; // Asegúrate de tener la función de cálculo de distancia.
import { geocodeAddress } from '../../../../components/layout/geocodeAddress';

const MapComponentM = ({ mapCenter, markerPosition, handleMapClick, address }) => {
  const [locations, setLocations] = useState([]); // Estado para guardar las ubicaciones existentes
  const [stateColors, setStateColors] = useState({}); // Estado para los colores de las ubicaciones
  const [MarkerPosition, setMarkerPosition] = useState(); // Estado para los colores de las ubicaciones


  // Obtener ubicaciones y colores de Firestore
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

        const statesCol = collection(db, 'locationStates');
        const statesSnapshot = await getDocs(statesCol);
        const stateData = {};
        statesSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          stateData[doc.id] = data.color;
        });
        setStateColors(stateData);
      } catch {}
    };

    fetchLocationsAndColors();
  }, []);

  // Geocodificar la dirección cuando cambia
  useEffect(() => {
    const fetchGeocodedLocation = async () => {
      if (address) {
        try {
          const newLocation = await geocodeAddress(address, markerPosition, (location) => {
            handleMapClick({ lat: location.lat, lng: location.lng });
          });
          setMarkerPosition(newLocation);
        } catch {}
      }
    };
    fetchGeocodedLocation();
  }, [address, markerPosition, handleMapClick]);

  // Función para manejar clics en el mapa
  const handleMapClickWithCheck = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    const threshold = 10; // 10 metros de distancia
    const isTooClose = locations.some((location) => {
      if (location.location && location.location.lat && location.location.lng) {
        const distance = calculateDistance(
          location.location.lat,
          location.location.lng,
          clickedLocation.lat,
          clickedLocation.lng
        );
        return distance < threshold;
      }
      return false;
    });

    if (!isTooClose) {
      handleMapClick(clickedLocation);
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
        {Array.isArray(locations) &&
          locations
            .filter((location) => location.state !== 'Eliminar' && location.state !== 'default' && location.state !== '')
            .map((location) =>
              location.location && location.location.lat && location.location.lng ? (
                <MarkerF
                  key={location.id}
                  position={{ lat: location.location.lat, lng: location.location.lng }}
                  icon={`http://maps.google.com/mapfiles/ms/icons/blue-dot.png`}
                />
              ) : null
            )
        }

        {/* Marcador para la nueva ubicación */}
        <MarkerF position={markerPosition} />
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default React.memo(MapComponentM);
