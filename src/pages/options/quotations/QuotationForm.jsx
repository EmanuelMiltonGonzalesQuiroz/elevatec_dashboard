import React, { useState } from 'react';
import ClientColumn from './ClientColumn';
import MainFormColumn1 from './MainFormColumn1';
import MainFormColumn2 from './MainFormColumn2';
import AdvancedOptionsColumn from './AdvancedOptionsColumn';

const QuotationForm = () => {
  const [clientName, setClientName] = useState('');

  const handleReset = () => {
    setClientName('');
    // Aquí puedes agregar la lógica para resetear otros campos del formulario
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg">
        <ClientColumn
          clientName={clientName}
          setClientName={setClientName}
          handleReset={handleReset}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-lg flex-grow max-h-[60vh] overflow-y-auto">
        <MainFormColumn1 />
        <MainFormColumn2 />
        <AdvancedOptionsColumn />
      </div>
    </div>
  );
};

export default QuotationForm;
