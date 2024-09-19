import React, { useState, useEffect, useRef } from 'react';
import ClientColumn from './ClientColumn';
import MainFormColumn1 from './MainFormColumn1';
import MainFormColumn2 from './MainFormColumn2';
import AdvancedOptionsColumn from './AdvancedOptionsColumn';
import Validate from './Validate';
import FetchAllCollections from '../../../components/common/FetchAllCollections';
import useInitializeVariables from '../../../components/common/InitializeVariables';

const QuotationForm = () => {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [allData, setAllData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const lastFetchTime = useRef(0);

  const initializedVariables = useInitializeVariables();

  useEffect(() => {
    if (allData && Object.keys(formData).length === 0) {
      setFormData({ ...initializedVariables });
    }
  }, [allData, formData, initializedVariables]);

  const handleReset = () => {
    setFormData({ ...initializedVariables });
    setMessage('');
  };

  const handleGenerateQuotation = () => {
    setFormData(prevData => ({
      ...prevData,
      isGenerated: true,
    }));
  };

  const handleShowMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const handleDataFetched = (fetchedData) => {
    const currentTime = Date.now();

    if (!fetching && currentTime - lastFetchTime.current > 60000) { 
      setFetching(true);
      lastFetchTime.current = currentTime; 
      setAllData(fetchedData);
      setFetching(false);
    } else {
    }
  };

  return (
    <div className="flex flex-col ">
      {!fetching && !allData && <FetchAllCollections onDataFetched={handleDataFetched} />}
      {allData && (
        <>
          <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg max-h-[70vh] overflow-auto">
            <ClientColumn
              formData={formData}
              setFormData={setFormData}
              handleGenerateQuotation={handleGenerateQuotation}
              handleReset={handleReset}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-lg flex-grow overflow-auto max-h-[80vh]">
            <MainFormColumn1 formData={formData} setFormData={setFormData} handleReset={handleReset} />
            <MainFormColumn2 formData={formData} setFormData={setFormData} allData={allData} />
            <AdvancedOptionsColumn formData={formData} setFormData={setFormData} allData={allData}  />
          </div>
          {formData.isGenerated && (
            <Validate
              formData={formData}
              setFormData={setFormData}
              onShowMessage={handleShowMessage}
              allData={allData} 
            />
          )}
        </>
      )}
      {message && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-black p-2 rounded shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default QuotationForm;
