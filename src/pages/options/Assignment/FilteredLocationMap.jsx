import React, { useRef, useEffect } from 'react';
import { GoogleMap, LoadScriptNext, MarkerF } from '@react-google-maps/api';

const FilteredLocationMap = ({ mapLocations, stateColors, mapCenter, clientId }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && mapCenter) {
      mapRef.current.panTo(mapCenter);
    }
  }, [mapCenter]);

  return (
    <div className="w-full h-[40vh]">
      <LoadScriptNext googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={14}
          onLoad={(map) => (mapRef.current = map)}
        >
          {Array.isArray(mapLocations) &&
            mapLocations
              .filter((location) => location.clientId === clientId)
              .map((location) => {
                const color = stateColors[location.state] || '#808080';
                const pinSVG = `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="${color}">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 4.88 7 13 7 13s7-8.12 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                    <circle cx="12" cy="9" r="2.5" fill="#000000"/>
                  </svg>`;

                return location.location && location.location.lat && location.location.lng ? (
                  <MarkerF
                    key={location.id}
                    position={{ lat: location.location.lat, lng: location.location.lng }}
                    icon={{
                      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSVG)}`,
                      labelOrigin: new window.google.maps.Point(15, -10)
                    }}
                    label={{
                      text: location.client,
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      className: 'custom-marker-label'
                    }}
                  />
                ) : null;
              })
          }
        </GoogleMap>
      </LoadScriptNext>
    </div>
  );
};

export default React.memo(FilteredLocationMap);
