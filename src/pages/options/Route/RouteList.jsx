import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const RouteList = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const db = getFirestore();
      const routesCol = collection(db, 'list_of_routes');
      const routesSnapshot = await getDocs(routesCol);
      const routesData = routesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRoutes(routesData);
    };

    fetchRoutes();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-4">Lista de Rutas</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="text-black font-bold">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Nombre del Edificio</th>
            <th className="border px-4 py-2">Pasajeros</th>
            <th className="border px-4 py-2">Pisos Servicios</th>
            <th className="border px-4 py-2">Velocidad Desarrollada</th>
            <th className="border px-4 py-2">Intervalo de Espera</th>
            <th className="border px-4 py-2">Fecha</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route, index) => (
            <tr key={route.id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{route.routeData[0]?.TipoDeEdificio?.Nombre || 'N/A'}</td>
              <td className="border px-4 py-2">{route.routeData[0]?.Pasajeros || 'N/A'}</td>
              <td className="border px-4 py-2">{route.routeData[0]?.result?.[0]?.['Pisos servicios'] || 'N/A'}</td>
              <td className="border px-4 py-2">{route.routeData[0]?.result?.[0]?.['Velocidad desarrollada']?.toFixed(2) || 'N/A'}</td>
              <td className="border px-4 py-2">{route.routeData[0]?.result?.[0]?.['Intervalo de espera']?.toFixed(2) || 'N/A'}</td>
              <td className="border px-4 py-2">{new Date(route.fecha).toLocaleString() || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RouteList;
