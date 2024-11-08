import React from 'react';

const ClientLocationTable = ({ locations, onShowDirections, onRowClick }) => (
  <div className="mt-4">
    <h3 className="text-lg font-semibold mb-2">Ubicaciones Asignadas</h3>
    <div className="overflow-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Dirección</th>
            <th className="py-2 px-4 border-b text-left">Estado</th>
            <th className="py-2 px-4 border-b text-left">Indicaciones</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => onRowClick(location)}>
              <td className="py-2 px-4 border-b">{location.id}</td>
              <td className="py-2 px-4 border-b">{location.Direccion || 'Sin dirección'}</td>
              <td className="py-2 px-4 border-b">
                <div className="flex items-center">
                  <span>
                    {location.state === 'Cotizacion_A' 
                      ? 'Cotización Ascensor' 
                      : location.state === 'Cotizacion_M' 
                      ? 'Cotización Mantenimiento'
                      : location.state === 'default' 
                      ? 'No Disponible' 
                      : location.state}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span>Latitud: {location.location.lat || 'n/a'}</span>
                  <br />
                  <span>Longitud: {location.location.lng || 'n/a'}</span>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  onClick={() => onShowDirections(location)}
                >
                  Cómo Llegar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ClientLocationTable;
