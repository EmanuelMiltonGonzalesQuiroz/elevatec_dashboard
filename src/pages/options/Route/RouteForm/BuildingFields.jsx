import React, { useState, useEffect } from 'react';

const buildingTypeMapping = {
  'Oficinas Centricas': { fields: { AREAS: '' }, required: ['AREAS'] },
  'Oficinas Suburbios': { fields: { AREAS: '' }, required: ['AREAS'] },
  'Edificio empresarial': { fields: { AREAS: '' }, required: ['AREAS'] },
  'Edificio del gobierno': { fields: { AREAS: '' }, required: ['AREAS'] },
  'Departamentos Centricos': { fields: { DEPARTAMENTOS: '' }, required: ['DEPARTAMENTOS'] },
  'Departamentos Suburbios': { fields: { DEPARTAMENTOS: '' }, required: ['DEPARTAMENTOS'] },
  'Hospital privado': { fields: { HABITACIONES: '' }, required: ['HABITACIONES'] },
  'Hospital publico': { fields: { HABITACIONES: '' }, required: ['HABITACIONES'] },
  'Hotel centrico': { fields: { HABITACIONES: '' }, required: ['HABITACIONES'] },
  'Hotel vacacional': { fields: { HABITACIONES: '' }, required: ['HABITACIONES'] },
  'Estacionamiento': { fields: { AUTOMOVILES: '' }, required: ['AUTOMOVILES'] },
};

