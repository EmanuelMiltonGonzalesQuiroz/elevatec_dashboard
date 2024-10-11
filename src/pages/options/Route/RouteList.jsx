import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import SearchBar from './RouteList/SearchBar';
import EditRouteModal from './RouteList/EditRouteModal';
import DeleteRouteButton from './RouteList/DeleteRouteButton';

const RouteList = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      const db = getFirestore();
      const routesCol = collection(db, 'list_of_routes');
      const routesSnapshot = await getDocs(routesCol);
      const routesData = routesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRoutes(routesData);
      setFilteredRoutes(routesData);
    };

    fetchRoutes();
  }, []);

  const handleSearch = ({ name, date }) => {
    const lowerSearchTerm = name ? name.toLowerCase() : '';
    const adjustedDate = date ? new Date(date) : null;
  
    // Sumar un día a la fecha ajustada
    if (adjustedDate) {
      adjustedDate.setDate(adjustedDate.getDate() + 1);
    }
  
    const formattedAdjustedDate = adjustedDate ? adjustedDate.toISOString().split('T')[0] : '';
  
    setFilteredRoutes(
      routes.filter((route) => {
        const routeDate = route.fecha ? new Date(route.fecha).toISOString().split('T')[0] : ''; // Formatear la fecha a 'YYYY-MM-DD'
        const matchesName = lowerSearchTerm ? route.routeData[0]?.cliente.toLowerCase().includes(lowerSearchTerm) : true;
        const matchesDate = formattedAdjustedDate ? routeDate === formattedAdjustedDate : true; // Comparar con la fecha ajustada
        return matchesName && matchesDate; // Ambos filtros deben coincidir si están definidos
      })
    );
  };
  
  

  const handleEdit = (route) => {
    setCurrentRoute(route);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedRoute) => {
    setRoutes(routes.map((route) => (route.id === updatedRoute.id ? updatedRoute : route)));
    setFilteredRoutes(routes.map((route) => (route.id === updatedRoute.id ? updatedRoute : route)));
  };

  const handleDelete = (routeId) => {
    setRoutes(routes.filter((route) => route.id !== routeId));
    setFilteredRoutes(routes.filter((route) => route.id !== routeId));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full min-h-[70vh]">
      <h2 className="text-2xl font-bold mb-4">Lista de Rutas</h2>
      <SearchBar onSearch={handleSearch} />
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="text-black font-bold">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Tipo de Edificio</th>
            <th className="border px-4 py-2">Nombre del Cliente</th>
            <th className="border px-4 py-2">Número de Celular</th>
            <th className="border px-4 py-2">Fecha</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoutes.map((route, index) => (
            <tr key={route.id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{route.routeData[0]?.TipoDeEdificio?.Nombre || 'N/A'}</td>
              <td className="border px-4 py-2">{route.routeData[0]?.cliente || 'N/A'}</td>
              <td className="border px-4 py-2">{route.routeData[0]?.clientPhone || 'N/A'}</td>
              <td className="border px-4 py-2">{new Date(route.fecha).toLocaleDateString()}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2"
                  onClick={() => handleEdit(route)}
                >
                  Editar
                </button>
                <DeleteRouteButton routeId={route.id} onDelete={handleDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EditRouteModal
          isOpen={isModalOpen}
          routeData={currentRoute}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default RouteList;
