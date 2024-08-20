// src/pages/Settings/Motors.jsx

import React from 'react';

const Motors = () => {
  return (
    <div className="p-4 bg-gray-100 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Motors</h2>
        <div className="grid grid-cols-1 gap-4">
          {/* Reemplaza esto con los datos dinámicos */}
          <div className="p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-bold text-lg">2m/s</h3>
          </div>
          <div className="p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-bold text-lg">1.5m/s</h3>
          </div>
          <div className="p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-bold text-lg">1.75m/s</h3>
          </div>
          {/* Agrega más motores según sea necesario */}
        </div>
      </div>
    </div>
  );
};

export default Motors;
