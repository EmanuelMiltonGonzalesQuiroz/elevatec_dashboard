import React from 'react';

const ClientInfo = ({
  buildingNames,
  selectedBuilding,
  setSelectedBuilding,
  vendor,
  setVendor,
  clientPhone,
  setClientPhone,
  handleBuildingSelect,
}) => {

  const handleBuildingChange = (e) => {
    const buildingName = e.target.value;
    setSelectedBuilding(buildingName);
    handleBuildingSelect(e);
  };

  const handleVendorChange = (e) => {
    const vendorName = e.target.value;
    setVendor(vendorName);
  };

  const handleClientPhoneChange = (e) => {
    const phone = e.target.value.replace(/\D/g, '');
    setClientPhone(phone);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Información del Cliente</h2>
      <label className="block mb-2 font-bold">Seleccione un tipo edificio:</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedBuilding}
        onChange={handleBuildingChange}
      >
        <option value="">-- Seleccionar --</option>
        {buildingNames.map((name, index) => (
          <option key={index} value={name}>{name}</option>
        ))}
      </select>
      <label className="block mb-2 font-bold">Nombre del Cliente:</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        value={vendor}
        onChange={handleVendorChange}
      />
      <label className="block mb-2 font-bold">Número de Teléfono:</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        value={clientPhone}
        onChange={handleClientPhoneChange}
      />
    </div>
  );
};

export default ClientInfo;
