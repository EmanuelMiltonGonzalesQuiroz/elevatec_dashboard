import React, { useState } from 'react';
import { quotationsText } from '../../../components/common/Text/texts';
import QuotationForm from './QuotationForm';
import QuotationList from './QuotationsList';
import { useAuth } from '../../../context/AuthContext.jsx';

const Quotations = () => {
  const { currentUser} = useAuth(); 
  const [activeTab, setActiveTab] = useState('form');

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full text-black">
      <div className="flex space-x-4">
        <button
          className={`p-2 ${activeTab === 'form' ? 'text-black font-bold' : 'text-blue-600'}`}
          onClick={() => setActiveTab('form')}
        >
          <i className="fas fa-clipboard"></i> {quotationsText.tabQuotations}
        </button>
        <button
          className={`p-2 ${activeTab === 'list' ? 'text-black font-bold' : 'text-blue-600'}`}
          onClick={() => setActiveTab('list')}
        >
          <i className="fas fa-list"></i> {quotationsText.tabQuotationsList}
        </button>
        {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia') && (
          <button
            className={`p-2 ${activeTab === 'listE' ? 'text-black font-bold' : 'text-blue-600'}`}
            onClick={() => setActiveTab('listE')}
          >
            <i className="fas fa-list"></i> {quotationsText.tabQuotationsListE}
          </button>
        )}
      </div>
      <div className="flex-grow mt-4">
        {activeTab === 'form' && <QuotationForm />}
        {activeTab === 'list' && <QuotationList showDeleted={false} />} 
        {activeTab === 'listE' && <QuotationList showDeleted={true} />}
      </div>
    </div>
  );
};

export default Quotations;
