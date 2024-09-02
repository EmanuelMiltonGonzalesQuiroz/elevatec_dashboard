import React, { useEffect, useState } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { homeText } from '../../../components/common/Text/texts';
import { useUpdateFormData } from '../../../hooks/useUpdateFormData';
import NewClientModal from './NewClientModal';

const ClientColumn = ({ formData, setFormData, handleGenerateQuotation, handleReset, onReset }) => {
  const { updateFormData } = useUpdateFormData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showMessage, setShowMessage] = useState('');

  useEffect(() => {
    if (formData['02_CLIENTE'] && formData['02_CLIENTE'] !== (selectedClient && selectedClient.label)) {
      setSelectedClient({ label: formData['02_CLIENTE'] });
    }
  }, [formData, selectedClient]);

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

  const handleResetClient = () => {
    setSelectedClient(null);
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

  return (
    <div className="flex flex-col items-center justify-center text-black font-bold h-full">
      <div className="flex items-center mb-4">
        <div className="flex flex-col mr-4">
          <label htmlFor="clientName" className="mb-2 font-semibold text-black">
            {homeText.searchClient}
          </label>
          <div className="flex items-center">
            <CustomSelect
              collectionName="clients"
              placeholder={homeText.searchClient}
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
            {homeText.generateQuotation}
          </button>
          <button
            onClick={handleResetAll} // Aquí llamamos a la función que manejará el reset para todos los componentes
            className="bg-red-500 text-white py-2 w-full rounded hover:bg-red-700 transition"
          >
            {homeText.resetData}
          </button>
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
