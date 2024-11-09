import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { LoadScriptNext, DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api';
import { useAuth } from '../../../context/AuthContext';

const DirectionsModal = ({ location, onClose }) => {
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      },
      (error) => {
        console.error('Error obteniendo la ubicación:', error);
        setLocationError('No pudimos acceder a tu ubicación. Por favor, habilita la ubicación en tu navegador.');
      }
    );
  }, []);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end sm:items-center sm:justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[45vh] sm:w-[90%] h-[90%] text-black relative">
        <button className="absolute top-4 right-4 text-red-500" onClick={onClose}>
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-4">
          Cómo llegar desde tu ubicación a {location.client}
        </h2>
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
                onLoad={(map) => {
                  if (directions) {
                    const bounds = new window.google.maps.LatLngBounds();
                    bounds.extend(directions.routes[0].legs[0].start_location);
                    bounds.extend(directions.routes[0].legs[0].end_location);
                    map.fitBounds(bounds);
                  }
                }}
              >
                {directions && (
                  <>
                    <Marker
                      position={directions.routes[0].legs[0].start_location}
                      label={{
                        text: currentUser.username || JSON.parse(localStorage.getItem('user'))?.username,
                        color: "black",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        scaledSize: new window.google.maps.Size(50, 50),
                        labelOrigin: new window.google.maps.Point(25, -10) // Move label slightly above the icon
                      }}
                    />

                    <Marker
                      position={directions.routes[0].legs[0].end_location}
                      label={{
                        text: location.client,
                        color: "blue",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        scaledSize: new window.google.maps.Size(50, 50),
                        labelOrigin: new window.google.maps.Point(25, -10) // Adjust label position above the icon
                      }}
                    />
                    <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />
                  </>
                )}
              </GoogleMap>
            </LoadScriptNext>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DirectionsModal);
