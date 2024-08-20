// src/pages/Home/Home.jsx
import React, { useState } from 'react';
import Quotations from './../options/quotations/Quotations';
import Users from '../options/Users/Users';
import Clients from '../options/Clients/Clients';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import Profile from '../options/Profile/Profile';
import Settings from '../options/Settings/Settings';
//import loadJsonFilesToFirestore from '../../connection/loadJsonsToFirestore';

const Home = () => {
  const { currentUser } = useAuth();
  const [activeContent, setActiveContent] = useState('Cotizaciones');

  /*useEffect(() => {
    console.log('useEffect in Home is running'); // Debugging line

    const loadData = async () => {
      try {
        await loadJsonFilesToFirestore();
        alert('Data loaded successfully!');
      } catch (error) {
        console.error('Error loading data:', error); // Changed to console.error for better visibility
        alert('Error loading data: ' + error.message);
      }
    };

    loadData();
  }, []);*/

  if (!currentUser) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />
        <main className="flex-grow bg-gray-100 p-6">
          {activeContent === 'Cotizaciones' && <Quotations />}
          {activeContent === 'Clientes' && <Clients />}
          {activeContent === 'Usuarios' && <Users />}
          {activeContent === 'Ajustes' && <Settings />}
          {activeContent === 'Perfil' && <Profile />}
        </main>
      </div>
    </div>
  );
};

export default Home;
