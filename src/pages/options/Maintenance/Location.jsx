import React, { useState } from 'react';
import MapComponentM from './MapComponentM'; // Asegúrate de que la ruta sea la correcta

const Location = () => {
  const [locationError] = useState('');
  const [locationName, setLocationName] = useState('');
  const [markerPosition, setMarkerPosition] = useState({ lat: -16.495543, lng: -68.133543 }); // Posición inicial del marcador
  const [savedLocation, setSavedLocation] = useState(null); // Estado para almacenar la ubicación seleccionada

  // Función para manejar cambios en el nombre de la ubicación
  const handleLocationNameChange = (e) => {
    setLocationName(e.target.value);
  };

  // Función para manejar clics en el mapa y actualizar la ubicación del marcador
  const handleMapClick = (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPosition); // Actualizar la posición del marcador
    console.log('Nueva ubicación seleccionada:', newPosition);
  };

  // Función para guardar la ubicación
  const saveLocation = () => {
    if (!locationName || !markerPosition) {
      alert("Por favor, ingresa el nombre de la ubicación y selecciona una posición en el mapa.");
      return;
    }

    const locationData = {
      name: locationName,
      position: markerPosition,
    };

    setSavedLocation(locationData); // Guardamos la ubicación en el estado
    console.log('Ubicación guardada:', locationData);
    // Aquí puedes enviar los datos a una API, Firebase, o manejarlo como necesites
  };

  return (
    <div className="h-[28vh] bg-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-bold text-black">Localización</h2>
      <div className="flex flex-col">
        {locationError ? (
          <div className="mt-1 text-red-500 font-semibold">{locationError}</div>
        ) : (
          <>
            <label
              htmlFor="locationName"
              className="mt-1 font-semibold text-black text-sm"
            >
              Nombre de la ubicación:
            </label>
            <input
              type="text"
              id="locationName"
              value={locationName}
              onChange={handleLocationNameChange}
              className="mt-1 p-2 border-2 border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </>
        )}
      </div>

      {/* Mapa */}
      <div className="h-[10vh] mt-2">
        <MapComponentM
          mapCenter={markerPosition} // Pasamos la posición inicial aquí
          markerPosition={markerPosition}
          handleMapClick={handleMapClick}
        />
      </div>

      {/* Botón para guardar la ubicación */}
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={saveLocation}
      >
        Guardar Ubicación
      </button>

      {/* Mostrar la ubicación guardada */}
      {savedLocation && (
        <div className="mt-4">
          <p className="font-semibold">Ubicación Guardada:</p>
          <p>Nombre: {savedLocation.name}</p>
          <p>Latitud: {savedLocation.position.lat}</p>
          <p>Longitud: {savedLocation.position.lng}</p>
        </div>
      )}
    </div>
  );
};

export default Location;
