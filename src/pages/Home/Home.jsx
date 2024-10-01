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
  const [activeContent, setActiveContent] = useState('');

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

  // Get the user's role from currentUser or localStorage
  const userRole = currentUser?.role || JSON.parse(localStorage.getItem('user'))?.role || 'Usuario';

  // Logic for which components to show based on roles
  return (
    <div className="flex flex-col h-screen">
      {/* Header with a height of 10% of the screen */}
      <Header className="h-[10%] flex-shrink-0" />
      <div className="flex flex-grow">
        {/* Sidebar with fixed width of 15% */}
        <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />
        <main className="flex-grow bg-gray-100 p-6">
          {/* Content with size constraints and scrolls if needed */}
          <div className="max-w-[80vw]">
            {activeContent === 'Ubicación' && <Location />}
            {activeContent === 'Cotizaciones' && <Quotations />}
            {['Administrador', 'Gerencia'].includes(userRole) && activeContent === 'Ajustes' && <Settings />}
            {activeContent === 'Mantenimiento' && <Maintenance />}
            {['Administrador', 'Gerencia'].includes(userRole) && activeContent === 'Ajustes M.' && <MaintenanceSettings />}
            {activeContent === 'Usuarios' && <Users />}
            {['Administrador', 'Gerencia'].includes(userRole) && activeContent === 'Clientes' && <Clients />}
            {activeContent === 'Perfil' && <Profile />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
