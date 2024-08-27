import React, { useState, useEffect } from 'react';
import { mainFormColumn1Text } from '../../../components/common/Text/texts';

const MainFormColumn1 = ({ formData, setFormData, onReset }) => {
  const persons = formData?.['03_PERSONAS'] || 0;
  const stops = formData?.['01_PARADAS'] || 0;
  const recorrido = formData?.['03_RECORRIDO'] || 0;
  const inoxDoors = formData?.Puertas_en_inoxidable?.UNIDADES || 0;
  const epoxiDoors = formData?.Puertas_En_Epoxi?.UNIDADES || 0;
  const vidrioDoors = formData?.Puertas_En_Vidrio?.UNIDADES || 0;
  const front = formData?.['04_Frente'] || 0;
  const depth = formData?.['05_ProfundidadR'] || 0;
  const pit = formData?.['06_Foso'] || 0;
  const height = formData?.['07_Huida'] || 0;
  const numElevators = formData?.['08_Número de ascensores'] || 0;

  const [localPersons, setLocalPersons] = useState(persons);
  const [localStops, setLocalStops] = useState(stops);
  const [localRecorrido, setLocalRecorrido] = useState(recorrido);
  const [localInoxDoors, setLocalInoxDoors] = useState(inoxDoors);
  const [localEpoxiDoors, setLocalEpoxiDoors] = useState(epoxiDoors);
  const [localVidrioDoors, setLocalVidrioDoors] = useState(vidrioDoors);
  const [localFront, setLocalFront] = useState(front);
  const [localDepth, setLocalDepth] = useState(depth);
  const [localPit, setLocalPit] = useState(pit);
  const [localHeight, setLocalHeight] = useState(height);
  const [localNumElevators, setLocalNumElevators] = useState(numElevators);
  const [floorAssignments, setFloorAssignments] = useState(Array(localStops).fill(''));
  const [doorError, setDoorError] = useState('');
  const [floorAssignmentError, setFloorAssignmentError] = useState('');

  const floorOptions = [
    'Seleccionar opción',
    'Subsuelo',
    'Garaje',
    'Mezanine',
    'Terraza',
    'Planta baja',
    ...Array.from({ length: localStops }, (_, i) => `Piso ${i + 1}`),
    'Otro',
  ];

  // Actualiza formData cada vez que cambian los valores locales
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      '03_PERSONAS': localPersons,
      '01_PARADAS': localStops,
      '03_RECORRIDO': localRecorrido,
      Puertas_en_inoxidable: { ...prev.Puertas_en_inoxidable, UNIDADES: localInoxDoors },
      Puertas_En_Epoxi: { ...prev.Puertas_En_Epoxi, UNIDADES: localEpoxiDoors },
      Puertas_En_Vidrio: { ...prev.Puertas_En_Vidrio, UNIDADES: localVidrioDoors },
      '09_PISOS A ANTENDER': floorAssignments.join('-'),
      '04_Frente': localFront,
      '05_ProfundidadR': localDepth,
      '06_Foso': localPit,
      '07_Huida': localHeight,
      '08_Número de ascensores': localNumElevators,
    }));
  }, [
    localPersons,
    localStops,
    localRecorrido,
    localInoxDoors,
    localEpoxiDoors,
    localVidrioDoors,
    floorAssignments,
    localFront,
    localDepth,
    localPit,
    localHeight,
    localNumElevators,
    setFormData,
  ]);

  // Validación del número de puertas vs paradas
  useEffect(() => {
    const totalDoors = localInoxDoors + localEpoxiDoors + localVidrioDoors;
    if (localStops > 0 && totalDoors !== localStops) {
      setDoorError(mainFormColumn1Text.doorError);
    } else {
      setDoorError('');
    }
  }, [localStops, localInoxDoors, localEpoxiDoors, localVidrioDoors]);

  // Validación de asignaciones de paradas únicas
  useEffect(() => {
    const uniqueAssignments = new Set(floorAssignments.filter(assignment => assignment !== 'Seleccionar opción'));
    if (uniqueAssignments.size !== floorAssignments.length) {
      setFloorAssignmentError('No puede haber asignaciones duplicadas a la misma parada');
    } else {
      setFloorAssignmentError('');
    }
  }, [floorAssignments]);

  // Maneja el reset
  useEffect(() => {
    if (onReset) {
      setLocalPersons(0);
      setLocalStops(0);
      setLocalRecorrido(0);
      setLocalInoxDoors(0);
      setLocalEpoxiDoors(0);
      setLocalVidrioDoors(0);
      setLocalFront(0);
      setLocalDepth(0);
      setLocalPit(0);
      setLocalHeight(0);
      setLocalNumElevators(0);
      setFloorAssignments([]);
    }
  }, [onReset]);

  // Maneja cambios en los campos
  const handlePersonsChange = (e) => setLocalPersons(parseInt(e.target.value, 10) || 0);
  const handleStopsChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setLocalStops(value);
    setLocalRecorrido(value * 3.6);
    setFloorAssignments(Array(value).fill(''));
  };
  const handleRecorridoChange = (e) => setLocalRecorrido(parseFloat(e.target.value) || 0);
  const handleFrontChange = (e) => setLocalFront(parseFloat(e.target.value) || 0);
  const handleDepthChange = (e) => setLocalDepth(parseFloat(e.target.value) || 0);
  const handlePitChange = (e) => setLocalPit(parseFloat(e.target.value) || 0);
  const handleHeightChange = (e) => setLocalHeight(parseFloat(e.target.value) || 0);
  const handleNumElevatorsChange = (e) => setLocalNumElevators(parseInt(e.target.value, 10) || 0);

  const handleFloorAssignmentChange = (index, newValue) => {
    const updatedAssignments = [...floorAssignments];
    updatedAssignments[index] = newValue;
    setFloorAssignments(updatedAssignments);
  };

  const handleInoxDoorsChange = (e) => setLocalInoxDoors(parseInt(e.target.value, 10) || 0);
  const handleEpoxiDoorsChange = (e) => setLocalEpoxiDoors(parseInt(e.target.value, 10) || 0);
  const handleVidrioDoorsChange = (e) => setLocalVidrioDoors(parseInt(e.target.value, 10) || 0);

  return (
    <div className="gap-1 text-black overflow-y-auto p-4">
      <div className="mb-4">
        <label htmlFor="persons" className="mb-2 font-semibold text-black">
          {mainFormColumn1Text.persons}
        </label>
        <select
          id="persons"
          value={localPersons}
          onChange={handlePersonsChange}
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
          {mainFormColumn1Text.stops}
        </label>
        <input
          type="number"
          id="stops"
          min="0"
          max="99"
          value={localStops}
          onChange={handleStopsChange}
          className="p-2 border rounded focus:outline-none w-full"
        />
      </div>

      {localStops > 0 && (
        <>
          <div className="border p-4 rounded bg-gray-100 mb-4">
            <div className="mb-4">
              <label htmlFor="recorrido" className="mb-2 font-semibold text-black">
                {mainFormColumn1Text.recorrido}
              </label>
              <input
                type="number"
                id="recorrido"
                value={localRecorrido}
                onChange={handleRecorridoChange}
                className="p-2 border rounded focus:outline-none w/full"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 font-semibold text-black">
                {mainFormColumn1Text.numberDoors}
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="inox" className="block text-sm font-bold">
                    {mainFormColumn1Text.inoxDoors}
                  </label>
                  <input
                    type="number"
                    id="inox"
                    value={localInoxDoors}
                    onChange={handleInoxDoorsChange}
                    min="0"
                    className="p-2 border rounded focus:outline-none w/full"
                  />
                </div>
                <div>
                  <label htmlFor="epoxi" className="block text-sm font-bold">
                    {mainFormColumn1Text.epoxiDoors}
                  </label>
                  <input
                    type="number"
                    id="epoxi"
                    value={localEpoxiDoors}
                    onChange={handleEpoxiDoorsChange}
                    min="0"
                    className="p-2 border rounded focus:outline-none w/full"
                  />
                </div>
                <div>
                  <label htmlFor="vidrio" className="block text-sm font-bold">
                    {mainFormColumn1Text.vidrioDoors}
                  </label>
                  <input
                    type="number"
                    id="vidrio"
                    value={localVidrioDoors}
                    onChange={handleVidrioDoorsChange}
                    min="0"
                    className="p-2 border rounded focus:outline-none w/full"
                  />
                </div>
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
                  {floorOptions.map((floor, i) => (
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
        <label htmlFor="front" className="block mb-2 font-semibold text-black">
          {mainFormColumn1Text.front}
        </label>
        <input
          type="number"
          id="front"
          value={localFront}
          onChange={handleFrontChange}
          className="p-2 border rounded focus:outline-none w/full"
          placeholder="0"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 mb-4">
        <div>
          <label htmlFor="depth" className="block mb-2 font-semibold text-black">
            {mainFormColumn1Text.depth}
          </label>
          <input
            type="number"
            id="depth"
            value={localDepth}
            onChange={handleDepthChange}
            className="p-2 border rounded focus:outline-none w/full"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="pit" className="block mb-2 font-semibold text-black">
            {mainFormColumn1Text.pit}
          </label>
          <input
            type="number"
            id="pit"
            value={localPit}
            onChange={handlePitChange}
            className="p-2 border rounded focus:outline-none w/full"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 mb-4">
        <div>
          <label htmlFor="height" className="block mb-2 font-semibold text-black">
            {mainFormColumn1Text.height}
          </label>
          <input
            type="number"
            id="height"
            value={localHeight}
            onChange={handleHeightChange}
            className="p-2 border rounded focus:outline-none w/full"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="numElevators" className="block mb-2 font-semibold text-black">
            {mainFormColumn1Text.numElevators}
          </label>
          <input
            type="number"
            id="numElevators"
            value={localNumElevators}
            onChange={handleNumElevatorsChange}
            min="1"
            max="99"
            className="p-2 border rounded focus:outline-none w/full"
            placeholder="1"
          />
        </div>
      </div>
    </div>
  );
};

export default MainFormColumn1;
