// src/components/layout/Sidebar.jsx

import React from 'react';
import { homeText } from '../../components/common/Text/texts';

const Sidebar = ({ activeContent, setActiveContent }) => {
  return (
    <div className="w-1/5 bg-gray-900 text-white flex flex-col">
      <nav className="flex-grow">
        <ul>
          <li
            className={`p-4 cursor-pointer ${activeContent === 'Cotizaciones' ? 'bg-orange-500' : ''}`}
            onClick={() => setActiveContent('Cotizaciones')}
          >
            {homeText.quotations}
          </li>
          <li
            className={`p-4 cursor-pointer ${activeContent === 'Clientes' ? 'bg-orange-500' : ''}`}
            onClick={() => setActiveContent('Clientes')}
          >
            {homeText.clients}
          </li>
          <li
            className={`p-4 cursor-pointer ${activeContent === 'Usuarios' ? 'bg-orange-500' : ''}`}
            onClick={() => setActiveContent('Usuarios')}
          >
            {homeText.users}
          </li>
          <li
            className={`p-4 cursor-pointer ${activeContent === 'Ajustes' ? 'bg-orange-500' : ''}`}
            onClick={() => setActiveContent('Ajustes')}
          >
            {homeText.settings}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
