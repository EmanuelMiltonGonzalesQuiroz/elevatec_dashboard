import React, { useState } from 'react';

const ClientLocationTable = ({ locations, onShowDirections, onRowClick }) => {
  const [searchType, setSearchType] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  // Filtra las ubicaciones en función del tipo y la dirección ingresados
  const filteredLocations = locations.filter((location) => {
    // Convertir el estado de la ubicación en un tipo legible si es "Cotizacion_A" o "Cotizacion_M"
    let tipoTexto;
    if (location.state === 'Cotizacion_A') {
      tipoTexto = 'Cotización Ascensor';
    } else if (location.state === 'Cotizacion_M') {
      tipoTexto = 'Cotización Mantenimiento';
    }

    const matchesType = (
      (tipoTexto && tipoTexto.toLowerCase().includes(searchType.toLowerCase())) || // Verifica si el tipo mapeado coincide con la búsqueda
      location.Tipo?.some(tipo => tipo.toLowerCase().includes(searchType.toLowerCase())) || // Verifica en la lista de tipos originales
      searchType === ''
    );

    const matchesAddress = location.Direccion?.toLowerCase().includes(searchAddress.toLowerCase()) || searchAddress === '';

    return matchesType && matchesAddress;
  });

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Ubicaciones Asignadas</h3>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar por tipo"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Buscar por dirección"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
      </div>
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
            {filteredLocations.map((location) => (
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
                    <span>Latitud: {location.location?.lat || 'n/a'}</span>
                    <br />
                    <span>Longitud: {location.location?.lng || 'n/a'}</span>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowDirections(location);
                    }}
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
};

export default ClientLocationTable;
