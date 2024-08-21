import React, { useState } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { homeText } from '../../../components/common/Text/texts';
import NewClientModal from './NewClientModal';

const ClientColumn = ({ clientName, setClientName, handleReset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
    setClientName(selectedOption ? selectedOption.label : '');
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
              }} // Ajuste para igualar la altura y pegar el botón
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <button className="bg-green-500 text-white py-2 mb-2 w-full rounded hover:bg-green-700 transition">
            {homeText.generateQuotation}
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white py-2 w-full rounded hover:bg-red-700 transition"
          >
            {homeText.resetData}
          </button>
        </div>
      </div>
      {isModalOpen && <NewClientModal onClose={handleCloseModal} />}
    </div>
  );
};

export default ClientColumn;
