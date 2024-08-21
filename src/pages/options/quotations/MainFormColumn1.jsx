import React, { useState, useEffect } from 'react';

const MainFormColumn1 = () => {
  const [stops, setStops] = useState(0);
  const [recorrido, setRecorrido] = useState(3.6); // Valor inicial editable
  const [errorMessage, setErrorMessage] = useState('');
  const [inoxDoors, setInoxDoors] = useState(0);
  const [epoxiDoors, setEpoxiDoors] = useState(0);
  const [vidrioDoors, setVidrioDoors] = useState(0);
  
  const floorOptions = [
    'Subsuelo',
    'Garaje',
    'Mezanine',
    'Terraza',
    'Planta baja',
    ...Array.from({ length: stops }, (_, i) => `Piso ${i + 1}`),
    'Otro'
  ];

  const [floorAssignments, setFloorAssignments] = useState(
    Array(stops).fill('Planta baja')
  );

  useEffect(() => {
    const totalDoors = inoxDoors + epoxiDoors + vidrioDoors;
    if (stops > 0 && totalDoors !== stops) {
      setErrorMessage('La suma de las puertas debe ser igual a las paradas');
    } else {
      setErrorMessage('');
    }
  }, [stops, inoxDoors, epoxiDoors, vidrioDoors]);

  const handleStopsChange = (e) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    setStops(value);
    setRecorrido(value * 3.6); // Recálculo de recorrido con paradas nuevas
    setFloorAssignments(Array(value).fill('Planta baja'));
  };

  const handleRecorridoChange = (e) => {
    setRecorrido(e.target.value === '' ? 0 : parseFloat(e.target.value));
  };

  const handleFloorAssignmentChange = (index, newValue) => {
    const updatedAssignments = [...floorAssignments];
    updatedAssignments[index] = newValue;
    setFloorAssignments(updatedAssignments);
  };

  return (
    <div className=" gap-1 text-black  overflow-y-auto p-4">
      <div className="mb-4">
        <label htmlFor="persons" className="mb-2 font-semibold text-black">
          Personas
        </label>
        <select id="persons" className="p-2 border rounded focus:outline-none w-full">
          {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="stops" className="mb-2 font-semibold text-black">
          Paradas
        </label>
        <input
          type="number"
          id="stops"
          min="0"
          max="99"
          value={stops}
          onChange={handleStopsChange}
          className="p-2 border rounded focus:outline-none w-full"
        />
      </div>

      {stops > 0 && (
        <>
          <div className="border p-4 rounded bg-gray-100 mb-4">
            <div className="mb-4">
              <label htmlFor="recorrido" className="mb-2 font-semibold text-black">
                Recorrido (m)
              </label>
              <input
                type="number"
                id="recorrido"
                value={recorrido}
                onChange={handleRecorridoChange}
                className="p-2 border rounded focus:outline-none w-full"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 font-semibold text-black">
                Número de puertas
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="inox" className="block text-sm font-bold">
                    Inox
                  </label>
                  <input
                    type="number"
                    id="inox"
                    value={inoxDoors}
                    onChange={(e) => setInoxDoors(parseInt(e.target.value, 10) || 0)}
                    min="0"
                    className="p-2 border rounded focus:outline-none w-full"
                  />
                </div>
                <div>
                  <label htmlFor="epoxi" className="block text-sm font-bold">
                    Epoxi
                  </label>
                  <input
                    type="number"
                    id="epoxi"
                    value={epoxiDoors}
                    onChange={(e) => setEpoxiDoors(parseInt(e.target.value, 10) || 0)}
                    min="0"
                    className="p-2 border rounded focus:outline-none w-full"
                  />
                </div>
                <div>
                  <label htmlFor="vidrio" className="block text-sm font-bold">
                    Vidrio
                  </label>
                  <input
                    type="number"
                    id="vidrio"
                    value={vidrioDoors}
                    onChange={(e) => setVidrioDoors(parseInt(e.target.value, 10) || 0)}
                    min="0"
                    className="p-2 border rounded focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="mb-4">
            {floorAssignments.map((assignment, index) => (
              <div key={index} className="mb-2">
                <label className="block text-sm font-bold mb-1">
                  Asignar Parada {index + 1}
                </label>
                <select
                  className="p-2 border rounded focus:outline-none w-full"
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
        </>
      )}

      <div className="mb-4">
        <label htmlFor="floors" className="block mb-2 font-semibold text-black">
          Pisos a atender
        </label>
        <input
          type="text"
          id="floors"
          className="p-2 border rounded focus:outline-none w-full"
          placeholder="Ejem.: PB-1-2-3-4..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="front" className="block mb-2 font-semibold text-black">
            Frente (mm)
          </label>
          <input
            type="number"
            id="front"
            min="0"
            className="p-2 border rounded focus:outline-none w-full"
          />
        </div>
        <div>
          <label htmlFor="depth" className="block mb-2 font-semibold text-black">
            Profundidad (mm)
          </label>
          <input
            type="number"
            id="depth"
            min="0"
            className="p-2 border rounded focus:outline-none w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="pit" className="block mb-2 font-semibold text-black">
            Foso (mm)
          </label>
          <input
            type="number"
            id="pit"
            min="0"
            className="p-2 border rounded focus:outline-none w-full"
          />
        </div>
        <div>
          <label htmlFor="height" className="block mb-2 font-semibold text-black">
            Huida (mm)
          </label>
          <input
            type="number"
            id="height"
            min="0"
            className="p-2 border rounded focus:outline-none w-full"
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="numElevators" className="block mb-2 font-semibold text-black">
          Número de ascensores
        </label>
        <input
          type="number"
          id="numElevators"
          min="1"
          max="99"
          className="p-2 border rounded focus:outline-none w-full"
        />
      </div>
    </div>
  );
};

export default MainFormColumn1;
