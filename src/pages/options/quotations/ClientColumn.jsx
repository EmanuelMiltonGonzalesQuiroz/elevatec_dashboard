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
  const [selectedVendedor, setSelectedVendedor] = useState(null);
  const [showMessage, setShowMessage] = useState('');
  const [mapCenter] = useState({ lat: -16.495543, lng: -68.133543 }); // Centro inicial en La Paz, Bolivia
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const [locationName, setLocationName] = useState(''); // Agregado para manejar el nombre de la ubicación

  useEffect(() => {
    if (formData['02_CLIENTE'] && formData['02_CLIENTE'] !== (selectedClient && selectedClient.label)) {
      setSelectedClient({ label: formData['02_CLIENTE'] });
    }
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

  const handleVendedorChange = (selectedOption) => {
    if (selectedOption && selectedOption.label !== formData['Vendedor']) {
      setSelectedVendedor(selectedOption);
      updateFormData({ field: 'Vendedor', value: selectedOption.label }, formData, setFormData);
    }
  };

  const handleResetClient = () => {
    setSelectedClient(null);
    setSelectedSolicitante(null);
    setSelectedVendedor(null);
  };

  const handleResetAll = () => {
    handleReset();
    handleResetClient();
    if (onReset) {
      onReset(); // Enviar señal a MainFormColumn1
    }
  };

  const handleShowMessage = (message) => {
    setShowMessage(message);
    setTimeout(() => {
      setShowMessage('');
    }, 3000);
  };

  const handleMapClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(location); // Mueve el marcador a la nueva ubicación
    updateFormData({ field: 'Ubicacion', value: location }, formData, setFormData); // Actualiza formData con la nueva ubicación
  };

  const handleLocationNameChange = (e) => {
    const newName = e.target.value;
    setLocationName(newName);
    updateFormData({ field: 'Ubicacion_nombre', value: newName }, formData, setFormData);
  };

  return (
    <div className="flex flex-col items-center justify-center text-black font-bold h-full">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="flex flex-col h-min">
          <label htmlFor="solicitanteName" className="mb-2 font-semibold text-black">
            {clientColumnText.searchSolicitante}
          </label>
          <CustomSelect
            collectionName="login firebase"
            placeholder={clientColumnText.searchSolicitante}
            onChange={handleSolicitanteChange}
            selectedValue={selectedSolicitante}
          />

          <label htmlFor="vendedorName" className="mb-2 font-semibold text-black">
            {clientColumnText.seller}
          </label>
          <CustomSelect
            collectionName="sellers"
            placeholder={clientColumnText.seller}
            onChange={handleVendedorChange}
            selectedValue={selectedVendedor}
          />
        </div>

        <div className="flex flex-col">
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

        <div className="w-full h-64"> 
          <LoadScript googleMapsApiKey="AIzaSyBDA9rFE18AAkAMtQUO0Un2Ai1kNXslUPQ">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '80%' }}
              center={mapCenter}
              zoom={10}
              onClick={handleMapClick}
            >
              <MarkerF position={markerPosition} />
            </GoogleMap>
          </LoadScript>
          <label htmlFor="locationName" className="mt-2 font-semibold text-black">Nombre de la ubicación:</label>
          <input
            type="text"
            id="locationName"
            value={locationName}
            onChange={handleLocationNameChange}
            className="mt-1 p-1 border rounded w-full"
          />
        </div>
      </div>

      {showMessage && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-black p-2 rounded shadow-lg">
          {showMessage}
        </div>
      )}

      {isModalOpen && <NewClientModal onClose={handleCloseModal} />}
    </div>
  );
};

export default ClientColumn;
