// src/pages/options/quotations/Quotations.jsx

import React, { useState } from 'react';
import { homeText } from '../../../components/common/Text/texts';

const Quotations = () => {
  const [clientName, setClientName] = useState('');

  const handleReset = () => {
    setClientName('');
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full">
      <h1 className="text-xl font-bold mb-4">{homeText.generateQuotation}</h1>
      <div className="grid grid-cols-3 gap-4">
        <ClientInput
          clientName={clientName}
          setClientName={setClientName}
          handleReset={handleReset}
        />
        <FormContent />
      </div>
    </div>
  );
};

const ClientInput = ({ clientName, setClientName, handleReset }) => (
  <div className="flex flex-col">
    <label htmlFor="clientName" className="mb-2 font-semibold">
      {homeText.searchClient}
    </label>
    <input
      type="text"
      id="clientName"
      value={clientName}
      onChange={(e) => setClientName(e.target.value)}
      placeholder={homeText.searchClient}
      className="p-2 border rounded focus:outline-none"
    />
    <button    className="mt-2 bg-green-500 text-white py-2 rounded hover:bg-green-700 transition"
    >
      {homeText.generateQuotation}
    </button>
    <button
      onClick={handleReset}
      className="mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-700 transition"
    >
      {homeText.resetData}
    </button>
  </div>
);

const FormContent = () => (
  <div className="col-span-2">
    <label htmlFor="persons" className="mb-2 font-semibold">
      {homeText.persons}
    </label>
    <select id="persons" className="p-2 border rounded focus:outline-none w-full mb-4">
      <option value="Semplice">Semplice</option>
      <option value="Cochabamba">Cochabamba</option>
      {/* Agrega más opciones según sea necesario */}
    </select>
    {/* Aquí sigue agregando más inputs y selects según el contenido de la imagen */}
  </div>
);

export default Quotations;

