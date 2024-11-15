import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../connection/firebase';

const MapComponent = ({ mapCenter, markerPosition, handleMapClick, address }) => {
  const [mapLocations, setMapLocations] = useState([]);
  const [stateColors, setStateColors] = useState({});

  useEffect(() => {
    const fetchLocationsAndColors = async () => {
      try {
        const locationsCol = collection(db, 'locations');
        const locationSnapshot = await getDocs(locationsCol);
        const locationList = locationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMapLocations(locationList);

        const statesCol = collection(db, 'locationStates');
        const statesSnapshot = await getDocs(statesCol);

        const stateData = {};
        statesSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          stateData[doc.id] = data.color;
        });

        setStateColors(stateData);
      } catch (error) {
        console.error('Error obteniendo datos de Firestore:', error);
      }
    };

    fetchLocationsAndColors();
  }, []);

  const handleMapClickWithCheck = (event) => {
    if (event && event.latLng) {
      const clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      handleMapClick(clickedLocation);
    }
  };

  // Geocode the address and update map center
  useEffect(() => {
    const geocodeAddress = async () => {
      if (!address) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          handleMapClick({ lat: location.lat(), lng: location.lng() });
        } else {
          
        }
      });
    };

    geocodeAddress();
  }, [address, handleMapClick]);

  return (
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={10}
        onClick={handleMapClickWithCheck}
      >
        {Array.isArray(mapLocations) &&
          mapLocations
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
        {markerPosition && markerPosition.lat && markerPosition.lng && (
          <MarkerF position={markerPosition} />
        )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default React.memo(MapComponent);
