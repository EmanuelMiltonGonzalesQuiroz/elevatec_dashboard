import React, { useState, useEffect } from 'react';
import { homeText } from '../../components/common/Text/texts';
import {
  FaChevronLeft, FaChevronRight, FaUser, FaCog, FaUsers,
  FaFileInvoiceDollar, FaLocationArrow, FaWrench, FaTools
} from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeContent, setActiveContent }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMinimized(window.innerWidth < 1160);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Llamar inmediatamente para ajustar al tamaño inicial
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const getUserRole = () => {
    return currentUser?.role || JSON.parse(localStorage.getItem('user'))?.role || 'Usuario';
  };

  const renderItem = (text, icon, contentKey) => {
    return (
      <li
        className={`p-4 cursor-pointer flex items-center ${activeContent === contentKey ? 'bg-orange-500' : ''}`}
        onClick={() => setActiveContent(contentKey)}
      >
        {icon}
        {!isMinimized && <span className="ml-4">{text}</span>}
      </li>
    );
  };

  return (
    <div className={`bg-gray-900 text-white flex flex-col transition-all duration-300 h-screen ${isMinimized ? 'w-16' : 'w-[15%]'}`}>
      <div className="p-4 flex justify-between items-center">
        {!isMinimized && <span className="text-lg font-bold">{homeText.company}</span>}
        <button onClick={handleToggleSidebar} className="text-white">
          {isMinimized ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul>
          {renderItem(homeText.location, <FaLocationArrow />, 'Ubicación')}
          {renderItem(homeText.quotations, <FaFileInvoiceDollar />, 'Cotizaciones')}
          {getUserRole() !== 'Usuario' && renderItem(homeText.settings, <FaCog />, 'Ajustes')}
          {renderItem(homeText.maintenance, <FaWrench />, 'Mantenimiento')}
          {getUserRole() !== 'Usuario' && renderItem(homeText.maintenanceSettings, <FaTools />, 'Ajustes M.')}
          {renderItem(homeText.users, <FaUser />, 'Usuarios')}
          {getUserRole() !== 'Usuario' && renderItem(homeText.clients, <FaUsers />, 'Clientes')}
          {renderItem(homeText.profile, <CgProfile />, 'Perfil')}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
