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
    <div className="flex p-4 bg-white rounded-lg shadow-lg w-full text-black space-x-8">
      <div className="w-1/4">
        <ClientColumn
          clientName={clientName}
          setClientName={setClientName}
          handleReset={handleReset}
        />
      </div>
      <div className="flex-grow grid grid-cols-3 gap-4">
        <MainFormColumn1 />
        <MainFormColumn2 />
        <AdvancedOptionsColumn />
      </div>
    </div>
  );
};

export default QuotationForm;
