import React from 'react';
import SaveButton from './SaveButton';
import { validateFields } from './ResultsValidation';
import { calculateResults } from './ResultsCalculations';

const Results = ({ routeData, setRouteData, allData, resetFields }) => {

  const handleCalculateClick = () => {
    const allMissingFields = validateFields(routeData, allData);
    
    if (allMissingFields.length > 0) {
      alert(`Faltan los siguientes campos o tienen valores no válidos: ${allMissingFields.join(', ')}`);
    } else {
      const calculatedResults = calculateResults(routeData, allData, setRouteData);
      setRouteData((prev) => {
        const updatedData = [...prev];
        updatedData[0].result = [calculatedResults];
        return updatedData;
      });
    }
  };

  const formatValue = (value) => {
    return typeof value === 'number' ? value.toFixed(2) : 'No disponible';
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
            .filter(([key]) => labels[key]) // Filtrar solo las claves que están en `labels`
            .map(([key, value]) => (
              <div key={key}>
                <h3 className="text-lg font-semibold">{labels[key]}:</h3>
                <p className="text-blue-900 text-2xl font-bold">{key === 'Mensaje' ? value : formatValue(value)}</p>
              </div>
            ))}

        </div>
      )}

      <SaveButton routeData={routeData} resetFields={resetFields} />
    </div>
  );
};

export default Results;
