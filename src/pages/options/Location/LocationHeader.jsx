import React from 'react';

const LocationHeader = ({ userRole, onEdit, onAdd }) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Ubicaciones de Cotizaciones</h2>
    {(userRole === 'Administrador' || userRole === 'Gerencia') && (
      <div className="mt-4">
        <button className="bg-blue-500 text-white px-4 py-2" onClick={onEdit}>Editar Estados</button>
        <button className="bg-green-500 text-white px-4 py-2 ml-4" onClick={onAdd}>Agregar Ubicación</button>
      </div>
    )}
  </div>
);

export default LocationHeader;
