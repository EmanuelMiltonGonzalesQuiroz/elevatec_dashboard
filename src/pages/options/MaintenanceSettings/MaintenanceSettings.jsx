import React, { useState } from 'react';
import { maintenanceText } from '../../../components/common/Text/texts';

const MaintenanceSettings = () => {
  const [activeTab, setActiveTab] = useState('AscensoresM');

  const renderTable = (columns, rows) => {
    return (
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="border px-4 py-2">Columna {i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="border px-4 py-2">Fila {rowIndex + 1}, Col {colIndex + 1}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-4 bg-gray-100 text-black">
      <div className="flex mb-4">
        <button
          className={`mb-2 p-2 w-full ${activeTab === 'AscensoresM' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('AscensoresM')}
        >
          {maintenanceText.ascensoresM}
        </button>
        <button
          className={`mb-2 p-2 w-full ${activeTab === 'MontaCochesM' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('MontaCochesM')}
        >
          {maintenanceText.montaCochesM}
        </button>
        <button
          className={`mb-2 p-2 w-full ${activeTab === 'MontacargasM' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('MontacargasM')}
        >
          {maintenanceText.montacargasM}
        </button>
        <button
          className={`mb-2 p-2 w-full ${activeTab === 'EscaleraMecanicaM' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('EscaleraMecanicaM')}
        >
          {maintenanceText.escaleraMecanicaM}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '60vh', overflowY: 'auto' }}>
        {activeTab === 'AscensoresM' && renderTable(4, 40)}  {/* Primera sección: 4 columnas y 40 filas */}
        {activeTab === 'MontaCochesM' && renderTable(2, 14)}  {/* Segunda sección: 2 columnas y 14 filas */}
        {activeTab === 'MontacargasM' && renderTable(2, 40)}  {/* Tercera sección: 2 columnas y 40 filas */}
        {activeTab === 'EscaleraMecanicaM' && renderTable(2, 20)}  {/* Cuarta sección: 2 columnas y 20 filas */}
      </div>
    </div>
  );
};

export default MaintenanceSettings;
