import React, { useState, useEffect } from 'react';
import Quotations from './../options/quotations/Quotations';
import Users from '../options/Users/Users';
import Clients from '../options/Clients/Clients';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import Profile from '../options/Profile/Profile';
import Settings from '../options/Settings/Settings';
import Location from '../options/Location/Locations';
import Maintenance from '../options/Maintenance/Maintenance';
import MaintenanceSettings from '../options/MaintenanceSettings/MaintenanceSettings';
import loadJsonFilesToFirestore from '../../connection/loadJsonsToFirestore'; // Import the function

const Home = () => {
  const { currentUser } = useAuth();
  const [activeContent, setActiveContent] = useState('Cotizaciones');

  useEffect(() => {
    const loadData = async () => {
        await loadJsonFilesToFirestore(); // Load data only once
      
    };

    loadData(); // Call loadData when component mounts
  }, []); // Empty dependency array to ensure this runs only once

  if (!currentUser) {
    window.location.href = '/login';
    return null;
  }

  // Obtener el rol del usuario desde el currentUser o localStorage
  const userRole = currentUser?.role || JSON.parse(localStorage.getItem('user'))?.role || 'Usuario';

  return (
    <div className="flex flex-col h-screen">
      {/* Header fijo con altura del 10% de la pantalla */}
      <Header className="h-[10%] flex-shrink-0" />
      <div className="flex flex-grow">
        {/* Sidebar con ancho fijo del 15% */}
        <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />
        <main className="flex-grow bg-gray-100 p-6">
          {/* Contenido con restricciones de tamaño y scrolls si es necesario */}
          <div className="max-w-[80vw] max-h-[10vh]">
            {activeContent === 'Ubicación' && <Location />}
            {activeContent === 'Cotizaciones' && <Quotations />}
            {userRole !== 'Usuario' && activeContent === 'Ajustes' && <Settings />}
            {activeContent === 'Mantenimiento' && <Maintenance />}
            {userRole !== 'Usuario' && activeContent === 'Ajustes M.' && <MaintenanceSettings />}
            {activeContent === 'Usuarios' && <Users />}
            {userRole !== 'Usuario' && activeContent === 'Clientes' && <Clients />}
            {activeContent === 'Perfil' && <Profile />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
