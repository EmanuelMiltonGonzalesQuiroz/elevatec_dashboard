import React, { useState, useEffect } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { getFirestore, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import PDFContent from './MaintenanceList/PDFGenerator/PDFContent';
import CustomModal from '../../../components/UI/CustomModal';
import Modal from '../quotations/Calculation/Modal';
import { useAuth } from '../../../context/AuthContext';

// Función para formatear la fecha
const formatDate = (dateString) => {
  const dateObj = new Date(dateString);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.getMonth();
  const year = String(dateObj.getFullYear()).slice(-2);
  const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
  return `${day}/${monthNames[month]}/${year}`;
};

const MaintenanceList = ({ showDeleted }) => {
  const { currentUser} = useAuth(); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [filteredMaintenance, setFilteredMaintenance] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [selectedPDFOption, setSelectedPDFOption] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const fetchMaintenanceList = async () => {
      const db = getFirestore();
      const maintenanceCol = collection(db, 'list of maintenance');
      const maintenanceSnapshot = await getDocs(maintenanceCol);

      const maintenanceData = maintenanceSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: formatDate(data.date),
        };
      });

      setMaintenanceList(maintenanceData);
    };

    fetchMaintenanceList();
  }, []);

  useEffect(() => {
    const filtered = maintenanceList.filter((maintenance) => {
      const matchesDeletedState = showDeleted ? maintenance.state === 'deleted' : maintenance.state !== 'deleted';
      const matchesClient = selectedClient ? maintenance.client.name === selectedClient.label : true;
      const matchesDate = selectedDate ? maintenance.date === formatDate(selectedDate) : true;
      return matchesDeletedState && matchesClient && matchesDate;
    });
    setFilteredMaintenance(filtered);
  }, [selectedDate, selectedClient, maintenanceList, showDeleted]);

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
  };

  const handleDateChange = (event) => {
    let selectedDate = new Date(event.target.value + "T00:00:00");
    selectedDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(selectedDate.toISOString().split('T')[0]);
  };

  const handleViewPDF = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowModal(true);
  };

  const handlePDFOption = (maintenanceData, option) => {
    setSelectedPDFOption({ data: maintenanceData, option });
    setShowPDFModal(true);
  };

  const updateMaintenanceStatus = async (id, status) => {
    const db = getFirestore();
    const maintenanceRef = doc(db, 'list of maintenance', id);

    try {
      await updateDoc(maintenanceRef, { state: status });

      // Actualizar el estado local para reflejar el cambio
      setMaintenanceList((prevList) =>
        prevList.map((maintenance) =>
          maintenance.id === id ? { ...maintenance, state: status } : maintenance
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg max-h-[75vh] text-black">
      <h1 className="text-xl font-bold mb-4">Lista de Mantenimientos</h1>
      
      <div className="mb-4">
        <label htmlFor="building" className="mr-2 text-black">Seleccionar Cliente</label>
        <CustomSelect
          collectionName="clients"
          placeholder="Buscar Cliente"
          onChange={handleClientChange}
          selectedValue={selectedClient}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="date" className="mr-2 text-black">Seleccionar Fecha</label>
        <input
          type="date"
          id="date"
          className="p-2 border rounded"
          onChange={handleDateChange}
        />
      </div>

      <div className="overflow-auto">
        <table className="bg-white w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">#</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Cliente</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Dirección</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Teléfono Cliente</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Plan</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Precio Total</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Fecha</th>
              <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
          {filteredMaintenance
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Ordena por fecha, del más nuevo al más viejo
            .map((maintenance, index) => (
              <tr key={maintenance.id} className="bg-gray-100">
                <td className="py-2 px-4 text-black">{index + 1}</td>
                <td className="py-2 px-4 text-black">{maintenance.client?.name}</td>
                <td className="py-2 px-4 text-black">{maintenance.buildingName}</td>
                <td className="py-2 px-4 text-black">{maintenance.client?.phone}</td>
                <td className="py-2 px-4 text-black">{maintenance.plan}</td>
                <td className="py-2 px-4 text-black">{maintenance.finalTotal}</td>
                <td className="py-2 px-4 text-black">{maintenance.date}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={() => handleViewPDF(maintenance)}
                  >
                    Ver PDF
                  </button>
                  {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia' || currentUser.role === 'Super Usuario') && (
                    showDeleted ? (
                      <button
                        className="bg-green-500 text-white p-2 rounded"
                        onClick={() => updateMaintenanceStatus(maintenance.id, 'active')}
                      >
                        Restaurar
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 text-white p-2 rounded"
                        onClick={() => updateMaintenanceStatus(maintenance.id, 'deleted')}
                      >
                        Eliminar
                      </button>
                    )
                  )}
                </td>
              </tr>
          ))}

          </tbody>
        </table>
      </div>

      {/* Modal con opciones de PDF */}
      {showModal && (
        <CustomModal show={showModal} onClose={() => setShowModal(false)}>
          <div className="flex flex-col items-center mx-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Selecciona una opción de PDF</h2>

            <button
              className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700 transition w-[140px] text-center"
              onClick={() => handlePDFOption(selectedMaintenance, 'sin_membretado')}
            >
              Ver PDF
            </button>

            <button
              className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700 transition w-[140px] text-center"
              onClick={() => handlePDFOption(selectedMaintenance, 'con_membretado_Jalmeco')}
            >
              Ver PDF Jalmeco
            </button>

            <button
              className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700 transition w-[140px] text-center"
              onClick={() => handlePDFOption(selectedMaintenance, 'con_membretado_Tecnolift')}
            >
              Ver PDF Tecnolift
            </button>

            <button
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition w-[140px] text-center"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </CustomModal>
      )}

      {/* Modal para mostrar el PDF */}
      {showPDFModal && (
        <Modal show={showPDFModal} onClose={() => setShowPDFModal(false)}>
          <PDFContent
            recipe={selectedMaintenance}
            type={selectedPDFOption?.option || ''}
          />
        </Modal>
      )}
    </div>
  );
};

export default MaintenanceList;
