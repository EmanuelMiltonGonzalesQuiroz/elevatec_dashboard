import React, { useState, useEffect, useRef } from 'react';
import ClientColumn from './ClientColumn';
import MainFormColumn1 from './MainFormColumn1';
import MainFormColumn2 from './MainFormColumn2';
import AdvancedOptionsColumn from './AdvancedOptionsColumn';
import Validate from './Validate';
import FetchAllCollections from '../../../components/common/FetchAllCollections';
import initializeVariables from '../../../components/common/InitializeVariables';

const QuotationForm = () => {
  const [numQuotations, setNumQuotations] = useState(1);
  const [formDataArray, setFormDataArray] = useState([]);
  const [message, setMessage] = useState('');
  const [allData, setAllData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const lastFetchTime = useRef(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (allData) {
      const initialVariables = initializeVariables(allData);
      const initialArray = Array.from({ length: numQuotations }, () => ({ ...initialVariables }));
      setFormDataArray(initialArray);
      setActiveTab(0); // Reset to the first tab
    }
  }, [numQuotations, allData]);

  // Updated handleFormDataChange
  const handleFormDataChange = (index, newData) => {
    setFormDataArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = {
        ...prevArray[index],
        ...newData,
      };
      return newArray;
    });
  };

  const handleReset = (index) => {
    if (allData) {
      const initialVariables = initializeVariables(allData);
      setFormDataArray((prevArray) => {
        const newArray = [...prevArray];
        newArray[index] = { ...initialVariables };
        return newArray;
      });
      setMessage('');
    }
  };

  const handleGenerateQuotation = (index) => {
    handleFormDataChange(index, { isGenerated: true });
  };

  const handleCloseModal = (index) => {
    handleFormDataChange(index, { isGenerated: false });
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
    }
  };

  const handleClientChange = (field, value) => {
    setFormDataArray((prevArray) => {
      return prevArray.map((formData) => ({
        ...formData,
        [field]: value,
      }));
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
        <label htmlFor="numQuotations" className="mr-2">
          Cantidad de cotizaciones:
        </label>
        <select
          id="numQuotations"
          value={numQuotations}
          onChange={(e) => setNumQuotations(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {!fetching && !allData && <FetchAllCollections onDataFetched={handleDataFetched} />}

      {allData && formDataArray.length > 0 && (
        <>
          <div className="mb-4">
            {formDataArray.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 mr-2 ${
                  activeTab === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Cotización {index + 1}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg max-h-[70vh] overflow-auto">
              <ClientColumn
                formData={formDataArray[activeTab]}
                setFormData={(newData) => handleFormDataChange(activeTab, newData)}
                handleGenerateQuotation={() => handleGenerateQuotation(activeTab)}
                handleReset={() => handleReset(activeTab)}
                handleClientChange={handleClientChange}
                allData={allData}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-lg flex-grow overflow-auto max-h-[70vh]">
              <MainFormColumn1
                formData={formDataArray[activeTab]}
                setFormData={(newData) => handleFormDataChange(activeTab, newData)}
                handleReset={() => handleReset(activeTab)}
              />
              <MainFormColumn2
                formData={formDataArray[activeTab]}
                setFormData={(newData) => handleFormDataChange(activeTab, newData)}
                allData={allData}
              />
              <AdvancedOptionsColumn
                formData={formDataArray[activeTab]}
                setFormData={(newData) => handleFormDataChange(activeTab, newData)}
                allData={allData}
              />
            </div>
            {/* Pass the entire formDataArray to Validate */}
            {formDataArray[activeTab] && formDataArray[activeTab].isGenerated && (
              <Validate
                formData={formDataArray} // Pass the entire formDataArray
                setFormData={(index, newData) => handleFormDataChange(index, newData)} // Allow updating specific formData
                onShowMessage={handleShowMessage}
                allData={allData}
                handleCloseModal={() => handleCloseModal(activeTab)}
              />
            )}
          </div>
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

export default React.memo(QuotationForm);
