import React from 'react';

const AdditionalFields = ({ additionalFields, handleAdditionalFieldChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Pasajeros' && /^\d+$/.test(value)) { // Solo acepta enteros positivos
      handleAdditionalFieldChange(name, value);
    } else {
      handleAdditionalFieldChange(name, value); // Para manejar el cambio de Detención Puertas y otros campos
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
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
          onChange={handleChange}
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
    </div>
  );
};

export default AdditionalFields;
