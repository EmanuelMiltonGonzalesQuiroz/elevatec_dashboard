import React, { useState, useEffect } from 'react';

const BuildingFields = ({ formFields, handleFieldChange }) => {
  const [inputOption, setInputOption] = useState('detailed'); // 'detailed' or 'simple'
  const [dynamicInputs, setDynamicInputs] = useState([]);
  const [personInputs, setPersonInputs] = useState({});

  // Update dynamic inputs based on formFields.PISOS
  useEffect(() => {
    if (inputOption === 'detailed' && formFields.PISOS) {
      const pisos = parseInt(formFields.PISOS, 10);
      const keys = Object.keys(formFields);
      if (keys.length >= 2) {
        const secondFieldKey = keys[1]; // Second field as base (e.g., DEPARTAMENTOS)
        const newDynamicInputs = [];

        for (let i = 1; i <= pisos; i++) {
          newDynamicInputs.push({
            label: `${secondFieldKey} en el Piso ${i}`,
            name: `${secondFieldKey.toLowerCase()}_${i}`,
            value: formFields[secondFieldKey]?.[i - 1] || '',
            subInputs: [],
          });
        }

        setDynamicInputs(newDynamicInputs);
      } else {
        setDynamicInputs([]);
      }
    } else {
      setDynamicInputs([]);
    }
  }, [inputOption, formFields.PISOS, formFields]);

  // Handle changes in dynamic inputs
  const handleDynamicChange = (index, value) => {
    const keys = Object.keys(formFields);
    if (keys.length >= 2) {
      const secondFieldKey = keys[1];
      const updatedArray = Array.isArray(formFields[secondFieldKey]) ? [...formFields[secondFieldKey]] : [];
      updatedArray[index] = value;

      handleFieldChange(secondFieldKey, updatedArray);

      // Create inputs for the number of people in each unit on the current floor
      const newPersonInputs = { ...personInputs };
      newPersonInputs[`piso_${index + 1}`] = Array.from(
        { length: parseInt(value, 10) || 0 },
        (_, deptIndex) => ({
          label: `Personas en el ${secondFieldKey} ${deptIndex + 1} en el Piso ${index + 1}`,
          name: `${secondFieldKey.toLowerCase()}_${index + 1}_personas_${deptIndex + 1}`,
          value:
            formFields[`${secondFieldKey}_personas`]
              ? formFields[`${secondFieldKey}_personas`][`${index + 1}_${deptIndex + 1}`] || ''
              : '',
        })
      );

      setPersonInputs(newPersonInputs);
    }
  };

  // Handle changes in person inputs
  const handlePersonChange = (piso, deptIndex, value) => {
    const keys = Object.keys(formFields);
    if (keys.length >= 2) {
      const secondFieldKey = keys[1];
      const personDataKey = `${secondFieldKey}_personas`;
      const updatedPersonData = { ...(formFields[personDataKey] || {}) };
      updatedPersonData[`${piso}_${deptIndex + 1}`] = value;

      handleFieldChange(personDataKey, updatedPersonData);
      // Update local state to show the value in the input
      setPersonInputs((prev) => ({
        ...prev,
        [`piso_${piso}`]: prev[`piso_${piso}`].map((input, i) =>
          i === deptIndex ? { ...input, value } : input
        ),
      }));
    }
  };

  // Handle changes in standard inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      handleFieldChange(name, value);
    }
  };

  // Handle option change
  const handleOptionChange = (value) => {
    setInputOption(value);
    // Reset formFields when option changes
    if (value === 'simple') {
      // Reset detailed fields
      handleFieldChange('PISOS', '');
      // Optionally reset other fields
      setPersonInputs({});
    } else {
      // Reset simple field
      handleFieldChange('Población Servida', '');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md min-h-[50vh] max-h-[50vh] overflow-auto">
      <h2 className="text-xl font-bold mb-4">Campos del Edificio</h2>

      {/* Option selection with buttons */}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => handleOptionChange('detailed')}
          className={`w-1/2 p-2 border rounded focus:outline-none ${
            inputOption === 'detailed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Agregar pisos y personas
        </button>
        <button
          onClick={() => handleOptionChange('simple')}
          className={`w-1/2 p-2 border rounded focus:outline-none ${
            inputOption === 'simple' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Población Servida
        </button>
      </div>

      {inputOption === 'detailed' && (
        <>
          {/* First field (PISOS) */}
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-700">PISOS</label>
            <input
              type="number"
              min="2"
              name="PISOS"
              value={formFields.PISOS || ''}
              onChange={handleChange}
              onWheel={(e) => e.target.blur()}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Additional dynamic inputs based on the second field */}
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
                    onWheel={(e) => e.target.blur()}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* Inputs for the number of people in each unit on the current floor */}
                  {personInputs[`piso_${index + 1}`]?.map((subInput, deptIndex) => (
                    <div key={subInput.name} className="mb-2 ml-4">
                      <label className="block font-semibold mb-1 text-gray-700">{subInput.label}</label>
                      <input
                        type="number"
                        min="0"
                        name={subInput.name}
                        value={subInput.value}
                        onChange={(e) => handlePersonChange(index + 1, deptIndex, e.target.value)}
                        onWheel={(e) => e.target.blur()}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {inputOption === 'simple' && (
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-gray-700">Población Servida</label>
          <input
            type="number"
            min="0"
            name="Población Servida"
            value={formFields['Población Servida'] || ''}
            onChange={handleChange}
            onWheel={(e) => e.target.blur()}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default BuildingFields;
