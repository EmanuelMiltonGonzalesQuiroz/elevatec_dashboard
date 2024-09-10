import React, { useState } from 'react';
import Groups from './Groups';
import Elements from './Elements';
import Motors from './Motors';
import Doors from './Doors';
import PriceTable from './PriceTable';
import BasicConfigurations from './BasicConfigurations';
import InternalConfigurations from './InternalConfigurations';
import { settingsText } from '../../../components/common/Text/texts';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Groups');
 
  return (
    <div className="p-4 bg-gray-100 text-black">
      <div className="flex mb-4">
        <button
          className={`mr-4 p-2 ${activeTab === 'Groups' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('Groups')}
        >
          {settingsText.groups}
        </button>
        <button
          className={`mr-4 p-2 ${activeTab === 'Elements' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('Elements')}
        >
          {settingsText.elements}
        </button>
        <button
          className={`mr-4 p-2 ${activeTab === 'Motors' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('Motors')}
        >
          {settingsText.motors}
        </button>
        <button
          className={`mr-4 p-2 ${activeTab === 'Doors' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('Doors')}
        >
          {settingsText.doors}
        </button>
        <button
          className={`mr-4 p-2 ${activeTab === 'PriceTable' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('PriceTable')}
        >
          {settingsText.priceTable}
        </button>
        <button
          className={`mr-4 p-2 ${activeTab === 'BasicConfigurations' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('BasicConfigurations')}
        >
          {settingsText.basicConfigurations}
        </button>
        <button
          className={`mr-4 p-2 ${activeTab === 'InternalConfigurations' ? 'bg-blue-500 text-white' : 'bg-white text-black'} rounded-lg`}
          onClick={() => setActiveTab('InternalConfigurations')}
        >
          {settingsText.internalConfigurations}
        </button>
      </div>
      
      {/* Aquí definimos la altura fija del 60% de la pantalla */}
      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: '75vh'}}>
        {activeTab === 'Groups' && <Groups />}
        {activeTab === 'Elements' && <Elements />}
        {activeTab === 'Motors' && <Motors />}
        {activeTab === 'Doors' && <Doors />}
        {activeTab === 'PriceTable' && <PriceTable />}
        {activeTab === 'BasicConfigurations' && <BasicConfigurations />}
        {activeTab === 'InternalConfigurations' && <InternalConfigurations />}
      </div>
    </div>
  );
};

export default Settings;
