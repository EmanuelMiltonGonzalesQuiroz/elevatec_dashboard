import React, { useState, useEffect } from 'react';
import { db } from '../../../connection/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import FilteredLocationMap from './FilteredLocationMap';  // Usando el nuevo mapa

const ClientInfoModal = ({ clientId, onClose }) => {
  const [clientInfo, setClientInfo] = useState(null);
  const [clientLocations, setClientLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: -16.495543, lng: -68.133543 });
  const [stateColors, setStateColors] = useState({});  // Estado para los colores de estado

  // Cargar la información del cliente y sus ubicaciones
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientDoc = await getDoc(doc(db, 'clients', clientId));
        if (clientDoc.exists()) {
          setClientInfo(clientDoc.data());
        }

        // Obtener las ubicaciones relacionadas con el cliente
        const locationsQuery = query(collection(db, 'locations'), where('clientId', '==', clientId));
        const locationsSnapshot = await getDocs(locationsQuery);
        const locationsData = locationsSnapshot.docs.map((doc) => doc.data());
        setClientLocations(locationsData);

        // Centrar el mapa en la primera ubicación del cliente
        if (locationsData.length > 0) {
          setMapCenter({ lat: locationsData[0].location.lat, lng: locationsData[0].location.lng });
        }
      } catch (error) {
        console.error('Error al obtener datos del cliente:', error);
      }
    };

    const fetchStateColors = async () => {
      try {
        // Obtener los colores de estado desde la colección 'locationStates'
        const statesSnapshot = await getDocs(collection(db, 'locationStates'));
        const colors = {};
        statesSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          colors[doc.id] = data.color;  // Guardar el color con el ID del estado
        });
        setStateColors(colors);
      } catch (error) {
        console.error('Error al obtener colores de estado:', error);
      }
    };

    fetchClientData();
    fetchStateColors();
  }, [clientId]);

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

            {/* Mapa que muestra las ubicaciones del cliente */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Ubicaciones</h3>
              <FilteredLocationMap
                mapLocations={clientLocations}
                mapCenter={mapCenter}
                clientId={clientId}
                stateColors={stateColors}  // Pasar los colores de estado
              />
            </div>
          </div>
        ) : (
          <p>Cargando información del cliente...</p>
        )}
      </div>
    </div>
  );
};

export default ClientInfoModal;
