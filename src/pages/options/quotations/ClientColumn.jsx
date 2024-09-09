import React, { useEffect, useState } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { clientColumnText } from '../../../components/common/Text/texts';
import { useUpdateFormData } from '../../../hooks/useUpdateFormData';
import NewClientModal from './NewClientModal';
import MapComponent from './ClientColumn/MapComponent';
import { useClientHandlers } from './ClientColumn/useClientHandlers';

const ClientColumn = ({ formData, setFormData, handleGenerateQuotation, handleReset, onReset }) => {
  const { updateFormData } = useUpdateFormData();
  const { handleClientChange } = useClientHandlers(formData, setFormData, updateFormData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedSolicitante, setSelectedSolicitante] = useState(null);
  const [selectedVendedor, setSelectedVendedor] = useState('');
  const [showMessage, setShowMessage] = useState('');
  const [mapCenter] = useState({ lat: -16.495543, lng: -68.133543 });
  const [markerPosition, setMarkerPosition] = useState(mapCenter);
  const [locationName, setLocationName] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isStateChecked, setIsStateChecked] = useState(false); // Para manejar el checkbox
  const [stateValue, setStateValue] = useState(0); // Para manejar el valor del input del estado

  useEffect(() => {
    if (formData['02_CLIENTE'] && formData['02_CLIENTE'] !== (selectedClient && selectedClient.label)) {
      setSelectedClient({ label: formData['02_CLIENTE'] });
    }
    if (formData['Solicitante'] && formData['Solicitante'] !== (selectedSolicitante && selectedSolicitante.label)) {
      setSelectedSolicitante({ label: formData['Solicitante'] });
    }
  }, [formData, selectedClient, selectedSolicitante]);

  const handleResetAll = () => {
    handleReset();
    setSelectedClient(null);
    setSelectedSolicitante(null);
    setSelectedVendedor('');
    setStateValue(0); // Resetear el valor del estado
    setLocationError('');
    if (onReset) onReset();
  };

  const handleMapClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(location);
    updateFormData({ field: 'Ubicacion', value: location }, formData, setFormData);
    setLocationError('');
  };

  const handleLocationNameChange = (e) => {
    const newName = e.target.value;
    setLocationName(newName);
    updateFormData({ field: 'Ubicacion_nombre', value: newName }, formData, setFormData);
  };

  const handleStateCheckboxChange = (e) => {
    setIsStateChecked(e.target.checked);
  };

  const handleStateValueChange = (e) => {
    const value = Math.max(0, e.target.value);
    setStateValue(value);
    updateFormData({ field: 'Estado', value }, formData, setFormData); // Guardar el valor del estado en formData
  };

  const handleVendedorChange = (e) => {
    const vendedor = e.target.value;
    setSelectedVendedor(vendedor);
    updateFormData({ field: 'Vendedor', value: vendedor }, formData, setFormData); // Guardar el vendedor en formData
  };

  useEffect(() => {
    if (isButtonDisabled) {
      setLocationError('La ubicación seleccionada ya existe, por favor elija otra.');
    } else {
      setLocationError('');
    }
  }, [isButtonDisabled]);

  return (
    <div className="flex flex-col items-center justify-center text-black font-bold h-full overflow-x-auto">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="flex flex-col h-min">
          <label htmlFor="solicitanteName" className="mb-2 font-semibold text-black">
            {clientColumnText.searchSolicitante}
          </label>
          <CustomSelect
            collectionName="login firebase"
            placeholder={clientColumnText.searchSolicitante}
            onChange={(option) => handleClientChange(option, 'Solicitante')}
            selectedValue={selectedSolicitante}
          />

          <label htmlFor="vendedorName" className="mb-2 font-semibold text-black mt-4">
            {clientColumnText.seller}
          </label>
          <input
            type="text"
            placeholder={clientColumnText.seller}
            value={selectedVendedor}
            onChange={handleVendedorChange}
            className="p-3 border-2 border-gray-300 rounded-lg w-full"
          />

          {/* Checkbox y input para el estado debajo del vendedor */}
          <label className="mt-4 text-black font-semibold">
            <input
              type="checkbox"
              checked={isStateChecked}
              onChange={handleStateCheckboxChange}
              className="mr-2"
            />
            Para el estado
          </label>

          {/* Mostrar el input si el checkbox está marcado */}
          {isStateChecked && (
            <input
              type="number"
              min="0"
              value={stateValue}
              onChange={handleStateValueChange}
              className="mt-2 p-3 border-2 border-gray-300 rounded-lg w-full"
              placeholder="Ingrese un valor mayor a 0"
            />
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="clientName" className="mb-2 font-semibold text-black">
            {clientColumnText.searchClient}
          </label>
          <div className="flex items-center">
            <CustomSelect
              collectionName="clients"
              placeholder={clientColumnText.searchClient}
              onChange={(option) => handleClientChange(option, '02_CLIENTE')}
              selectedValue={selectedClient}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-4 rounded hover:bg-green-700 transition"
              style={{ height: '39px', borderRadius: '0 4px 4px 0', marginLeft: '-2px' }}
            >
              +
            </button>
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => handleGenerateQuotation(setShowMessage)}
              className={`py-2 mb-2 w-full rounded transition ${
                isButtonDisabled ? 'bg-gray-500 opacity-50 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'
              } text-white`}
              disabled={isButtonDisabled}
            >
              {clientColumnText.generateQuotation}
            </button>
            <button
              onClick={handleResetAll}
              className="bg-red-500 text-white py-2 w-full rounded hover:bg-red-700 transition"
            >
              {clientColumnText.resetData}
            </button>

            <div className="flex flex-col">
              {locationError ? (
                <div className="mt-2 text-red-500 font-semibold">
                  {locationError}
                </div>
              ) : (
                <>
                  <label htmlFor="locationName" className="mt-2 font-semibold text-black text-lg">
                    Nombre de la ubicación:
                  </label>
                  <input
                    type="text"
                    id="locationName"
                    value={locationName}
                    onChange={handleLocationNameChange}
                    className="mt-1 p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-full">
          <MapComponent
            mapCenter={mapCenter}
            markerPosition={markerPosition}
            handleMapClick={handleMapClick}
            setButtonDisabled={setIsButtonDisabled}
          />
        </div>
      </div>

      {showMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-black p-2 rounded shadow-lg">
          {showMessage}
        </div>
      )}

      {isModalOpen && <NewClientModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ClientColumn;
