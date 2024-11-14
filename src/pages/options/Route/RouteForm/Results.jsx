// Results.js

import React from 'react';
import SaveButton from './SaveButton';
import { validateFields } from './ResultsValidation';
import { calculateResults } from './ResultsCalculations';

const Results = ({ routeData, setRouteData, allData, resetFields }) => {
  const handleCalculateClick = () => {
    const allMissingFields = validateFields(routeData, allData);

    if (allMissingFields.length > 0) {
      alert(
        `Faltan los siguientes campos o tienen valores no válidos: ${allMissingFields.join(
          ', '
        )}`
      );
    } else {
      setRouteData((prev) => {
        const updatedData = [...prev];
        delete updatedData[0].modifiedResults;
        const calculatedResults = calculateResults(updatedData, allData);
        updatedData[0].result = [calculatedResults];
        return updatedData;
      });
    }
  };

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    if (typeof value === 'string') {
      return value;
    }
    return 'No disponible';
  };

  const labels = {
    Pisos: 'Número de Pisos',
    totalPoblacion: 'Capacidad de Cabina',
    poblacionServida: 'Población Servida',
    Velocidad_Desarrollada: 'Velocidad Desarrollada (m/s)',
    Tiempo_total: 'Tiempo Total de Recorrido (seg)',
    Pasajeros_Atendidos_en_5_min: 'Pasajeros Atendidos en 5 Minutos',
    Cabinas_Nesesarias: 'Cabinas Necesarias',
    Mensaje: 'Calificación de Servicio',
  };

  const handleResultInputChange = (key, inputValue) => {
    setRouteData((prev) => {
      const updatedData = [...prev];
      const updatedValue = parseFloat(inputValue);

      updatedData[0].modifiedResults = {};
      updatedData[0].modifiedResults[key] = isNaN(updatedValue) ? '' : updatedValue;

      const newResults = calculateResults(updatedData, allData);
      updatedData[0].result = [newResults];

      return updatedData;
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 mb-4"
        onClick={handleCalculateClick}
      >
        Calcular
      </button>
      <h2 className="text-xl font-bold mb-4">Resultados</h2>

      {routeData[0]?.result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-lg shadow-md">
          {Object.entries(routeData[0].result[0])
            .filter(([key]) => labels[key])
            .map(([key, value]) => (
              <div key={key}>
                <h3 className="text-lg font-semibold">{labels[key]}:</h3>
                {key === 'Mensaje' ? (
                  <p className="text-blue-900 text-2xl font-bold">
                    {formatValue(value)}
                  </p>
                ) : key === 'Tiempo_total' ||
                  key === 'Pasajeros_Atendidos_en_5_min' ||
                  key === 'Cabinas_Nesesarias' ? (
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={
                      routeData[0].modifiedResults?.[key] ?? formatValue(value)
                    }
                    onChange={(e) =>
                      handleResultInputChange(
                        key,
                        e.target.value.replace(/[^\d.]/g, '')
                      )
                    }
                    step="0.01"
                  />
                ) : (
                  <p className="text-blue-900 text-2xl font-bold">
                    {formatValue(value)}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}

      <SaveButton routeData={routeData} resetFields={resetFields} />
    </div>
  );
};

export default Results;
