import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import RestoreStateModal from './RestoreStateModal';
import PDFOptionsModal from './PDFOptionsModal';

const LocationTable = ({ locations, userRole, stateColors, onRowClick, onEdit, onShowDirections, onStateRestore }) => {
  const [clientNames] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchType, setSearchType] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [searchClient, setSearchClient] = useState('');
  const [validPDFIds, setValidPDFIds] = useState(new Set());
  const [locationDocIds, setLocationDocIds] = useState({});
  const [isButtonLoading, setIsButtonLoading] = useState(true);
  const [selectedPDFDocId, setSelectedPDFDocId] = useState(null); // Para manejar el ID del documento en el modal PDF

  useEffect(() => {
    const fetchValidPDFIds = async () => {
      const collectionsToCheck = ['list of maintenance', 'list of quotations'];
      const ids = new Set();

      for (const collectionName of collectionsToCheck) {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        snapshot.docs.forEach(doc => ids.add(doc.id));
      }
      setValidPDFIds(ids);
    };

    fetchValidPDFIds();
  }, []);

  const fetchDocIdFromFirestore = async (numericId) => {
    const locationsRef = collection(db, 'locations');
    const q = query(locationsRef, where('id', '==', numericId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty ? querySnapshot.docs[0].id : null;
  };

  useEffect(() => {
    const fetchLocationDocIds = async () => {
      const updatedLocationDocIds = {};
      for (const location of locations) {
        const docId = await fetchDocIdFromFirestore(location.id);
        if (docId) {
          updatedLocationDocIds[location.id] = docId;
        }
      }
      setLocationDocIds(updatedLocationDocIds);
      setIsButtonLoading(false);
    };

    fetchLocationDocIds();
  }, [locations]);

  const getClientName = (location) => {
    return clientNames[location.clientId] || location.client || 'Cliente desconocido';
  };

  const handleRestoreClick = (location) => {
    setSelectedLocation(location);
  };

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
                    <>
                      {(userRole === 'Administrador' || userRole === 'Gerencia' || userRole === "Super Usuario") && (
                        <div className="flex flex-col space-y-4 items-center">
                            {isButtonLoading ? (
                                <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div> 
                            ) : (
                                <>
                                    <button
                                        className="bg-blue-500 text-white w-32 px-4 py-2 rounded hover:bg-blue-700 transition text-center"
                                        onClick={() => onEdit(location)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-green-500 text-white w-32 px-4 py-2 rounded hover:bg-green-700 transition text-center"
                                        onClick={() => onShowDirections(location)}
                                    >
                                        Cómo Llegar
                                    </button>
                                    {validPDFIds.has(locationDocIds[location.id]) && (
                                      <button
                                        className="bg-orange-500 text-white w-32 px-4 py-2 rounded hover:bg-red-700 transition text-center"
                                        onClick={() => setSelectedPDFDocId(locationDocIds[location.id])} // Asignar el ID
                                      >
                                        Abrir PDF
                                      </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    </>
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
      
      {selectedPDFDocId && ( // Modal de PDF solo se muestra si selectedPDFDocId tiene un valor
        <PDFOptionsModal
          show={Boolean(selectedPDFDocId)}
          onClose={() => setSelectedPDFDocId(null)}
          documentId={selectedPDFDocId}
        />
      )}
    </div>
  );
};

export default LocationTable;
