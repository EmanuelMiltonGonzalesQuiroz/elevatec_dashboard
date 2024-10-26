import React from 'react';
import SaveButton from './SaveButton';
import { validateFields } from './ResultsValidation';
import { calculateResults } from './ResultsCalculations';

const Results = ({ routeData, setRouteData, allData, resetFields }) => {
  
  const handleCalculateClick = () => {
    console.log(routeData)
    const allMissingFields = validateFields(routeData, allData);
    
    if (allMissingFields.length > 0) {
      alert(`Faltan los siguientes campos o tienen valores no válidos: ${allMissingFields.join(', ')}`);
    } else {
      const calculatedResults = calculateResults(routeData, allData);
      setRouteData((prev) => {
        const updatedData = [...prev];
        updatedData[0].result = [calculatedResults];
        return updatedData;
      });
    }
  };

  const formatValue = (value) => (value !== undefined && value !== null ? value.toFixed(2) : 'No disponible');

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 mb-4"
        onClick={handleCalculateClick}
      >
        Cálcular
      </button>
      <h2 className="text-xl font-bold mb-4">Resultados</h2>

      {routeData[0]?.result && (
        <div className="grid grid-col sm:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-lg shadow-md">
          {Object.entries(routeData[0].result[0]).map(([key, value]) => (
            <div key={key}>
              <h3 className="text-lg font-semibold">{key}:</h3>
              <p className="text-blue-900 text-2xl font-bold">{formatValue(value)}</p>
            </div>
          ))}
        </div>
      )}

      <SaveButton routeData={routeData} resetFields={resetFields} />
    </div>
  );
};

export default Results;
