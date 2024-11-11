import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import RestoreStateModal from './RestoreStateModal'; // Importamos el nuevo modal

const LocationTable = ({ locations, userRole, stateColors, onRowClick, onEdit, onShowDirections, onStateRestore }) => {
  const [clientNames, setClientNames] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null); // Estado para abrir el modal
  const [searchType, setSearchType] = useState(''); // Estado para búsqueda por tipo
  const [searchAddress, setSearchAddress] = useState(''); // Estado para búsqueda por dirección
  const [searchClient, setSearchClient] = useState(''); // Estado para búsqueda por cliente

  useEffect(() => {
    // Función para cargar los nombres de los clientes basados en el clientId
    const fetchClientNames = async () => {
      const clientsCollection = collection(db, 'clients');
      const clientsSnapshot = await getDocs(clientsCollection);

      const clientsData = {};
      clientsSnapshot.docs.forEach((doc) => {
        clientsData[doc.id] = doc.data().name; // Crear un mapeo de clientId a nombre del cliente
      });

      setClientNames(clientsData);
    };

    fetchClientNames();
  }, []);

  const getClientName = (location) => {
    // Buscar el nombre del cliente basado en clientId primero, luego usar location.client si no se encuentra
    return clientNames[location.clientId] || location.client || 'Cliente desconocido';
  };

  const handleRestoreClick = (location) => {
    setSelectedLocation(location); // Guardamos la ubicación seleccionada para restaurar
  };

  // Filtrar ubicaciones según los criterios de búsqueda
  const filteredLocations = locations.filter((location) => {
    let tipoTexto;
    if (location.state === 'Cotizacion_A') {
      tipoTexto = 'Cotización Ascensor';
    } else if (location.state === 'Cotizacion_M') {
      tipoTexto = 'Cotización Mantenimiento';
    }

    const matchesType = (
      (tipoTexto && tipoTexto.toLowerCase().includes(searchType.toLowerCase())) ||
      location.Tipo?.some(tipo => tipo.toLowerCase().includes(searchType.toLowerCase())) ||
      searchType === ''
    );

    const matchesAddress = location.Direccion?.toLowerCase().includes(searchAddress.toLowerCase()) || searchAddress === '';
    const matchesClient = getClientName(location).toLowerCase().includes(searchClient.toLowerCase()) || searchClient === '';

    return matchesType && matchesAddress && matchesClient;
  });

  return (
    <div className="w-full overflow-auto max-h-[45vh]">
      {/* Campos de búsqueda */}
      <div className="mb-4 flex gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Buscar por Estado</label>
          <input
            type="text"
            placeholder="Buscar por Estado"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Buscar por dirección</label>
          <input
            type="text"
            placeholder="Buscar por dirección"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Buscar por cliente</label>
          <input
            type="text"
            placeholder="Buscar por cliente"
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
      </div>
      <table className="table-auto w-full bg-white shadow-md rounded-lg border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">TIPO</th>
            <th className="py-3 px-6 text-left">CLIENTE</th>
            <th className="py-3 px-6 text-left">DIRECCIÓN</th>
            <th className="py-3 px-6 text-left">ESTADO</th>
            <th className="py-3 px-6 text-left">ACCIÓN</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {filteredLocations
            .sort((a, b) => {
              // Ordenar para que los estados "Eliminar" y "default" aparezcan al final
              if (a.state === 'Eliminar' || a.state === 'default') return 1;
              if (b.state === 'Eliminar' || b.state === 'default') return -1;
              return 0;
            })
            .map((location) => (
              <tr
                key={location.id}
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => onRowClick(location)}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">{location.id}</td>
                <td className="py-3 px-6 text-left">
                  <div className="flex flex-col">
                    <span>{location.Tipo ? location.Tipo[0] || 0 : 0}</span>
                    <span>{location.Tipo ? location.Tipo[2] || 0 : 0}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">{getClientName(location)}</td>
                <td className="py-3 px-6 text-left">{location.Direccion || 'Sin dirección'}</td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <span
                      className="inline-block w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: stateColors[location.state] || 'black' }}
                    ></span>
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
                <td className="py-3 px-6 text-left">
                  {(location.state === 'Eliminar' || location.state === 'default') ? (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      onClick={() => handleRestoreClick(location)}
                    >
                      Restaurar
                    </button>
                  ) : (
                    (userRole === 'Administrador' || userRole === 'Gerencia' || userRole === "Super Usuario") && (
                      <div>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition mr-4"
                          onClick={() => onEdit(location)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                          onClick={() => onShowDirections(location)}
                        >
                          Cómo Llegar
                        </button>
                      </div>
                    )
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {selectedLocation && (
        <RestoreStateModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onStateRestore={onStateRestore}
        />
      )}
    </div>
  );
};

export default LocationTable;
