import React, { useState, useEffect } from 'react';
import { homeText } from '../../components/common/Text/texts';
import { FaChevronLeft, FaChevronRight, FaUser, FaCog, FaUsers, FaFileInvoiceDollar} from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";

const Sidebar = ({ activeContent, setActiveContent }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Automáticamente minimizar el Sidebar si la pantalla es pequeña (ej. celular)
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      className={`bg-gray-900 text-white flex flex-col transition-all duration-300 h-screen ${
        isMinimized ? 'w-16' : 'w-[15%]'
      }`}
    >
      <div className="p-4 flex justify-between items-center">
        {!isMinimized && <span className="text-lg font-bold">ELEVATEC</span>}
        <button onClick={handleToggleSidebar} className="text-white">
          {isMinimized ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul>
          <li
            className={`p-4 cursor-pointer flex items-center ${activeContent === 'Cotizaciones' ? 'bg-orange-500' : ''}`}
            onClick={() => setActiveContent('Cotizaciones')}
          >
            <FaFileInvoiceDollar />
            {!isMinimized && <span className="ml-4">{homeText.quotations}</span>}
          </li>
          <li
            className={`p-4 cursor-pointer flex items-center ${activeContent === 'Clientes' ? 'bg-orange-500' : ''}`}
            onClick={() => setActiveContent('Clientes')}
          >
            <FaUsers />
            {!isMinimized && <span className="ml-4">{homeText.clients}</span>}
          </li>
          <li
            className={`p-4 cursor-pointer flex items-center ${activeContent === 'Usuarios' ? 'bg-orange-500' : ''}`}
            onClick={() => setActiveContent('Usuarios')}
          >
            <FaUser />
            {!isMinimized && <span className="ml-4">{homeText.users}</span>}
          </li>
          <li
            className={`p-4 cursor-pointer flex items-center ${activeContent === 'Ajustes' ? 'bg-orange-500' : ''}`}
            onClick={() => setActiveContent('Ajustes')}
          >
            <FaCog />
            {!isMinimized && <span className="ml-4">{homeText.settings}</span>}
          </li>
          <li
            className={`p-4 cursor-pointer flex items-center ${activeContent === 'Perfil' ? 'bg-orange-500' : ''}`}
            onClick={() => setActiveContent('Perfil')}
          >
            <CgProfile />
            {!isMinimized && <span className="ml-4">{homeText.profile}</span>}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
