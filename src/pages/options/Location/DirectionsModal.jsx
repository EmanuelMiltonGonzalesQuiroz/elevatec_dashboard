import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { LoadScriptNext, DirectionsRenderer, GoogleMap } from '@react-google-maps/api';

const DirectionsModal = ({ location, onClose }) => {
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(null); // Estado para manejar errores de ubicación

  // Obtener la ubicación actual del usuario
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null); // Resetear error si la ubicación es obtenida correctamente
      },
      (error) => {
        console.error('Error obteniendo la ubicación:', error);
        setLocationError('No pudimos acceder a tu ubicación. Por favor, habilita la ubicación en tu navegador.');
      }
    );
  }, []);

  // Calcular la ruta utilizando Google Maps Directions API
  useEffect(() => {
    if (currentLocation.lat && currentLocation.lng) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentLocation,
          destination: { lat: location.location.lat, lng: location.location.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error obteniendo las direcciones: ${status}`);
          }
        }
      );
    }
  }, [currentLocation, location]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] h-[80%] text-black relative">
        <button className="absolute top-4 right-4 text-red-500" onClick={onClose}>
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-4">Cómo llegar a {location.client}</h2>
        <div className="h-[68vh] w-full">
          {locationError ? (
            <div className="text-red-500 text-center">
              <p>{locationError}</p>
              <p>Asegúrate de que la ubicación esté habilitada en tu navegador.</p>
            </div>
          ) : (
            <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={currentLocation}
                zoom={14}
              >
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </LoadScriptNext>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DirectionsModal);
