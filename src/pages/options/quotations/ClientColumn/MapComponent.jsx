import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../connection/firebase';
import { calculateDistance } from '../../../../components/layout/calculateDistance';

const MapComponent = ({ mapCenter, markerPosition, handleMapClick, setButtonDisabled }) => {
  const [locations, setLocations] = useState([]);
  const [tooClose, setTooClose] = useState(false);

  useEffect(() => {
    const fetchLocationsAndColors = async () => {
      const locationsCol = collection(db, 'locations');
      const locationSnapshot = await getDocs(locationsCol);
      const locationList = locationSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(location =>
          location.Tipo?.[0] === 'CONSTRUCCION' &&
          location.Tipo?.[1] === 'CA' &&
          location.Tipo?.[2] === 'C. ASCENSORES'
        );
      setLocations(locationList);
    };

    fetchLocationsAndColors();
  }, []);

  const isValidLatLng = (lat, lng) => {
    return typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
  };

  const handleMapClickWithCheck = (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    if (!isValidLatLng(clickedLocation.lat, clickedLocation.lng)) {
      return;
    }

    const threshold = 20;
    let isTooClose = false;

    locations.forEach((location) => {
      if (location.state === 'Cotizacion_A' && isValidLatLng(location.location?.lat, location.location?.lng)) {
        const distance = calculateDistance(
          location.location.lat,
          location.location.lng,
          clickedLocation.lat,
          clickedLocation.lng
        );
        if (distance < threshold) {
          isTooClose = true;
        }
      }
    });

    setTooClose(isTooClose);
    setButtonDisabled(isTooClose);
    if (!isTooClose) {
      handleMapClick(event);
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={isValidLatLng(mapCenter.lat, mapCenter.lng) ? mapCenter : { lat: -16.495543, lng: -68.133543 }}
        zoom={10}
        onClick={handleMapClickWithCheck}
      >
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

        {isValidLatLng(markerPosition.lat, markerPosition.lng) && (
          <MarkerF position={markerPosition} />
        )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default React.memo(MapComponent);
