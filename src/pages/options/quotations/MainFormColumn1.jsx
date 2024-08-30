import React, { useState, useEffect } from 'react';
import { mainFormColumn1Text } from '../../../components/common/Text/texts';
import InfoButton from '../../../components/common/InfoButton'; 

const MainFormColumn1 = ({ formData, setFormData, onReset }) => {
  const initialFieldState = (field, defaultValue = 0) => formData?.[field] || defaultValue;

  const [localFields, setLocalFields] = useState({
    persons: initialFieldState('03_PERSONAS'),
    stops: initialFieldState('01_PARADAS'),
    recorrido: initialFieldState('03_RECORRIDO'),
    inoxDoors: initialFieldState('Puertas_en_inoxidable', {}).UNIDADES || 0,
    epoxiDoors: initialFieldState('Puertas_En_Epoxi', {}).UNIDADES || 0,
    vidrioDoors: initialFieldState('Puertas_En_Vidrio', {}).UNIDADES || 0,
    front: initialFieldState('04_Frente'),
    depth: initialFieldState('05_ProfundidadR'),
    pit: initialFieldState('06_Foso'),
    height: initialFieldState('07_Huida'),
    numElevators: initialFieldState('08_Número de ascensores'),
  });

  const initializeFloorAssignments = (stops) => {
    return Array.from({ length: stops }, (_, i) => {
      return i < 2 ? `Piso ${i + 1}` : 'Seleccionar opción';
    });
  };

  const [floorAssignments, setFloorAssignments] = useState(initializeFloorAssignments(localFields.stops));
  const [doorError] = useState('');
  const [floorAssignmentError, setFloorAssignmentError] = useState('');

  const floorOptions = (index) => [
    'Seleccionar opción',
    ...Array.from({ length: localFields.stops }, (_, i) => `Piso ${i + 1}`),
    'Subsuelo',
    'Garaje',
    'Mezanine',
    'Terraza',
    'Planta baja',
    'Otro',
  ];

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      '03_PERSONAS': localFields.persons,
      '01_PARADAS': localFields.stops,
      '03_RECORRIDO': localFields.recorrido,
      Puertas_en_inoxidable: { ...prev.Puertas_en_inoxidable, UNIDADES: localFields.inoxDoors },
      Puertas_En_Epoxi: { ...prev.Puertas_En_Epoxi, UNIDADES: localFields.epoxiDoors },
      Puertas_En_Vidrio: { ...prev.Puertas_En_Vidrio, UNIDADES: localFields.vidrioDoors },
      '09_PISOS A ANTENDER': floorAssignments.join('-'),
      '04_Frente': localFields.front,
      '05_ProfundidadR': localFields.depth,
      '06_Foso': localFields.pit,
      '07_Huida': localFields.height,
      '08_Número de ascensores': localFields.numElevators,
    }));
  }, [localFields, floorAssignments, setFormData]);

  useEffect(() => {
    const uniqueAssignments = new Set(floorAssignments.filter(assignment => assignment !== 'Seleccionar opción'));
    if (uniqueAssignments.size !== floorAssignments.length) {
      setFloorAssignmentError('No puede haber asignaciones duplicadas a la misma parada');
    } else {
      setFloorAssignmentError('');
    }
  }, [floorAssignments]);

  useEffect(() => {
    if (onReset) {
      setLocalFields({
        persons: 0,
        stops: 0,
        recorrido: 0,
        inoxDoors: 0,
        epoxiDoors: 0,
        vidrioDoors: 0,
        front: 0,
        depth: 0,
        pit: 0,
        height: 0,
        numElevators: 0,
      });
      setFloorAssignments(initializeFloorAssignments(0));
    }
  }, [onReset]);

  const handleChange = (field, value) => {
    setLocalFields(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStopsChange = (value) => {
    handleChange('stops', value);
    handleChange('recorrido', value * 3.6);
    setFloorAssignments(initializeFloorAssignments(value));
  };

  const handleFloorAssignmentChange = (index, newValue) => {
    const updatedAssignments = [...floorAssignments];
    updatedAssignments[index] = newValue;
    setFloorAssignments(updatedAssignments);
  };

  const renderInputField = (id, label, value, onChangeHandler, placeholder = '0') => (
    <div>
      <label htmlFor={id} className="block mb-2 font-semibold text-black">
        {label}
      </label>
      <input
        type="number"
        id={id}
        value={value}
        onChange={onChangeHandler}
        className="p-2 border rounded focus:outline-none w-full"
        placeholder={placeholder}
        onWheel={(e) => e.target.blur()}  // Previene el cambio de valor con el scroll del mouse
      />
    </div>
  );

  return (
    <div className="gap-1 text-black overflow-y-auto p-4">
      <div className="mb-4">
        <label htmlFor="persons" className="mb-2 font-semibold text-black">
          <InfoButton title={mainFormColumn1Text.persons} concept={mainFormColumn1Text.personsConcept}/>
        </label>
        <select
          id="persons"
          value={localFields.persons}
          onChange={(e) => handleChange('persons', parseInt(e.target.value, 10) || 0)}
          className="p-2 border rounded focus:outline-none w-full"
        >
          <option value="">{mainFormColumn1Text.selectOption}</option>
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="stops" className="mb-2 font-semibold text-black">
          <InfoButton title={mainFormColumn1Text.stops} concept={mainFormColumn1Text.stopsConcept}/>
        </label>
        <input
          type="number"
          id="stops"
          min="0"
          max="99"
          value={localFields.stops}
          onChange={(e) => handleStopsChange(parseInt(e.target.value, 10) || 0)}
          className="p-2 border rounded focus:outline-none w-full"
          onWheel={(e) => e.target.blur()}  // Previene el cambio de valor con el scroll del mouse
        />
      </div>

      {localFields.stops > 0 && (
        <>
          <div className="border p-4 rounded bg-gray-100 mb-4">
            <div className="mb-4">
              <label htmlFor="recorrido" className="mb-2 font-semibold text-black">
                <InfoButton title={mainFormColumn1Text.recorrido} concept={mainFormColumn1Text.recorridoConcept}/>
              </label>
              <input
                type="number"
                id="recorrido"
                value={localFields.recorrido}
                onChange={(e) => handleChange('recorrido', parseFloat(e.target.value) || 0)}
                className="p-2 border rounded focus:outline-none w/full"
                onWheel={(e) => e.target.blur()}  // Previene el cambio de valor con el scroll del mouse
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 font-semibold text-black">
                <InfoButton title={mainFormColumn1Text.numberDoors} concept={mainFormColumn1Text.numberDoorsConcept}/>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {renderInputField('inox', <InfoButton title={mainFormColumn1Text.inoxDoors} concept={mainFormColumn1Text.inoxDoorsConcept}/>, localFields.inoxDoors, (e) => handleChange('inoxDoors', parseInt(e.target.value, 10) || 0))}
                {renderInputField('epoxi', <InfoButton title={mainFormColumn1Text.epoxiDoors} concept={mainFormColumn1Text.epoxiDoorsConcept}/>, localFields.epoxiDoors, (e) => handleChange('epoxiDoors', parseInt(e.target.value, 10) || 0))}
                {renderInputField('vidrio', <InfoButton title={mainFormColumn1Text.vidrioDoors} concept={mainFormColumn1Text.vidrioDoorsConcept}/>, localFields.vidrioDoors, (e) => handleChange('vidrioDoors', parseInt(e.target.value, 10) || 0))}
              </div>
            </div>

            {doorError && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded">
                {doorError}
              </div>
            )}
          </div>

          <div className="mb-4">
            {floorAssignments.map((assignment, index) => (
              <div key={index} className="mb-2">
                <label className="block text-sm font-bold mb-1">
                  {mainFormColumn1Text.assignStop} {index + 1}
                </label>
                <select
                  className="p-2 border rounded focus:outline-none w/full"
                  value={assignment}
                  onChange={(e) => handleFloorAssignmentChange(index, e.target.value)}
                >
                  {floorOptions(index).map((floor, i) => (
                    <option key={i} value={floor}>
                      {floor}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {floorAssignmentError && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded">
              {floorAssignmentError}
            </div>
          )}
        </>
      )}

      <div className="mb-4">
      <label 
        htmlFor="persons" 
        className="mb-2 font-semibold text-black"
        style={{ fontSize: '1.2rem', margin: '40px 0' }}  // Aumenta el tamaño y agrega margen
      >
        <InfoButton 
          title={mainFormColumn1Text.pozo} 
          concept={mainFormColumn1Text.pozoConcept} 
        />
      </label>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {renderInputField('front', <InfoButton title={mainFormColumn1Text.front} concept={mainFormColumn1Text.frontConcept}/>, localFields.front, (e) => handleChange('front', parseFloat(e.target.value) || 0))}
          {renderInputField('depth', <InfoButton title={mainFormColumn1Text.depth} concept={mainFormColumn1Text.depthConcept}/>, localFields.depth, (e) => handleChange('depth', parseFloat(e.target.value) || 0))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {renderInputField('pit', <InfoButton title={mainFormColumn1Text.pit} concept={mainFormColumn1Text.pitConcept}/>, localFields.pit, (e) => handleChange('pit', parseFloat(e.target.value) || 0))}
          {renderInputField('height', <InfoButton title={mainFormColumn1Text.height} concept={mainFormColumn1Text.heightConcept}/>, localFields.height, (e) => handleChange('height', parseFloat(e.target.value) || 0))}
        </div>

        <div className="mt-4">
          {renderInputField('numElevators', <InfoButton title={mainFormColumn1Text.numElevators} concept={mainFormColumn1Text.numElevatorsConcept}/>, localFields.numElevators, (e) => handleChange('numElevators', parseInt(e.target.value, 10) || 0))}
        </div>
      </div>
    </div>
  );
};

export default MainFormColumn1;
