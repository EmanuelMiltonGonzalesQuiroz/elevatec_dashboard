import React, { useState, useEffect } from 'react';
import { mainFormColumn1Text } from '../../../components/common/Text/texts';
import InfoButton from '../../../components/common/InfoButton';

const MainFormColumn1 = ({ formData, setFormData, onReset }) => {
  const initialStops = formData?.['01_PARADAS'] || 0;

  const initializeFloorAssignments = (stops) => {
    return Array.from({ length: stops }, (_, i) => `Denominar Parada ${i + 1}`);
  };

  const [floorAssignments, setFloorAssignments] = useState(
    formData['09_PISOS A ANTENDER']
      ? formData['09_PISOS A ANTENDER'].split('-')
      : initializeFloorAssignments(initialStops)
  );
  const [floorAssignmentError, setFloorAssignmentError] = useState('');

  const handleChange = (field, value) => {
    setFormData({ [field]: value });
  };

  const handleStopsChange = (value) => {
    handleChange('01_PARADAS', value);
    handleChange('03_RECORRIDO', value * 3.6);
    setFloorAssignments(initializeFloorAssignments(value));
  };

  const handleFloorAssignmentChange = (index, newValue) => {
    const updatedAssignments = [...floorAssignments];
    updatedAssignments[index] = newValue;
    setFloorAssignments(updatedAssignments);
  };

  useEffect(() => {
    const uniqueAssignments = new Set(
      floorAssignments.filter((assignment) => assignment !== 'Seleccionar opción')
    );
    if (uniqueAssignments.size !== floorAssignments.length) {
      setFloorAssignmentError('No puede haber asignaciones duplicadas a la misma parada');
    } else {
      setFloorAssignmentError('');
    }
    // Actualizar '09_PISOS A ANTENDER' en formData
    handleChange('09_PISOS A ANTENDER', floorAssignments.join('-'));
  }, [floorAssignments]);

  useEffect(() => {
    if (onReset) {
      // Reiniciar campos en formData
      setFormData({
        '03_PERSONAS': 0,
        '01_PARADAS': 0,
        '03_RECORRIDO': 0,
        Puertas_en_inoxidable: { UNIDADES: 0 },
        Puertas_En_Epoxi: { UNIDADES: 0 },
        Puertas_En_Vidrio: { UNIDADES: 0 },
        '04_Frente': 0,
        '05_ProfundidadR': 0,
        '06_Foso': 0,
        '07_Huida': 0,
        '08_Número de ascensores': 0,
      });
      setFloorAssignments(initializeFloorAssignments(0));
    }
  }, [onReset]);

  const handleDoorChange = (doorType, units) => {
    setFormData({
      [doorType]: {
        ...formData[doorType],
        UNIDADES: units,
      },
    });
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
        onWheel={(e) => e.target.blur()} // Previene el cambio de valor con el scroll del mouse
      />
    </div>
  );

  return (
    <div className="gap-1 text-black overflow-y-auto p-4">
      <div className="mb-4">
        <label htmlFor="persons" className="mb-2 font-semibold text-black">
          <InfoButton title={mainFormColumn1Text.persons} concept={mainFormColumn1Text.personsConcept} />
        </label>
        <select
          id="persons"
          value={formData['03_PERSONAS'] || ''}
          onChange={(e) => handleChange('03_PERSONAS', parseInt(e.target.value, 10) || 0)}
          className="p-2 border rounded focus:outline-none w-full"
        >
          <option value="">{mainFormColumn1Text.selectOption}</option>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="stops" className="mb-2 font-semibold text-black">
          <InfoButton title={mainFormColumn1Text.stops} concept={mainFormColumn1Text.stopsConcept} />
        </label>
        <input
          type="number"
          id="stops"
          min="0"
          max="99"
          value={formData['01_PARADAS'] || ''}
          onChange={(e) => handleStopsChange(parseInt(e.target.value, 10) || 0)}
          className="p-2 border rounded focus:outline-none w-full"
          onWheel={(e) => e.target.blur()} // Previene el cambio de valor con el scroll del mouse
        />
      </div>

      {formData['01_PARADAS'] > 0 && (
        <>
          <div className="border p-4 rounded bg-gray-100 mb-4">
            <div className="mb-4">
              <label htmlFor="recorrido" className="mb-2 font-semibold text-black">
                <InfoButton
                  title={mainFormColumn1Text.recorrido}
                  concept={mainFormColumn1Text.recorridoConcept}
                />
              </label>
              <input
                type="number"
                id="recorrido"
                value={formData['03_RECORRIDO'] || ''}
                onChange={(e) => handleChange('03_RECORRIDO', parseFloat(e.target.value) || 0)}
                className="p-2 border rounded focus:outline-none w-full"
                onWheel={(e) => e.target.blur()} // Previene el cambio de valor con el scroll del mouse
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 font-semibold text-black">
                <InfoButton
                  title={mainFormColumn1Text.numberDoors}
                  concept={mainFormColumn1Text.numberDoorsConcept}
                />
              </label>
              <div className="grid grid-cols-3 gap-4">
                {renderInputField(
                  'inox',
                  <InfoButton
                    title={mainFormColumn1Text.inoxDoors}
                    concept={mainFormColumn1Text.inoxDoorsConcept}
                  />,
                  formData.Puertas_en_inoxidable?.UNIDADES || 0,
                  (e) =>
                    handleDoorChange(
                      'Puertas_en_inoxidable',
                      parseInt(e.target.value, 10) || 0
                    )
                )}
                {renderInputField(
                  'epoxi',
                  <InfoButton
                    title={mainFormColumn1Text.epoxiDoors}
                    concept={mainFormColumn1Text.epoxiDoorsConcept}
                  />,
                  formData.Puertas_En_Epoxi?.UNIDADES || 0,
                  (e) =>
                    handleDoorChange('Puertas_En_Epoxi', parseInt(e.target.value, 10) || 0)
                )}
                {renderInputField(
                  'vidrio',
                  <InfoButton
                    title={mainFormColumn1Text.vidrioDoors}
                    concept={mainFormColumn1Text.vidrioDoorsConcept}
                  />,
                  formData.Puertas_En_Vidrio?.UNIDADES || 0,
                  (e) =>
                    handleDoorChange('Puertas_En_Vidrio', parseInt(e.target.value, 10) || 0)
                )}
              </div>
            </div>
          </div>
 
          <div className="mb-4">
            {floorAssignments.map((assignment, index) => (
              <div key={index} className="mb-2">
                <label className="block text-sm font-bold mb-1">
                  {mainFormColumn1Text.assignStop} {index + 1}
                </label>
                <input
                  type="text"
                  className="p-2 border rounded focus:outline-none w-full"
                  value={assignment}
                  onChange={(e) => handleFloorAssignmentChange(index, e.target.value)}
                />
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
          style={{ fontSize: '1.2rem', margin: '40px 0' }} // Aumenta el tamaño y agrega margen
        >
          <InfoButton title={mainFormColumn1Text.pozo} concept={mainFormColumn1Text.pozoConcept} />
        </label>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {renderInputField(
            'front',
            <InfoButton title={mainFormColumn1Text.front} concept={mainFormColumn1Text.frontConcept} />,
            formData['04_Frente'] || 0,
            (e) => handleChange('04_Frente', parseFloat(e.target.value) || 0)
          )}
          {renderInputField(
            'depth',
            <InfoButton title={mainFormColumn1Text.depth} concept={mainFormColumn1Text.depthConcept} />,
            formData['05_ProfundidadR'] || 0,
            (e) => handleChange('05_ProfundidadR', parseFloat(e.target.value) || 0)
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {renderInputField(
            'pit',
            <InfoButton title={mainFormColumn1Text.pit} concept={mainFormColumn1Text.pitConcept} />,
            formData['06_Foso'] || 0,
            (e) => handleChange('06_Foso', parseFloat(e.target.value) || 0)
          )}
          {renderInputField(
            'height',
            <InfoButton title={mainFormColumn1Text.height} concept={mainFormColumn1Text.heightConcept} />,
            formData['07_Huida'] || 0,
            (e) => handleChange('07_Huida', parseFloat(e.target.value) || 0)
          )}
        </div>

        <div className="mt-4">
          {renderInputField(
            'numElevators',
            <InfoButton
              title={mainFormColumn1Text.numElevators}
              concept={mainFormColumn1Text.numElevatorsConcept}
            />,
            formData['08_Número de ascensores'] || 0,
            (e) => handleChange('08_Número de ascensores', parseInt(e.target.value, 10) || 0)
          )}
        </div>
      </div>
    </div>
  );
};

export default MainFormColumn1;
