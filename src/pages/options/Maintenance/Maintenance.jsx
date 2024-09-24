import React, { useState } from 'react';
import { maintenanceText } from '../../../components/common/Text/texts.js';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full  text-black ">
      <div className="flex space-x-4">
        <button
          className={`p-2 ${activeTab === 'form' ? 'text-black font-bold' : 'text-blue-600'}`}
          onClick={() => setActiveTab('form')}
        >
          <i className="fas fa-clipboard"></i> {maintenanceText.tabMaintenance}
        </button>
        <button
          className={`p-2 ${activeTab === 'list' ? 'text-black font-bold' : 'text-blue-600'}`}
          onClick={() => setActiveTab('list')}
        >
          <i className="fas fa-list"></i> {maintenanceText.tabMaintenanceList}
        </button>
      </div>
      <div className="flex-grow mt-4 ">
        {activeTab === 'form' && <MaintenanceForm />}
        {activeTab === 'list' && <MaintenanceList />}
      </div>
    </div>
  );
};

export default Maintenance;
