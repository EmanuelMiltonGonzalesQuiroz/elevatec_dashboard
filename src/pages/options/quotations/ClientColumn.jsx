// src/pages/options/quotations/ClientColumn.jsx
import React, { useState } from 'react';
import { homeText } from '../../../components/common/Text/texts';
import NewClientModal from './NewClientModal';

const ClientColumn = ({ clientName, setClientName, handleReset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="col-span-1 flex flex-col text-black font-bold">
      <label htmlFor="clientName" className="mb-2 font-semibold text-black">
        {homeText.searchClient}
      </label>
      <div className="flex">
        <input
          type="text"
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder={homeText.searchClient}
          className="p-2 border rounded-l focus:outline-none flex-grow"
        />
        <button
          onClick={handleOpenModal}
          className="bg-green-500 text-white px-4 rounded-r hover:bg-green-700 transition"
        >
          +
        </button>
      </div>
      <button className="mt-2 bg-green-500 text-white py-2 rounded hover:bg-green-700 transition">
        {homeText.generateQuotation}
      </button>
      <button
        onClick={handleReset}
        className="mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-700 transition"
      >
        {homeText.resetData}
      </button>
      {isModalOpen && <NewClientModal onClose={handleCloseModal} />}
    </div>
  );
};

export default ClientColumn;
