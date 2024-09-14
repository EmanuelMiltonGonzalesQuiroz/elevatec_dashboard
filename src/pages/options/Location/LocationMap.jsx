import React from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from '@react-google-maps/api';

const LocationMap = ({ mapLocations, stateColors, mapCenter }) => (
  <div className="w-full h-[40vh]">
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter} // El mapa se centrará en la ubicación seleccionada
        zoom={14}
      >
        {/* Renderizar los marcadores con los colores basados en el estado */}
        {Array.isArray(mapLocations) &&
          mapLocations.map((location) =>
            location.location && location.location.lat && location.location.lng ? (
              <MarkerF
                key={location.id}
                position={{ lat: location.location.lat, lng: location.location.lng }}
                icon={{
                  url: `http://maps.google.com/mapfiles/ms/icons/${stateColors[location.state] || 'gray'}-dot.png`,
                  labelOrigin: new window.google.maps.Point(0, -20) // Ajuste de posición del label
                }}
                label={{
                  text: location.client,
                  color: 'black', // Cambia el color del texto del label
                  fontWeight: 'bold',
                  fontSize: '14px',
                  className: 'custom-marker-label' // Clase personalizada si quieres más estilo desde CSS
                }}
              />
            ) : null
          )
        }
      </GoogleMap>
    </LoadScriptNext>
  </div>
);

export default React.memo(LocationMap);
