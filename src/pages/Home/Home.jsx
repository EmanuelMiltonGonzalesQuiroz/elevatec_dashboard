import React, { useState, /*useEffect*/ } from 'react';
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
          <div className="max-w-[85vw] max-h-[80vh] overflow-auto">
            {activeContent === 'Cotizaciones' && <Quotations />}
            {activeContent === 'Usuarios' && <Users />}
            {/* Mostrar solo si el rol es diferente de 'Usuario' */}
            {userRole !== 'Usuario' && activeContent === 'Clientes' && <Clients />}
            {userRole !== 'Usuario' && activeContent === 'Ajustes' && <Settings />}
            {activeContent === 'Perfil' && <Profile />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;