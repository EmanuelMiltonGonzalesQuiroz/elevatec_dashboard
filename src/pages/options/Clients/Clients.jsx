import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { useAuth } from '../../../context/AuthContext';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import ClientSearch from './ClientSearch';
import QuotationsModal from './QuotationsModal';
import DownloadData from '../../../components/layout/DownloadData';

const Clients = () => {
  const { currentUser } = useAuth();
  const [clients, setClients] = useState([]);
  const [currentClientId, setCurrentClientId] = useState(null);
  const [formData, setFormData] = useState({ name: '', ciNIT: '', address: '', phone: '', email: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuotationsModalOpen, setIsQuotationsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const clientsCollection = collection(db, 'clients');
      const clientsSnapshot = await getDocs(clientsCollection);
      const clientsList = clientsSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        index: index + 1,
        ...doc.data(),
      }));
      setClients(clientsList);
    } catch (error) {
      console.error('Error al cargar los clientes: ', error);
    }
  };

  const handleDeleteClient = async (userId) => {
    try {
      await deleteDoc(doc(db, 'clients', userId));
      loadClients();
    } catch (error) {
      console.error('Error al eliminar el usuario: ', error);
    }
  };

  const handleOpenModal = (client = null) => {
    setCurrentClientId(client ? client.id : null);
    setFormData(client || { name: '', ciNIT: '', address: '', phone: '', email: '' });
    setIsModalOpen(true);
  };

  const handleOpenQuotationsModal = (clientId) => {
    setCurrentClientId(clientId); // Configura el cliente actual para mostrar la información
    setIsQuotationsModalOpen(true); // Abre el modal de cotizaciones
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, ciNIT, address, phone, email } = formData;
    if (!name || !ciNIT || !address || !phone || !email) return setError('Todos los campos son obligatorios.');
    try {
      currentClientId
        ? await updateDoc(doc(db, 'clients', currentClientId), { name, ciNIT, address, phone, email })
        : await addDoc(collection(db, 'clients'), { name, ciNIT, address, phone, email });
      loadClients();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el cliente: ', error);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.ciNIT.includes(searchTerm) || client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 text-black">
      <ClientSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleOpenModal={handleOpenModal} />
      {['Administrador', 'Gerencia'].includes(currentUser.role) && (
        <div className="flex space-x-4 mb-6">
          <DownloadData collectionName="clients" name="Clientes" />
        </div>
      )}
      <ClientList
        clients={clients}
        filteredClients={filteredClients}
        handleOpenModal={handleOpenModal}
        handleOpenQuotationsModal={handleOpenQuotationsModal} // Ahora conectado al botón de información
        handleDeleteClient={handleDeleteClient}
        currentUser={currentUser}
      />
      {isModalOpen && (
        <ClientForm
          formData={formData}
          handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
          error={error}
          currentClientId={currentClientId}
        />
      )}
      {isQuotationsModalOpen && (
        <QuotationsModal 
          clientId={currentClientId} 
          clientName={clients.find((client) => client.id === currentClientId)?.name} 
          onClose={() => setIsQuotationsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Clients;
