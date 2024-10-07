import React from 'react';

const ClientSearch = ({ searchTerm, setSearchTerm, handleOpenModal }) => (
  <div className="flex justify-between items-center mb-6">
    <input
      type="text"
      placeholder="Buscar por CI/NIT o nombre"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="p-2 border rounded w-1/3 focus:outline-none"
    />
    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      onClick={handleOpenModal}
    >
      + Agregar Nuevo Cliente
    </button>
  </div>
);

export default ClientSearch;
