import React, { useState } from 'react';
import LiftsM from './LiftsM';
import CarLiftsM from './CarLiftsM';
import ForkliftsM from './ForkliftsM';
import EscalatorM from './EscalatorM';
import { maintenanceText } from '../../../components/common/Text/texts';

const MaintenanceSettings = () => {
  const [activeTab, setActiveTab] = useState('LiftsM');

  return (
    <div className="p-4 bg-gray-100 text-black">
      <div className="flex mb-4">
        <button
          className={`mr-4 p-2 ${activeTab === 'LiftsM' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('LiftsM')}
        >
          {maintenanceText.ascensoresM}
        </button>
        <button
          className={`mr-4 p-2 ${activeTab === 'CarLiftsM' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('CarLiftsM')}
        >
          {maintenanceText.montaCochesM}
        </button>
        <button
          className={`mr-4 p-2 ${activeTab === 'ForkliftsM' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('ForkliftsM')}
        >
          {maintenanceText.montacargasM}
        </button>
        <button
          className={`mr-4 p-2 ${activeTab === 'EscalatorM' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('EscalatorM')}
        >
          {maintenanceText.escaleraMecanicaM}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '75vh'}}>
        {activeTab === 'LiftsM' && <LiftsM />}
        {activeTab === 'CarLiftsM' && <CarLiftsM />}
        {activeTab === 'ForkliftsM' && <ForkliftsM />}
        {activeTab === 'EscalatorM' && <EscalatorM />}
      </div>
    </div>
  );
};

export default MaintenanceSettings;