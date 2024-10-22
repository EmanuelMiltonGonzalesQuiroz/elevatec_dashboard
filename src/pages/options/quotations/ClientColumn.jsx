import React, { useState } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { clientColumnText } from '../../../components/common/Text/texts';
import NewClientModal from './NewClientModal';
import MapComponent from './ClientColumn/MapComponent';
import logo from '../../../assets/images/COTA LOGO/elevatec_logo_sin_fondo.png';

const ClientColumn = ({
  formData,
  setFormData,
  handleGenerateQuotation,
  handleReset,
  handleClientChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Function to update formData
  const updateFormData = (field, value) => {
    setFormData({ [field]: value });
  };

  // Shared field handlers
  const handleVendedorChange = (e) => {
    const vendedor = e.target.value;
    handleClientChange('Vendedor', vendedor); // Update shared field across all quotations
  };

  const handleClientSelect = (option) => {
    handleClientChange('02_CLIENTE', option.label); // Update shared field across all quotations
  };

  // Independent field handlers
  const handlePaymentMethodChange = (method) => {
    let updatedMethods = formData['MetodoDePago'] ? formData['MetodoDePago'].split('_') : [];
    if (updatedMethods.includes(method)) {
      updatedMethods = updatedMethods.filter((m) => m !== method);
    } else {
      updatedMethods.push(method);
    }
    updateFormData('MetodoDePago', updatedMethods.join('_'));
  };

  const handleStateCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    updateFormData('Para_el_Estado', isChecked ? 'Sí' : 'No');
  };

  const handleStateValueChange = (e) => {
    const value = Math.max(0, e.target.value);
    updateFormData('Estado', value);
  };

  const handleInterpisosCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    updateFormData('Interpisos', isChecked ? 'Sí' : 'No');
  };

  const handleMapClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    updateFormData('Ubicacion', location);
    setLocationError('');
  };

  const handleLocationNameChange = (e) => {
    const newName = e.target.value;
    updateFormData('Ubicacion_nombre', newName);
  };

  const handleResetAll = () => {
    handleReset();
    setLocationError('');
    setIsButtonDisabled(false);
  };

  return (
    <div className="flex flex-col ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow overflow-auto max">
        {/* Left Column */}
        <div className="flex flex-col">
          <img src={logo} alt="Logo" className="w-full" />

          {/* Vendedor (Seller) - Shared Field */}
          <label htmlFor="vendedorName" className="mb-2 font-semibold text-black mt-4">
            {clientColumnText.seller}
          </label>
          <input
            type="text"
            placeholder={clientColumnText.seller}
            value={formData['Vendedor'] || ''}
            onChange={handleVendedorChange}
            className="p-3 border-2 border-gray-300 rounded-lg w-full"
          />

          {/* Payment Method - Independent Field */}
          <label htmlFor="paymentMethod" className="mt-4 font-semibold text-black">
            Método de Pago
          </label>
          <div className="flex flex-col">
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    formData['MetodoDePago'] ? formData['MetodoDePago'].includes('Efectivo') : false
                  }
                  onChange={() => handlePaymentMethodChange('Efectivo')}
                  className="mr-2"
                />
                Efectivo
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    formData['MetodoDePago'] ? formData['MetodoDePago'].includes('Deposito') : false
                  }
                  onChange={() => handlePaymentMethodChange('Deposito')}
                  className="mr-2"
                />
                Depósito
              </label>
            </div>
          </div>

          {/* Currency Type - Independent Field */}
          <label htmlFor="paymentMethod" className="mt-4 font-semibold text-black">
            Tipo de Cambio
          </label>
          <div className="flex flex-col">
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    formData['MetodoDePago'] ? formData['MetodoDePago'].includes('Dolar') : false
                  }
                  onChange={() => handlePaymentMethodChange('Dolar')}
                  className="mr-2"
                />
                Dólar
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    formData['MetodoDePago'] ? formData['MetodoDePago'].includes('Bolivianos') : false
                  }
                  onChange={() => handlePaymentMethodChange('Bolivianos')}
                  className="mr-2"
                />
                Bolivianos
              </label>
            </div>
          </div>

          {/* State Checkbox - Independent Field */}
          <label className="mt-4 text-black font-semibold">
            <input
              type="checkbox"
              checked={formData['Para_el_Estado'] === 'Sí'}
              onChange={handleStateCheckboxChange}
              className="mr-2"
            />
            Etiquetar únicamente si la cotización es para una identidad estatal
          </label>

          {formData['Para_el_Estado'] === 'Sí' && (
            <input
              type="number"
              min="0"
              value={formData['Estado'] || ''}
              onChange={handleStateValueChange}
              className="mt-2 p-3 border-2 border-gray-300 rounded-lg w-full"
              placeholder="Ingrese un valor mayor a 0"
            />
          )}

          {/* Interpisos Checkbox - Independent Field */}
          <label className="mt-4 text-black font-semibold">
            <input
              type="checkbox"
              checked={formData['Interpisos'] === 'Sí'}
              onChange={handleInterpisosCheckboxChange}
              className="mr-2"
            />
            Controlador de pisos
          </label>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col">
          {/* Cliente (Client) - Shared Field */}
          <label htmlFor="clientName" className="mb-2 font-semibold text-black">
            {clientColumnText.searchClient}
          </label>
          <div className="flex items-center">
            <CustomSelect
              collectionName="clients"
              placeholder={clientColumnText.searchClient}
              onChange={handleClientSelect}
              selectedValue={{ label: formData['02_CLIENTE'] || '' }}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-4 rounded hover:bg-green-700 transition"
              style={{ height: '39px', borderRadius: '0 4px 4px 0', marginLeft: '-2px' }}
            >
              +
            </button>
          </div>

          {/* Generate Quotation and Reset Buttons */}
          <div className="flex flex-col mt-4">
            <button
              onClick={() => handleGenerateQuotation()}
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

            {/* Location Name - Independent Field */}
            <div className="flex flex-col mt-4">
              {locationError ? (
                <div className="mt-2 text-red-500 font-semibold">{locationError}</div>
              ) : (
                <>
                  <label htmlFor="locationName" className="mt-2 font-semibold text-black text-lg">
                    Nombre de la ubicación:
                  </label>
                  <input
                    type="text"
                    id="locationName"
                    value={formData['Ubicacion_nombre'] || ''}
                    onChange={handleLocationNameChange}
                    className="mt-1 p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full h-[60vh]">
          <MapComponent
            mapCenter={formData['Ubicacion'] || { lat: -16.495543, lng: -68.133543 }}
            markerPosition={formData['Ubicacion'] || { lat: -16.495543, lng: -68.133543 }}
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

export default React.memo(ClientColumn);
