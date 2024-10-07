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
import loadJsonFilesToFirestore from '../../connection/loadJsonsToFirestore';

const Home = () => {
  const { currentUser, logout } = useAuth();
  const [activeContent, setActiveContent] = useState('Perfil');

  useEffect(() => {
    const loadData = async () => {
      await loadJsonFilesToFirestore();
    };

    loadData();
  }, []);

  useEffect(() => {
    // Si el usuario está logeado, configurar un temporizador para desloguear después de 10 segundos
    if (currentUser) {
      const timer = setTimeout(() => {
        logout(); // Cerrar la sesión automáticamente después de una hora
        window.location.href = '/login'; // Redirigir al login
      }, 3600000); // 3600000 milisegundos = 1 hora
    
      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }
    
  }, [currentUser, logout]);

  if (!currentUser) {
    window.location.href = '/login';
    return null;
  }

  const userRole = currentUser?.role || JSON.parse(localStorage.getItem('user'))?.role || 'Usuario';

  return (
    <div className="flex flex-col h-screen">
      <Header className="h-[10%] flex-shrink-0" />
      <div className="flex flex-grow"> 
        <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />
        <main className="flex-grow bg-gray-100 p-6">
          <div className="w-full">
            {activeContent === 'Ubicación' && <Location />}
            {activeContent === 'Cotizaciones' && <Quotations />}
            {['Administrador', 'Gerencia'].includes(userRole) && activeContent === 'Ajustes' && <Settings />}
            {activeContent === 'Mantenimiento' && <Maintenance />}
            {['Administrador', 'Gerencia'].includes(userRole) && activeContent === 'Ajustes M.' && <MaintenanceSettings />}
            {['Administrador'].includes(userRole) && activeContent === 'Usuarios' && <Users />}
            {['Administrador', 'Gerencia', 'Usuario', "Super Usuario"].includes(userRole) && activeContent === 'Clientes' && <Clients />}
            {activeContent === 'Perfil' && <Profile />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
