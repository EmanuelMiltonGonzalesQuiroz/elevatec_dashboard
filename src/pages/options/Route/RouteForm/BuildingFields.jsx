import React, { useState, useEffect } from 'react';

const BuildingFields = ({ formFields, handleFieldChange }) => {
  const [dynamicInputs, setDynamicInputs] = useState([]);

  // Actualizar la lista de inputs adicionales según el valor de PISOS
  useEffect(() => {
    if (formFields.PISOS) {
      const pisos = parseInt(formFields.PISOS, 10);
      const newDynamicInputs = [];
      const secondFieldKey = Object.keys(formFields)[1]; // Segundo campo como base

      for (let i = 1; i <= pisos; i++) {
        newDynamicInputs.push({
          label: `${secondFieldKey} en el Piso ${i}`,
          name: `${secondFieldKey.toLowerCase()}_${i}`,
          value: (formFields[secondFieldKey] && formFields[secondFieldKey][i - 1]) || '',
        });
      }

      setDynamicInputs(newDynamicInputs);
    } else {
      setDynamicInputs([]);
    }
  }, [formFields.PISOS, formFields]);

  // Manejar cambios en los inputs dinámicos y guardar como array bajo el segundo campo
  const handleDynamicChange = (index, value) => {
    const secondFieldKey = Object.keys(formFields)[1];
    const updatedArray = Array.isArray(formFields[secondFieldKey]) ? [...formFields[secondFieldKey]] : [];
    updatedArray[index] = value;

    handleFieldChange(secondFieldKey, updatedArray); // Guardar el array completo bajo el segundo campo
  };

  // Manejar cambios en los inputs normales
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      handleFieldChange(name, value);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md min-h-[50vh] max-h-[50vh] overflow-auto">
      <h2 className="text-xl font-bold mb-4">Campos del Edificio</h2>

      {/* Primer campo (PISOS) */}
      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-700">PISOS</label>
        <input
          type="number"
          min="2"
          name="PISOS"
          value={formFields.PISOS || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Inputs adicionales generados en base al segundo campo */}
      {dynamicInputs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">{dynamicInputs[0].label.split(' ')[0]} por Piso</h3>
          {dynamicInputs.map((input, index) => (
            <div key={input.name} className="mb-4">
              <label className="block font-semibold mb-2 text-gray-700">{input.label}</label>
              <input
                type="number"
                min="0"
                name={input.name}
                value={input.value}
                onChange={(e) => handleDynamicChange(index, e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tercer campo */}
      {Object.keys(formFields).length > 2 && (
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-gray-700">
            {Object.keys(formFields)[2]}
          </label>
          <input
            type="number"
            min="0"
            name={Object.keys(formFields)[2]}
            value={formFields[Object.keys(formFields)[2]] || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default BuildingFields;