const BuildingFields = ({ handleFieldChange, buildingNames = [], allData }) => {
  const [pisos, setPisos] = useState('');
  const [inputOption, setInputOption] = useState('detailed');
  const [floorTypes, setFloorTypes] = useState({});
  const [dynamicInputs, setDynamicInputs] = useState([]);
  const [squareMeters, setSquareMeters] = useState({});
  const [peoplePerDepartment, setPeoplePerDepartment] = useState({});

  useEffect(() => {
    if (pisos) {
      const newDynamicInputs = Array.from({ length: parseInt(pisos, 10) }, (_, i) => {
        const floorType = floorTypes[i] || 'Departamentos Suburbios';
        const fieldsForType = buildingTypeMapping[floorType]?.fields || { DEPARTAMENTOS: '' };
        return {
          label: `Tipo de edificio para el Piso ${i + 1}`,
          name: `piso_${i + 1}`,
          value: floorType,
          fields: fieldsForType,
        };
      });
      setDynamicInputs(newDynamicInputs);
    } else {
      setDynamicInputs([]);
    }
  }, [pisos, floorTypes]);

  const handlePisosChange = (e) => {
    const value = e.target.value;
    if (/^\d+$/.test(value) && parseInt(value, 10) >= 2) {
      setPisos(value);
      handleFieldChange('PISOS', value);
    } else if (value === '') {
      setPisos('');
      setDynamicInputs([]);
      handleFieldChange('PISOS', '');
    }
  };

  const handleFloorTypeChange = (index, buildingType) => {
    setFloorTypes((prev) => ({ ...prev, [index]: buildingType }));
    const fieldsForType = buildingTypeMapping[buildingType]?.fields || { DEPARTAMENTOS: '' };
    setDynamicInputs((prevInputs) =>
      prevInputs.map((input, i) =>
        i === index ? { ...input, fields: fieldsForType } : input
      )
    );

    // Obtener los datos completos del edificio seleccionado desde `allData`
    const buildingData = allData['configuraciones_de_edificios']?.[0]?.data.find(
      (building) => building.Nombre === buildingType
    );

    // Almacenar datos completos en `routeData`
    handleFieldChange(`piso_${index + 1}_tipoEdificio`, buildingType);
    if (index === 0) {
      handleFieldChange('selectedBuildingType', buildingType);
      handleFieldChange('TipoDeEdificio', { Nombre: buildingType, ...buildingData });
    }
  };

  const handleSimpleBuildingTypeChange = (buildingType) => {
    // Obtener los datos completos del edificio seleccionado en modo "simple"
    const buildingData = allData['configuraciones_de_edificios']?.[0]?.data.find(
      (building) => building.Nombre === buildingType
    );

    // Almacenar todos los datos del edificio seleccionado en `TipoDeEdificio`
    handleFieldChange('TipoDeEdificio', { Nombre: buildingType, ...buildingData });
    handleFieldChange('selectedBuildingType', buildingType);
  };

  const handleFieldCountChange = (index, fieldKey, count) => {
    handleFieldChange(`piso_${index + 1}_${fieldKey}`, count);

    if (count !== '') {
      const peopleInputs = Array.from({ length: count }, (_, i) => ({
        label: `Cantidad de personas en el ${fieldKey} ${i + 1}`,
        name: `piso_${index + 1}_${fieldKey}_${i + 1}_personas`,
        value: '',
      }));
      setPeoplePerDepartment((prev) => ({ ...prev, [index]: peopleInputs }));
      setSquareMeters((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    } else {
      setPeoplePerDepartment((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }
  };

  const handlePeopleCountChange = (index, deptIndex, value) => {
    const updatedPeople = [...(peoplePerDepartment[index] || [])];
    updatedPeople[deptIndex].value = value;
    setPeoplePerDepartment((prev) => ({ ...prev, [index]: updatedPeople }));
    handleFieldChange(`piso_${index + 1}_${updatedPeople[deptIndex].name}`, value);
  };

  const handleSquareMetersChange = (index, value) => {
    setSquareMeters((prev) => ({ ...prev, [index]: value }));
    handleFieldChange(`piso_${index + 1}_m2`, value);

    if (value !== '') {
      setPeoplePerDepartment((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }
  };

  return (
    <div className="lg:w-2/3 w-full p-4 bg-gray-100 rounded-lg shadow-md max-h-[65vh] overflow-auto">
      <h2 className="text-xl font-bold mb-4">Campos del Edificio</h2>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setInputOption('detailed')}
          className={`w-1/2 p-2 border rounded ${inputOption === 'detailed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Agregar pisos y personas
        </button>
        <button
          onClick={() => setInputOption('simple')}
          className={`w-1/2 p-2 border rounded ${inputOption === 'simple' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Población Servida
        </button>
      </div>

      {inputOption === 'detailed' && (
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-gray-700">PISOS</label>
          <input
            type="number"
            min="2"
            name="PISOS"
            value={pisos}
            onChange={handlePisosChange}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {inputOption === 'detailed' &&
        dynamicInputs.map((input, index) => (
          <div key={input.name} className="mb-4">
            <label className="block font-semibold mb-2">{input.label}</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={floorTypes[index] || ''}
              onChange={(e) => handleFloorTypeChange(index, e.target.value)}
            >
              <option value="">-- Seleccionar tipo de edificio --</option>
              {buildingNames.length > 0 &&
                buildingNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
            </select>

            {Object.entries(input.fields).map(([field, _]) => (
              <div key={field} className="mb-2 flex items-center space-x-4">
                <label className="block font-semibold text-gray-700">{field}</label>
                <input
                  type="number"
                  min="0"
                  name={`${input.name}_${field}`}
                  onChange={(e) => handleFieldCountChange(index, field, e.target.value)}
                  className="w-1/2 p-2 border rounded"
                />
                <label className="block font-semibold text-gray-700">Metros cuadrados</label>
                <input
                  type="number"
                  min="0"
                  name={`${input.name}_m2`}
                  onChange={(e) => handleSquareMetersChange(index, e.target.value)}
                  value={squareMeters[index] || ''}
                  className="w-1/2 p-2 border rounded"
                />
              </div>
            ))}

            {peoplePerDepartment[index] &&
              peoplePerDepartment[index].map((dept, deptIndex) => (
                <div key={dept.name} className="mb-2 ml-4">
                  <label className="block font-semibold text-gray-700">{dept.label}</label>
                  <input
                    type="number"
                    min="0"
                    name={dept.name}
                    value={dept.value}
                    onChange={(e) => handlePeopleCountChange(index, deptIndex, e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
          </div>
        ))}
      {inputOption === 'simple' && (
        <>
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-700">Número de Pisos</label>
            <input
              type="number"
              min="2"
              name="PISOS"
              onChange={(e) => handleFieldChange('PISOS', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-700">Población Servida</label>
            <input
              type="number"
              min="0"
              name="Población Servida"
              onChange={(e) => handleFieldChange('Población Servida', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-700">Tipo de Edificio</label>
            <select
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => handleSimpleBuildingTypeChange(e.target.value)}
            >
              <option value="">-- Seleccionar tipo de edificio --</option>
              {buildingNames.length > 0 &&
                buildingNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default BuildingFields;
