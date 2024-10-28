import React from 'react';

const ClientInfo = ({ vendor, setVendor, clientPhone, setClientPhone }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md ">
      <h2 className="text-xl font-bold mb-4">Información del Cliente</h2>
      <div className="grid lg:flex md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <label className="block font-bold mb-2">Nombre del Cliente:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block font-bold mb-2">Número de Teléfono:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, ''))}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;
