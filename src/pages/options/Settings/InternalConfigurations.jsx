// src/pages/Settings/InternalConfigurations.jsx

import React from 'react';

const InternalConfigurations = () => {
  return (
    <div className="p-4 bg-gray-100 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Internal Configurations</h2>
        <div className="grid grid-cols-1 gap-4">
          {/* Reemplaza esto con los datos dinámicos */}
          <div className="p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-bold text-lg">Cabin Sliders</h3>
          </div>
          <div className="p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-bold text-lg">Counterweight Sliders</h3>
          </div>
          <div className="p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-bold text-lg">Brake</h3>
          </div>
          <div className="p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-bold text-lg">Speed Regulator</h3>
          </div>
          {/* Agrega más configuraciones internas según sea necesario */}
        </div>
      </div>
    </div>
  );
};

export default InternalConfigurations;
