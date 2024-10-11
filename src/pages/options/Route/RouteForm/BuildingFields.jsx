import React from 'react';

const BuildingFields = ({ formFields, handleFieldChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) { // Solo permite números enteros positivos
      handleFieldChange(name, value);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Campos del Edificio</h2>
      {Object.keys(formFields).map((field) => (
        <div key={field} className="mb-4">
          <label className="block font-semibold mb-2 text-gray-700">{field}</label>
          <input
            type="number"
            min="0"
            name={field}
            value={formFields[field]}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  );
};

export default BuildingFields;
