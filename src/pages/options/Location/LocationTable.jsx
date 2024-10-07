import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const LocationTable = ({ locations, userRole, stateColors, onRowClick, onEdit, onShowDirections }) => {
  const [clientNames, setClientNames] = useState({});

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

  return (
    <div className="w-full overflow-auto h-[30vh]">
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
          {locations
            .filter((location) => location.state !== 'Eliminar') // Filtrar los eliminados
            .map((location) => (
              <tr
                key={location.id} 
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => onRowClick(location)} // Al hacer clic en la fila, centrar el mapa
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
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: stateColors[location.state] || 'black' }}
                  ></span>
                  <span>
                    {location.state === 'Cotizacion_A' 
                      ? 'Cotización Ascensor' 
                      : location.state === 'Cotizacion_M' 
                      ? 'Cotización Mantenimiento' 
                      : location.state}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  {(userRole === 'Administrador' || userRole === 'Gerencia' || userRole === "Super Usuario") && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition mr-4" // Espacio entre botones
                      onClick={() => onEdit(location)} // Abre el modal completo para editar la ubicación
                    >
                      Editar
                    </button>
                  )}
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition" // "Cómo Llegar" sin margen adicional
                    onClick={() => onShowDirections(location)} // Abre el modal "Cómo llegar"
                  >
                    Cómo Llegar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default LocationTable;
