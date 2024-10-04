import React, { useState } from 'react';
import { maintenanceText } from '../../../components/common/Text/texts.js';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';
import { useAuth } from '../../../context/AuthContext.jsx';

const Maintenance = () => {
  const { currentUser} = useAuth(); 
  const [activeTab, setActiveTab] = useState('form');
  const [showDeleted, setShowDeleted] = useState(false); // Estado para alternar entre activos y eliminados

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full text-black overflow-auto">
      <div className="flex space-x-4">
        <button
          className={`p-2 ${activeTab === 'form' ? 'text-black font-bold' : 'text-blue-600'}`}
          onClick={() => setActiveTab('form')}
        >
          <i className="fas fa-clipboard"></i> {maintenanceText.tabMaintenance}
        </button>
        <button
          className={`p-2 ${activeTab === 'list' ? 'text-black font-bold' : 'text-blue-600'}`}
          onClick={() => { setActiveTab('list'); setShowDeleted(false); }}
        >
          <i className="fas fa-list"></i> {maintenanceText.tabMaintenanceList}
        </button>
        {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia') && (
          <button
            className={`p-2 ${activeTab === 'listE' ? 'text-black font-bold' : 'text-blue-600'}`}
            onClick={() => { setActiveTab('listE'); setShowDeleted(true); }}
          >
            <i className="fas fa-trash-alt"></i> {maintenanceText.tabMaintenanceListE}
          </button>
        )}
        
      </div>
      <div className="flex-grow mt-4">
        {activeTab === 'form' && <MaintenanceForm />}
        {activeTab === 'list' && <MaintenanceList showDeleted={showDeleted} />}
        {activeTab === 'listE' && <MaintenanceList showDeleted={showDeleted} />}
      </div>
    </div>
  );
};

export default Maintenance;
