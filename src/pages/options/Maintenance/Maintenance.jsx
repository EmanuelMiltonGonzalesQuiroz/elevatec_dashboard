import React from 'react';

const Maintenance = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">Página en Mantenimiento</h1>
      <p className="text-lg text-gray-600 mt-4">
        Estamos trabajando para mejorar esta página. ¡Vuelve pronto!
      </p>
      <div className="mt-6">
        <a href="/" className="text-blue-600 hover:underline">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default Maintenance;
