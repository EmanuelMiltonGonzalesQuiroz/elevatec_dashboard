import React from 'react';

const AdditionalFields = ({ additionalFields, handleAdditionalFieldChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar que solo se acepten números enteros positivos para el campo Pasajeros
    if (name === 'Pasajeros') {
      if (/^\d+$/.test(value)) { // Solo acepta enteros positivos
        handleAdditionalFieldChange(name, value);
      }
    } 
    // Validar que el valor esté entre 0.8 y 1.5 para el Ancho de puertas
    else if (name === 'Ancho de puertas') {
      if (/^\d*\.?\d*$/.test(value) && value >= 0.8 && value <= 1.5) {
        handleAdditionalFieldChange(name, value);
      }
    } else {
      handleAdditionalFieldChange(name, value); // Para manejar el cambio de Detención Puertas y otros campos
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Campos Adicionales</h2>

      {/* Campo para Pasajeros */}
      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-700">Pasajeros</label>
        <input
          type="number"
          step="1" // Permitir solo enteros
          min="0" // Mínimo 0 para enteros positivos
          name="Pasajeros"
          value={additionalFields['Pasajeros'] || ''} // Mostrar vacío como valor inicial
          placeholder="0" // Mostrar 0 como placeholder inicial
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Campo para Ancho de puertas */}
      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-700">Ancho de puertas</label>
        <input
          type="number"
          step="0.1" // Permitir decimales
          min="0.8" // Validación mínima para Ancho de puertas
          max="1.5" // Validación máxima para Ancho de puertas
          name="Ancho de puertas"
          value={additionalFields['Ancho de puertas'] || ''} // Mostrar vacío como valor inicial
          placeholder="0.8" // Mostrar 0.8 como placeholder inicial
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Campo Detención Puertas como un select con opciones */}
      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-700">Detención Puertas</label>
        <select
          name="Detencion Puertas"
          value={additionalFields['Detencion Puertas'] || ''} // Mostrar vacío como valor inicial
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Seleccionar opción</option> {/* Placeholder para seleccionar */}
          <option value="Abre de un lado">Abre de un lado</option>
          <option value="Abre del centro">Abre del centro</option>
        </select>
      </div>
    </div>
  );
};

export default AdditionalFields;
