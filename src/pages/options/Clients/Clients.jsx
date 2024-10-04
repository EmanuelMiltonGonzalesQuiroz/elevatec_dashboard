import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc,deleteDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { useAuth } from '../../../context/AuthContext';
import { usersText } from '../../../components/common/Text/texts';
import QuotationsModal from './QuotationsModal';  // Importa el nuevo componente

const Clients = () => {
  
  const { currentUser } = useAuth();
  const [clients, setClients] = useState([]);
  const [currentClientId, setCurrentClientId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    ciNIT: '',
    address: '',
    phone: '',
    email: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuotationsModalOpen, setIsQuotationsModalOpen] = useState(false); // Estado para controlar el modal de cotizaciones
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
    if (client) {
      setCurrentClientId(client.id);
      setFormData(client);
    } else {
      setCurrentClientId(null);
      setFormData({ name: '', ciNIT: '', address: '', phone: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleOpenQuotationsModal = (clientId) => {
    setCurrentClientId(clientId);
    setIsQuotationsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  const handleCloseQuotationsModal = () => {
    setIsQuotationsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, ciNIT, address, phone, email } = formData;

    if (!name || !ciNIT || !address || !phone || !email) {
      setError(usersText.allFieldsRequired);
      return;
    }

    try {
      if (currentClientId) {
        await updateDoc(doc(db, 'clients', currentClientId), { name, ciNIT, address, phone, email });
      } else {
        await addDoc(collection(db, 'clients'), { name, ciNIT, address, phone, email });
      }
      loadClients();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el cliente: ', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredClients = clients.filter((client) => 
    client.ciNIT.includes(searchTerm) || client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 text-black">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Buscar por CI/NIT o nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-1/3 focus:outline-none"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => handleOpenModal()}
        >
          + Agregar Nuevo Cliente
        </button>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border">
        <thead>
          <tr className='text-black font-bold'>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">CI/NIT</th>
            <th className="border px-4 py-2">Teléfono</th>
            <th className="border px-4 py-2">Correo</th>
            <th className="border px-4 py-2">Dirección</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id} className='text-black'>
              <td className="border px-4 py-2">{client.index}</td>
              <td className="border px-4 py-2">{client.name}</td>
              <td className="border px-4 py-2">{client.ciNIT}</td>
              <td className="border px-4 py-2">{client.phone}</td>
              <td className="border px-4 py-2">{client.email}</td>
              <td className="border px-4 py-2">{client.address}</td>
              <td className="border px-4 py-2">
              <td className="border px-4 py-2">
                  <div className="flex justify-center items-center">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition mx-2"
                      onClick={() => handleOpenModal(client)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition mx-2"
                      onClick={() => handleOpenQuotationsModal(client.name)}
                    >
                      Información
                    </button>
                  {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia') && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition mx-2"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      Eliminiar
                    </button>
                  )}

                  </div>
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {currentClientId ? "Editar Cliente" : "Agregar Cliente"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">CI/NIT</label>
                <input
                  type="text"
                  name="ciNIT"
                  value={formData.ciNIT}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Correo</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  {currentClientId ? "Actualizar" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isQuotationsModalOpen && (
        <QuotationsModal 
          clientId={currentClientId} 
          clientName={clients.find(client => client.id === currentClientId)?.name}
          onClose={handleCloseQuotationsModal} 
        />
      )}
    </div>
  );
};

export default Clients;
