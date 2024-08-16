import React, { useState } from 'react';
import Quotations from './../options/quotations/Quotations';
import Users from '../options/Users/Users';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const [activeContent, setActiveContent] = useState('Cotizaciones');

  if (!currentUser) {
    window.location.href = '/login';  // Redirige a login si no está autenticado
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />
        <main className="flex-grow bg-gray-100 p-6">
          {activeContent === 'Cotizaciones' && <Quotations />}
          {activeContent === 'Clientes' && <div>Clientes Content</div>}
          {activeContent === 'Usuarios' && <Users />}
          {activeContent === 'Ajustes' && <div>Ajustes Content</div>}
        </main>
      </div>
    </div>
  );
};

export default Home;
