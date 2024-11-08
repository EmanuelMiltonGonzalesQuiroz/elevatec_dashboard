// src/components/ClientInfoModal.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../../connection/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import FilteredLocationMap from './FilteredLocationMap';
import ClientLocationTable from './ClientLocationTable'; // Importar el nuevo componente

const ClientInfoModal = ({ clientId, workerId, onClose, onShowDirections }) => {
  const [clientInfo, setClientInfo] = useState(null);
  const [clientLocations, setClientLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: -16.495543, lng: -68.133543 });
  const [stateColors, setStateColors] = useState({});

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId || !workerId) {
        console.error('clientId o workerId es undefined, no se puede realizar la consulta.');
        return;
      }

      try {
        const clientDoc = await getDoc(doc(db, 'clients', clientId));
        if (clientDoc.exists()) {
          setClientInfo(clientDoc.data());
        }

        const assignmentsQuery = query(
          collection(db, 'assignments'),
          where('clientId', '==', clientId),
          where('workerId', '==', workerId)
        );
        const assignmentsSnapshot = await getDocs(assignmentsQuery);

        const assignedProjectIds = assignmentsSnapshot.docs.flatMap((doc) => 
          doc.data().projectIds.map(id => id.toString())
        );

        if (assignedProjectIds.length === 0) {
          console.log('No se encontraron proyectos asignados.');
          return;
        }

        const locationsQuery = query(collection(db, 'locations'), where('clientId', '==', clientId));
        const locationsSnapshot = await getDocs(locationsQuery);

        const filteredLocations = locationsSnapshot.docs
          .filter((doc) => assignedProjectIds.includes(doc.data().id.toString()))
          .map((doc) => ({ id: doc.data().id.toString(), ...doc.data() }));

        setClientLocations(filteredLocations);

        if (filteredLocations.length > 0) {
          setMapCenter({ lat: filteredLocations[0].location.lat, lng: filteredLocations[0].location.lng });
        }
      } catch (error) {
        console.error('Error al obtener datos del cliente o ubicaciones:', error);
      }
    };

    const fetchStateColors = async () => {
      try {
        const statesSnapshot = await getDocs(collection(db, 'locationStates'));
        const colors = {};
        statesSnapshot.docs.forEach((doc) => {
          colors[doc.id] = doc.data().color;
        });
        setStateColors(colors);
      } catch (error) {
        console.error('Error al obtener colores de estado:', error);
      }
    };

    fetchClientData();
    fetchStateColors();
  }, [clientId, workerId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/2 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500 font-bold">
          X
        </button>
        {clientInfo ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Información del Cliente</h2>
            <p><strong>Nombre:</strong> {clientInfo.name}</p>
            <p><strong>Dirección:</strong> {clientInfo.address}</p>
            <p><strong>Email:</strong> {clientInfo.email}</p>
            <p><strong>Teléfono:</strong> {clientInfo.phone}</p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Ubicaciones Asignadas</h3>
              <FilteredLocationMap
                mapLocations={clientLocations}
                mapCenter={mapCenter}
                clientId={clientId}
                stateColors={stateColors}
              />
            </div>

            {/* Tabla de ubicaciones asignadas al cliente */}
            <ClientLocationTable locations={clientLocations} onShowDirections={onShowDirections}/>
          </div>
        ) : (
          <p>Cargando información del cliente...</p>
        )}
      </div>
    </div>
  );
};

export default ClientInfoModal;
