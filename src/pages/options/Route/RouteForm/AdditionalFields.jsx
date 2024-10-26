import React from 'react';

const AdditionalFields = ({ additionalFields, handleAdditionalFieldChange }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      handleAdditionalFieldChange(name, checked); // Actualiza el estado con true/false para el checkbox
    } else if (name === 'Pasajeros' && /^\d+$/.test(value)) {
      handleAdditionalFieldChange(name, value); // Solo acepta enteros positivos para Pasajeros
    } else {
      handleAdditionalFieldChange(name, value); // Maneja el cambio de otros campos
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md min-h-[50vh] max-h-[50vh]">
      <h2 className="text-xl font-bold mb-4">Campos Adicionales</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-700">Pasajeros</label>
        <input
          type="number"
          step="1"
          min="4"
          name="Pasajeros"
          value={additionalFields['Pasajeros'] || ''}
          placeholder="0"
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e);
            }
          }}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-700">Detención Puertas</label>
        <select
          name="Detencion Puertas"
          value={additionalFields['Detencion Puertas'] || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Seleccionar opción</option>
          <option value="Abre de un lado">Abre de un lado</option>
          <option value="Abre del centro">Abre del centro</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-700">Velocidad</label>
        <select
          name="Velocidad"
          value={additionalFields['Velocidad'] || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Seleccionar velocidad</option>
          <option value="1m/s">1m/s</option>
          <option value="1,5m/s">1,5m/s</option>
          <option value="1,75m/s">1,75m/s</option>
          <option value="2m/s">2m/s</option>
        </select>
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          name="Garaje"
          checked={additionalFields['Garaje'] || false}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="font-semibold text-gray-700">Garaje</label>
      </div>
    </div>
  );
};

export default AdditionalFields;
