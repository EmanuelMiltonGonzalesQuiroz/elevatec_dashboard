import React from 'react';

const MaintenanceSettings = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-3xl font-bold text-gray-800">Configuraciones de Mantenimiento</h1>
      <p className="text-lg text-gray-600 mt-4">
        Gestiona las opciones y parámetros de mantenimiento de la aplicación.
      </p>
      <div className="mt-6">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Aplicar Cambios
        </button>
      </div>
    </div>
  );
};

export default MaintenanceSettings;

