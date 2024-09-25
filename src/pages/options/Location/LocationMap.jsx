import React from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from '@react-google-maps/api';

const LocationMap = ({ mapLocations, stateColors, mapCenter }) => (
  <div className="w-full h-[40vh]">
    <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={14}
      >
        {/* Render markers with dynamic colors and enhanced label styling */}
        {Array.isArray(mapLocations) &&
          mapLocations.map((location) => {
            const color = stateColors[location.state] || '#808080'; // Default to gray if no color
            const pinSVG = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="${color}">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 4.88 7 13 7 13s7-8.12 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                <circle cx="12" cy="9" r="2.5" fill="#F9A603"/> <!-- Orange circle for glyph -->
              </svg>`;

            return location.location && location.location.lat && location.location.lng ? (
              <MarkerF
                key={location.id}
                position={{ lat: location.location.lat, lng: location.location.lng }}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSVG)}`, // Custom SVG icon with dynamic color
                  labelOrigin: new window.google.maps.Point(0, -30) // Adjust label position
                }}
                label={{
                  text: location.client,
                  color: 'black', // Text color for the label
                  fontWeight: 'bold', // Make the text bold
                  fontSize: '16px', // Increase font size for better visibility
                  className: 'custom-marker-label' // Custom Tailwind classes for additional styling
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
