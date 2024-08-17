import React, { useState, useEffect } from 'react';
import { homeText } from '../../../components/common/Text/texts';
import NewClientModal from './NewClientModal';
import { db } from '../../../connection/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Select from 'react-select';

const ClientColumn = ({ clientName, setClientName, handleReset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        const clientsList = querySnapshot.docs.map((doc) => ({
          label: doc.data().name,
          value: doc.id,
          ...doc.data(),
        }));
        setClients(clientsList);
      } catch (error) {
        console.error('Error al obtener los clientes: ', error);
      }
    };

    fetchClients();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
    setClientName(selectedOption ? selectedOption.label : '');
  };

  return (
    <div className="col-span-1 flex flex-col text-black font-bold">
      <label htmlFor="clientName" className="mb-2 font-semibold text-black">
        {homeText.searchClient}
      </label>
      <div className="flex">
        <Select
          id="clientName"
          options={clients}
          value={selectedClient}
          onChange={handleClientChange}
          placeholder={homeText.searchClient}
          className="flex-grow"
        />
        <button
          onClick={handleOpenModal}
          className="bg-green-500 text-white px-4 rounded-r hover:bg-green-700 transition"
        >
          +
        </button>
      </div>
      <button className="mt-2 bg-green-500 text-white py-2 rounded hover:bg-green-700 transition">
        {homeText.generateQuotation}
      </button>
      <button
        onClick={handleReset}
        className="mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-700 transition"
      >
        {homeText.resetData}
      </button>
      {isModalOpen && <NewClientModal onClose={handleCloseModal} />}
    </div>
  );
};

export default ClientColumn;
