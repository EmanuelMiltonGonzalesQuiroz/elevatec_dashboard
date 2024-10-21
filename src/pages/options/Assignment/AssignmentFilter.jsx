import React, { useState } from 'react';
import CustomSelectUsses from '../../../components/UI/CustomSelectUsses';

const AssignmentFilter = ({ onFilter }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Manejar el filtro de cliente
  const handleClientChange = (client) => {
    setSelectedClient(client);
    onFilter({ clientId: client?.value || '', workerId: selectedWorker?.value || '' });
  };

  // Manejar el filtro de trabajador
  const handleWorkerChange = (worker) => {
    setSelectedWorker(worker);
    onFilter({ clientId: selectedClient?.value || '', workerId: worker?.value || '' });
  };

  return (
    <div className="flex space-x-4 gp-4">
      <div className="flex-grow">
        <label className="block text-gray-700 text-sm font-bold mb-2">Cliente</label>
        <CustomSelectUsses
          collectionName="clients"
          placeholder="Selecciona un cliente"
          selectedValue={selectedClient}
          onChange={handleClientChange}
        />
      </div>

      <div className="flex-grow">
        <label className="block text-gray-700 text-sm font-bold mb-2">Trabajador</label>
        <CustomSelectUsses
          collectionName="login firebase"
          role="Trabajador"
          placeholder="Selecciona un trabajador"
          selectedValue={selectedWorker}
          onChange={handleWorkerChange}
        />
      </div>
    </div>
  );
};

export default AssignmentFilter;
