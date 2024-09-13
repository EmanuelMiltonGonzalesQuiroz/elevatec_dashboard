import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { db } from '../../../connection/firebase'; // Importar Firestore
import { doc, setDoc } from 'firebase/firestore'; // Importar funciones de Firestore
import CustomSelect from '../../../components/UI/CustomSelect';
import MapComponent from '../../../components/UI/MapComponent';

const AddLocationModal = ({ onClose }) => {
  const [description, setDescription] = useState('');
  const [selectedClient, setSelectedClient] = useState(null); // Nuevo estado para el cliente seleccionado
  const [markerPosition, setMarkerPosition] = useState({ lat: -16.495543, lng: -68.133543 }); // Estado para la posición del marcador
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Estado para deshabilitar botón de guardar
  const [distanceWarning, setDistanceWarning] = useState(''); // Estado para mostrar advertencia

  // Función para manejar el clic en el mapa y actualizar la posición del marcador
  const handleMapClick = (clickedLocation) => {
    setMarkerPosition(clickedLocation);
  };

  // Función para guardar la nueva ubicación en Firestore
  const handleSaveLocation = async () => {
    if (!selectedClient || !description) {
      alert('Por favor, selecciona un cliente y agrega una descripción.');
      return;
    }

    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().replace(/[:.]/g, '_'); // Formatear la fecha para crear un ID único
      const locationId = `${selectedClient.label}_${formattedDate}`; // Crear un ID único para la ubicación

      // Guardar la ubicación en Firestore
      await setDoc(doc(db, 'locations', locationId), {
        client: selectedClient.label,
        description: description,
        location: markerPosition,
        state: 'Pendiente', // Estado inicial de la ubicación
        createdAt: currentDate,
      });

      alert('¡Ubicación guardada exitosamente!');
      onClose(); // Cerrar el modal después de guardar
    } catch (error) {
      console.error('Error al guardar la ubicación:', error);
      alert('Hubo un error al guardar la ubicación.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] h-[90%] text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Agregar Ubicación</h2>
          <button className="text-red-500" onClick={onClose}><FaTimes /></button>
        </div>
        <div>
          <label>Seleccionar Cliente</label>
          <CustomSelect
            collectionName="clients"
            onChange={(option) => setSelectedClient(option)} // Manejar la selección del cliente
            selectedValue={selectedClient}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-semibold text-black">Descripción</label>
          <input
            className="p-2 border rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg h-[60%] text-black">
          <MapComponent
            mapCenter={markerPosition}
            markerPosition={markerPosition}
            handleMapClick={handleMapClick} // Pasamos handleMapClick al componente MapComponent
            setButtonDisabled={setIsButtonDisabled}
          />
        </div>
        {distanceWarning && <p className="text-red-500">{distanceWarning}</p>}
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4"
          disabled={isButtonDisabled}
          onClick={handleSaveLocation} // Agregar la funcionalidad de guardar al hacer clic
        >
          Guardar Ubicación
        </button>
      </div>
    </div>
  );
};

export default React.memo(AddLocationModal);
