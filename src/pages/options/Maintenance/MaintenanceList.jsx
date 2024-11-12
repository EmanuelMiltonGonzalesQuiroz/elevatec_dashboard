import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import CustomModal from '../../../components/UI/CustomModal';
import Modal from '../quotations/Calculation/Modal';
import { useAuth } from '../../../context/AuthContext';
import MaintenanceTable from './MaintenanceList/MaintenanceTable';
import PDFContent from './MaintenanceList/PDFGenerator/PDFContent';
import MaintenanceFilters from './MaintenanceList/MaintenanceFilters';

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
  const { currentUser } = useAuth(); 
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [filteredMaintenance, setFilteredMaintenance] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [selectedPDFOption, setSelectedPDFOption] = useState(null); // Restaurar este estado

  useEffect(() => {
    const fetchMaintenanceList = async () => {
      const db = getFirestore();
      const maintenanceCol = collection(db, 'list of maintenance');
      const maintenanceSnapshot = await getDocs(maintenanceCol);

      const maintenanceData = maintenanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: formatDate(doc.data().date),
      }));

      setMaintenanceList(maintenanceData);
    };

    fetchMaintenanceList();
  }, []);

  const handleViewPDF = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowModal(true);
  };

  const handlePDFOption = (maintenanceData, option) => { // Restaurar esta función
    setSelectedPDFOption({ data: maintenanceData, option });
    setShowPDFModal(true);
  };

  const updateMaintenanceStatus = async (id, status) => {
    const db = getFirestore();
    const maintenanceRef = doc(db, 'list of maintenance', id);

    try {
      await updateDoc(maintenanceRef, { state: status });
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

      <MaintenanceFilters
        maintenanceList={maintenanceList}
        setFilteredMaintenance={setFilteredMaintenance}
        showDeleted={showDeleted}
      />

      <MaintenanceTable
        maintenanceList={filteredMaintenance}
        handleViewPDF={handleViewPDF}
        updateMaintenanceStatus={updateMaintenanceStatus}
        currentUser={currentUser}
        showDeleted={showDeleted}
      />

      {showModal && (
        <CustomModal show={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col items-center mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Selecciona una opción de PDF o Word</h2>
      
          <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Botón principal que ocupa las dos columnas */}
          <button
            className="col-span-2 bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700 transition w-full text-center"
            onClick={() => handlePDFOption(selectedMaintenance, 'sin_membretado')}
          >
            Ver PDF
          </button>

          {/* Primera columna de botones */}
          <div className="flex flex-col items-center space-y-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full text-center"
              onClick={() => handlePDFOption(selectedMaintenance, 'con_membretado_Jalmeco')}
            >
              Ver PDF Jalmeco
            </button>

            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full text-center"
              onClick={() => handlePDFOption(selectedMaintenance, 'con_membretado_Tecnolift')}
            >
              Ver PDF Tecnolift
            </button>
          </div>

          {/* Segunda columna de botones */}
          <div className="flex flex-col items-center space-y-4">
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full text-center"
              onClick={() => handlePDFOption(selectedMaintenance, 'sin_membretado_Jalmeco')}
            >
              Ver PDF Jalmeco sin membretado
            </button>

            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full text-center"
              onClick={() => handlePDFOption(selectedMaintenance, 'sin_membretado_Tecnolift')}
            >
              Ver PDF Tecnolift sin membretado
            </button> 
          </div>
        </div>

      
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition w-[140px] text-center"
            onClick={() => setShowModal(false)}
          >
            Cerrar
          </button>
        </div>
      </CustomModal>
      
      )}

      {showPDFModal && (
        <Modal show={showPDFModal} onClose={() => setShowPDFModal(false)}>
          <PDFContent
            recipe={selectedMaintenance}
            type={selectedPDFOption?.option || ''} // Usar `selectedPDFOption`
          />
        </Modal>
      )}
    </div>
  );
};

export default MaintenanceList;
