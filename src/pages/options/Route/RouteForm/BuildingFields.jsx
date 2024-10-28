import React, { useState, useEffect } from 'react';

const BuildingFields = ({ formFields, handleFieldChange }) => {
  const [inputOption, setInputOption] = useState('detailed');
  const [dynamicInputs, setDynamicInputs] = useState([]);

  useEffect(() => {
    if (inputOption === 'detailed' && formFields.PISOS) {
      const pisos = parseInt(formFields.PISOS, 10);
      const keys = Object.keys(formFields);
      if (keys.length >= 2) {
        const secondFieldKey = keys[1];
        const newDynamicInputs = Array.from({ length: pisos }, (_, i) => ({
          label: `${secondFieldKey} en el Piso ${i + 1}`,
          name: `${secondFieldKey.toLowerCase()}_${i + 1}`,
          value: formFields[secondFieldKey]?.[i] || '',
        }));
        setDynamicInputs(newDynamicInputs);
      } else {
        setDynamicInputs([]);
      }
    } else {
      setDynamicInputs([]);
    }
  }, [inputOption, formFields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      handleFieldChange(name, value);
    }
  };

  const handleOptionChange = (value) => {
    setInputOption(value);
    if (value === 'simple') {
      handleFieldChange('PISOS', '');
    }
  };

  // Agregar una implementación básica para handleDynamicChange
  const handleDynamicChange = (index, value) => {
    const updatedInputs = [...dynamicInputs];
    updatedInputs[index].value = value;
    setDynamicInputs(updatedInputs);

    // Actualizar el valor en formFields
    const secondFieldKey = Object.keys(formFields)[1];
    const updatedArray = Array.isArray(formFields[secondFieldKey]) ? [...formFields[secondFieldKey]] : [];
    updatedArray[index] = value;
    handleFieldChange(secondFieldKey, updatedArray);
  };

  return (
    <div className="lg:w-2/3 w-full  p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Campos del Edificio</h2>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => handleOptionChange('detailed')}
          className={`w-1/2 p-2 border rounded ${
            inputOption === 'detailed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Agregar pisos y personas
        </button>
        <button
          onClick={() => handleOptionChange('simple')}
          className={`w-1/2 p-2 border rounded ${
            inputOption === 'simple' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Población Servida
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2 text-gray-700">PISOS</label>
        <input
          type="number"
          min="2"
          name="PISOS"
          value={formFields.PISOS || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {inputOption === 'detailed' &&
        dynamicInputs.map((input, index) => (
          <div key={input.name} className="mb-4">
            <label className="block font-semibold mb-2">{input.label}</label>
            <input
              type="number"
              min="0"
              name={input.name}
              value={input.value}
              onChange={(e) => handleDynamicChange(index, e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
    </div>
  );
};

export default BuildingFields;
