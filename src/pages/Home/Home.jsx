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
import Route from '../options/Route/Route';
import RouteSettings from '../options/RouteSettings/RouteSettings';
import Assignment from '../options/Assignment/Assignment';  // Import the new component
import loadJsonFilesToFirestore from '../../connection/loadJsonsToFirestore';
import loadJsonFilesToFirestore2 from '../../connection/loadJsonsToFirestore2';

const Home = () => {
  const { currentUser, logout } = useAuth();
  const [activeContent, setActiveContent] = useState('Perfil');

  useEffect(() => {
    const loadData = async () => {
      await loadJsonFilesToFirestore();
      await loadJsonFilesToFirestore2();
    };

    loadData();
  }, []);

  /*useEffect(() => {
    if (currentUser) {
      const timer = setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, 3600000);
    
      return () => clearTimeout(timer);
    }
  }, [currentUser, logout]);*/

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
            {!['Trabajador'].includes(userRole) && activeContent === 'Mantenimiento' && <Maintenance />}
            {['Administrador', 'Gerencia'].includes(userRole) && activeContent === 'Ajustes M.' && <MaintenanceSettings />}
            {!['Trabajador'].includes(userRole) && activeContent === 'Route' && <Route />}
            {['Administrador', 'Gerencia'].includes(userRole) && activeContent === 'Calculos Elevador' && <RouteSettings />}
            {['Administrador'].includes(userRole) && activeContent === 'Usuarios' && <Users />}
            {['Administrador', 'Gerencia', 'Usuario', "Super Usuario"].includes(userRole) && activeContent === 'Clientes' && <Clients />}
            {activeContent === 'Perfil' && <Profile />}
            {activeContent === 'Asignacion' && <Assignment />} {/* Adding the new option for Asignacion */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
