import React, { useState } from 'react';
import MapComponentM from './MapComponentM'; // Asegúrate de que la ruta sea la correcta

const Location = ({ handleAddItem }) => { // Recibe la función handleAddItem
  const [locationName, setLocationName] = useState('');
  const [markerPosition, setMarkerPosition] = useState({ lat: -16.495543, lng: -68.133543 }); // Posición inicial del marcador

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

    // Llama a handleAddItem para pasar los valores al componente padre
    handleAddItem(locationData);

    // Limpia los campos después de guardar
    setLocationName('');
  };

  return (
    <div className="h-[55vh] bg-gray-200 rounded-lg p-4 overflow-y min-w-80">
      <h2 className="text-lg font-bold text-black">Localización</h2>
      <div className="flex flex-col">
        <label
          htmlFor="locationName"
          className="mt-1 font-semibold text-black text-sm"
        >
          Nombre de Edificio:
        </label>
        <input
          type="text"
          id="locationName"
          value={locationName}
          onChange={handleLocationNameChange}
          className="mt-1 p-2 border-2 border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
        />
      </div>

      {/* Mapa */}
      <div className="h-[30vh] mt-2">
        <MapComponentM
          mapCenter={markerPosition} // Pasamos la posición inicial aquí
          markerPosition={markerPosition}
          handleMapClick={handleMapClick}
        />
      </div>

      {/* Botón para guardar la ubicación */}
      <button
        className="mt-4 bg-blue-500 text-white px-3 py-1 rounded" // Reducido el tamaño del botón
        onClick={saveLocation}
      >
        Guardar Ubicación
      </button>
    </div>
  );
};

export default Location;
