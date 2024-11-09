import React from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from '@react-google-maps/api';

const LocationMap = ({ mapLocations = [], stateColors = {}, mapCenter = { lat: -16.495543, lng: -68.133543 } }) => (
  <div className="w-full h-[40vh]">
    <LoadScriptNext
      googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
      loadingElement={<div>Loading Map...</div>} // Indicador de carga
      onError={(error) => console.error('Error loading Google Maps script:', error)} // Manejo de errores de carga
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={14}
      >
        {/* Renderizar los marcadores */}
        {Array.isArray(mapLocations) && mapLocations.length > 0 &&
          mapLocations.map((location) => {
            const color = stateColors[location.state] || '#808080'; // Color predeterminado si no se encuentra el estado
            const pinSVG = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="${color}">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 4.88 7 13 7 13s7-8.12 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                <circle cx="12" cy="9" r="2.5" fill="#000000"/>
              </svg>`;

            // Comprobación de `window.google` antes de usar `new window.google.maps.Point`
            const labelOrigin = window.google ? new window.google.maps.Point(15, -10) : undefined;

            return location.location && location.location.lat && location.location.lng ? (
              <MarkerF
                key={location.id}
                position={{ lat: location.location.lat, lng: location.location.lng }}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSVG)}`,
                  labelOrigin: labelOrigin // Ajuste de la posición de la etiqueta
                }}
                label={{
                  text: location.client + " "+location.id || 'Sin nombre', // Texto de la etiqueta
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  className: 'custom-marker-label' // Clase para estilizado adicional
                }}
              />
            ) : null;
          })
        }
      </GoogleMap>
    </LoadScriptNext>
  </div>
);

export default React.memo(LocationMap);
