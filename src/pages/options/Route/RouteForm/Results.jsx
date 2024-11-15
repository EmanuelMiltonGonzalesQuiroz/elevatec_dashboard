import React, { useState } from 'react';
import SaveButton from './SaveButton';
import { validateFields } from './ResultsValidation';
import { calculateResults } from './ResultsCalculations';
import Switch from "react-switch";

const Results = ({ routeData, setRouteData, allData, resetFields }) => {
  const [advancedOptions, setAdvancedOptions] = useState(false);

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
        updatedData[0].advancedOptions = advancedOptions;
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
    Ancho: 'Ancho',
    Tiempo_de_apaertura_Cabina: 'Tiempo de Apertura de Cabina',
    Detencion: 'Detención',
    Valor_de_Salto: 'Valor de Salto',
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

      if (!updatedData[0].modifiedResults) {
        updatedData[0].modifiedResults = {};
      }

      updatedData[0].modifiedResults[key] = isNaN(updatedValue) ? '' : updatedValue;

      updatedData[0].advancedOptions = advancedOptions;

      const newResults = calculateResults(updatedData, allData);
      updatedData[0].result = [newResults];

      return updatedData;
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          onClick={handleCalculateClick}
        >
          Calcular
        </button>
        <label className="flex items-center">
          <span className="font-semibold text-lg mr-2">Opciones Avanzadas</span>
          <Switch 
            onChange={setAdvancedOptions} 
            checked={advancedOptions} 
            onColor="#4f46e5" 
            offColor="#ddd" 
            checkedIcon={false} 
            uncheckedIcon={false}
            handleDiameter={20}
            height={24}
            width={48}
          />
        </label>
      </div>

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
                ) : advancedOptions ? (
                  key === 'Velocidad_Desarrollada' ? (
                    <select
                      className="w-full p-2 border rounded"
                      value={routeData[0].modifiedResults?.[key] ?? value}
                      onChange={(e) => handleResultInputChange(key, e.target.value)}
                    >
                      <option value="1">1</option>
                      <option value="1.5">1.5</option>
                      <option value="1.75">1.75</option>
                      <option value="2">2</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={
                        routeData[0].modifiedResults?.[key] ?? formatValue(value)
                      }
                      onChange={(e) =>
                        handleResultInputChange(
                          key,
                          e.target.value.replace(/[^\d.-]/g, '')
                        )
                      }
                      step="0.01"
                    />
                  )
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
