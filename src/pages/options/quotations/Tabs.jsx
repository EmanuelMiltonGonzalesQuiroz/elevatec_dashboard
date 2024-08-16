// src/pages/options/quotations/Tabs.jsx
import React from 'react';
import { homeText } from '../../../components/common/Text/texts';

const Tabs = ({ setActiveTab, activeTab }) => (
  <div className="flex border-b">
    <button
      className={`p-4 ${activeTab === 'Cotizar' ? 'text-black border-b-2 border-black' : 'text-blue-600'}`}
      onClick={() => setActiveTab('Cotizar')}
    >
      <i className="icon-cotizar mr-2"></i> {homeText.quotations}
    </button>
    <button
      className={`p-4 ${activeTab === 'Lista de cotizaciones' ? 'text-black border-b-2 border-black' : 'text-blue-600'}`}
      onClick={() => setActiveTab('Lista de cotizaciones')}
    >
      <i className="icon-lista mr-2"></i> {homeText.listOfQuotations}
    </button>
  </div>
);

export default Tabs;
