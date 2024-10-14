import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import SearchBar from './RouteList/SearchBar';
import InfoModal from './RouteList/InfoModal';
import DeleteRouteButton from './RouteList/DeleteRouteButton';

const RouteList = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [buildingNames, setBuildingNames] = useState([]); // Para los tipos de edificios

  useEffect(() => {
    const fetchRoutes = async () => {
      const db = getFirestore();
      const routesCol = collection(db, 'list_of_routes');
      const routesSnapshot = await getDocs(routesCol);
      const routesData = routesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Ordenar las rutas del más nuevo al más viejo por fecha
      const sortedRoutes = routesData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      setRoutes(sortedRoutes);
      setFilteredRoutes(sortedRoutes);

      // Extraer los tipos de edificios únicos para el filtro
      const buildingTypes = [...new Set(sortedRoutes.map(route => route.routeData[0]?.TipoDeEdificio?.Nombre))].filter(Boolean);
      setBuildingNames(buildingTypes);
    };

    fetchRoutes();
  }, []);

  const handleSearch = ({ name, date, buildingType }) => {
    const lowerSearchTerm = name ? name.toLowerCase() : '';
    const adjustedDate = date ? new Date(date) : null;

    if (adjustedDate) {
      adjustedDate.setDate(adjustedDate.getDate() + 1);
    }

    const formattedAdjustedDate = adjustedDate ? adjustedDate.toISOString().split('T')[0] : '';

    setFilteredRoutes(
      routes.filter((route) => {
        let routeDate = '';
        if (route.fecha) {
          const date = new Date(route.fecha);
          date.setDate(date.getDate() + 1); // Aumentar un día
          routeDate = date.toISOString().split('T')[0];
        }

        const matchesName = lowerSearchTerm ? route.routeData[0]?.cliente.toLowerCase().includes(lowerSearchTerm) : true;
        const matchesDate = formattedAdjustedDate ? routeDate === formattedAdjustedDate : true;
        const matchesBuildingType = buildingType ? route.routeData[0]?.TipoDeEdificio?.Nombre === buildingType : true;

        return matchesName && matchesDate && matchesBuildingType;
      })
    );
  };

  const handleInfo = (route) => {
    setCurrentRoute(route);
    setIsModalOpen(true);
  };

  const handleDelete = (routeId) => {
    setRoutes(routes.filter((route) => route.id !== routeId));
    setFilteredRoutes(routes.filter((route) => route.id !== routeId));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full min-h-[70vh]">
      <h2 className="text-2xl font-bold mb-4">Lista de Rutas</h2>
      <SearchBar onSearch={handleSearch} buildingNames={buildingNames} />
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="text-black font-bold">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Tipo de Edificio</th>
            <th className="border px-4 py-2">Nombre del Cliente</th>
            <th className="border px-4 py-2">Número de Celular</th>
            <th className="border px-4 py-2">Fecha</th>
            <th className="border px-4 py-2">Creado</th>
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
              <td className="border px-4 py-2">{route.user.username || 'N/A'}</td> {/* Mostrar username */}
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                  onClick={() => handleInfo(route)}
                >
                  Info
                </button>
                <DeleteRouteButton routeId={route.id} onDelete={handleDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <InfoModal
          isOpen={isModalOpen}
          routeData={currentRoute}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RouteList;
