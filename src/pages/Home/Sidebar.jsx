// Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { homeText } from '../../components/common/Text/texts';
import {
  FaChevronLeft, FaChevronRight, FaUser, FaCog, FaUsers,
  FaFileInvoiceDollar, FaLocationArrow, FaWrench, FaTools, FaSignOutAlt, FaCalculator, FaRoute
} from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeContent, setActiveContent }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMinimized(window.innerWidth < 1160);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getUserRole = () => {
    return currentUser?.role || JSON.parse(localStorage.getItem('user'))?.role || 'Usuario';
  };

  const renderItem = (text, icon, contentKey) => (
    <li
      className={`p-4 cursor-pointer flex items-center ${activeContent === contentKey ? 'bg-orange-500' : ''}`}
      onClick={() => setActiveContent(contentKey)}
    >
      {icon}
      {!isMinimized && <span className="ml-4">{text}</span>}
    </li>
  );

  const userRole = getUserRole();

  return ( 
    <div className={`bg-gray-900 text-white flex flex-col transition-all duration-300 h-full ${isMinimized ? 'w-16 items-center justify-center' : 'max-w-[15%] min-w-[15%]'}`}>
      <div className="p-4 flex justify-between items-center">
        {!isMinimized && <span className="text-lg font-bold">{homeText.company}</span>}
        <button onClick={handleToggleSidebar} className="text-white">
          {isMinimized ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul>
          {renderItem(homeText.location, <FaLocationArrow />, 'Ubicación')}
          {userRole !== 'Trabajador' && renderItem(homeText.quotations, <FaFileInvoiceDollar />, 'Cotizaciones')}
          {['Administrador', 'Gerencia'].includes(userRole) && renderItem(homeText.settings, <FaCog />, 'Ajustes')}
          {activeContent === 'Mantenimiento' && renderItem(homeText.maintenance, <FaWrench />, 'Mantenimiento')}
          {['Administrador', 'Gerencia'].includes(userRole) && renderItem(homeText.maintenanceSettings, <FaTools />, 'Ajustes M.')}
          {renderItem(homeText.elevatorCalculations, <FaRoute />, 'Route')}
          {['Administrador', 'Gerencia'].includes(userRole) && renderItem(homeText.elevatorCalculationsSettings, <FaCalculator />, 'Calculos Elevador')}
          {userRole === 'Administrador' && renderItem(homeText.users, <FaUser />, 'Usuarios')}
          {['Administrador', 'Gerencia', 'Usuario', "Super Usuario"].includes(userRole) && renderItem(homeText.clients, <FaUsers />, 'Clientes')}
          {renderItem(homeText.profile, <CgProfile />, 'Perfil')}
          {/* Agregamos la nueva opción para 'Route' */}
        </ul>
      </nav>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition w-full flex items-center justify-center"
        >
          <FaSignOutAlt />
          {!isMinimized && <span className="ml-2">{homeText.logoutButton}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
