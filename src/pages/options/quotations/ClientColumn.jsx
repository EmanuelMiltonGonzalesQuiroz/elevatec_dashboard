import React, { useEffect, useState } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { clientColumnText } from '../../../components/common/Text/texts';
import { useUpdateFormData } from '../../../hooks/useUpdateFormData';
import NewClientModal from './NewClientModal';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const ClientColumn = ({ formData, setFormData, handleGenerateQuotation, handleReset, onReset }) => {
  const { updateFormData } = useUpdateFormData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedSolicitante, setSelectedSolicitante] = useState(null);
  const [showMessage, setShowMessage] = useState('');
  const [mapCenter] = useState({ lat: -16.495543, lng: -68.133543 }); // Centro inicial en La Paz, Bolivia
  const [markerPosition, setMarkerPosition] = useState(mapCenter);

  useEffect(() => {
    // Actualiza el cliente seleccionado en el estado si cambia en formData
    if (formData['02_CLIENTE'] && formData['02_CLIENTE'] !== (selectedClient && selectedClient.label)) {
      setSelectedClient({ label: formData['02_CLIENTE'] });
    }
    // Actualiza el solicitante seleccionado en el estado si cambia en formData
    if (formData['Solicitante'] && formData['Solicitante'] !== (selectedSolicitante && selectedSolicitante.label)) {
      setSelectedSolicitante({ label: formData['Solicitante'] });
    }
  }, [formData, selectedClient, selectedSolicitante]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClientChange = (selectedOption) => {
    if (selectedOption && selectedOption.label !== formData['02_CLIENTE']) {
      setSelectedClient(selectedOption);
      updateFormData({ field: '02_CLIENTE', value: selectedOption.label }, formData, setFormData);
    }
  };

  const handleSolicitanteChange = (selectedOption) => {
    if (selectedOption && selectedOption.label !== formData['Solicitante']) {
      setSelectedSolicitante(selectedOption);
      updateFormData({ field: 'Solicitante', value: selectedOption.label }, formData, setFormData);
    }
  };

  const handleResetClient = () => {
    setSelectedClient(null);
    setSelectedSolicitante(null);
  };

  const handleResetAll = () => {
    handleReset();
    handleResetClient();
    if (onReset) {
      onReset();  // Enviar señal a MainFormColumn1
    }
  };

  const handleShowMessage = (message) => {
    setShowMessage(message);
    setTimeout(() => {
      setShowMessage('');
    }, 3000);
  };

  // Maneja el clic en el mapa para seleccionar una ubicación
  const handleMapClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(location); // Mueve el marcador a la nueva ubicación
    updateFormData({ field: 'Ubicacion', value: location }, formData, setFormData); // Actualiza formData con la nueva ubicación
  };

  return (
    <div className="flex flex-col items-center justify-center text-black font-bold h-full">
      <div className="flex items-center mb-4">
      <div className="flex flex-col mr-8 max-w-lg">
        <label htmlFor="solicitanteName" className="mb-2 font-semibold text-black">
          {clientColumnText.searchSolicitante}
        </label>
        <div className="flex items-center">
          <CustomSelect
            collectionName="login firebase"
            placeholder={clientColumnText.searchSolicitante}
            onChange={handleSolicitanteChange}
            selectedValue={selectedSolicitante}
          />
        </div>
      </div>

        <div className="flex flex-col mr-4">
          <label htmlFor="clientName" className="mb-2 font-semibold text-black">
            {clientColumnText.searchClient}
          </label>
          <div className="flex items-center">
            <CustomSelect
              collectionName="clients"
              placeholder={clientColumnText.searchClient}
              onChange={handleClientChange}
              selectedValue={selectedClient}
            />
            <button
              onClick={handleOpenModal}
              className="bg-green-500 text-white px-4 rounded hover:bg-green-700 transition"
              style={{
                height: '39px',
                borderRadius: '0 4px 4px 0',
                marginLeft: '-2px',
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <button
            onClick={() => handleGenerateQuotation(handleShowMessage)}
            className="bg-green-500 text-white py-2 mb-2 w-full rounded hover:bg-green-700 transition"
          >
            {clientColumnText.generateQuotation}
          </button>
          <button
            onClick={handleResetAll}
            className="bg-red-500 text-white py-2 w-full rounded hover:bg-red-700 transition"
          >
            {clientColumnText.resetData}
          </button>
        </div>
      </div>

      {/* Mensaje de notificación */}
      {showMessage && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-black p-2 rounded shadow-lg">
          {showMessage}
        </div>
      )}

      {/* Modal de nuevo cliente */}
      {isModalOpen && <NewClientModal onClose={handleCloseModal} />}

      {/* Mapa de Google para seleccionar ubicación */}
      <div className="w-full h-64 mt-4">
        <LoadScript googleMapsApiKey="AIzaSyBDA9rFE18AAkAMtQUO0Un2Ai1kNXslUPQ">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={10}
            onClick={handleMapClick} // Maneja el clic en el mapa
          >
            <MarkerF position={markerPosition} /> {/* Muestra el marcador en la ubicación seleccionada */}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default ClientColumn;
