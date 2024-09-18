import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import EditableForm from '../../../components/UI/EditableForm';
import { basicConfigurationsText } from '../../../components/common/Text/texts';

const BasicConfigurations = () => {
  const [configurations, setConfigurations] = useState([]);
  const [currentConfigId, setCurrentConfigId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState({});
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchConfigurations = async () => {
      const configCollection = collection(db, 'basic_config');
      const configSnapshot = await getDocs(configCollection);
      const configList = configSnapshot.docs.flatMap(doc => {
        const data = doc.data();
        if (data.items) {
          return data.items.map(item => ({
            id: doc.id, // ID del documento
            ...item,
          }));
        } else {
          return {
            id: doc.id,
            ...data,
          };
        }
      });
      setConfigurations(configList);
      setShouldReload(false);
    };

    fetchConfigurations();
  }, [shouldReload]);

  const handleOpenModal = (config) => {
    setCurrentConfigId(config.id);
    setCurrentConfig({
      name: config.name,
      valor: config.valor,
      index: config.index,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessfulEdit = () => {
    setShouldReload(true);
    handleCloseModal();
  };

  return (
    <div className="p-4 bg-gray-100 text-black max-h-[80vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[65vh]">
        <h2 className="text-2xl font-bold mb-6">{basicConfigurationsText.title}</h2>
        <div className="overflow-x-auto max-h-[50vh]">
          <table className="min-w-full bg-white border">
          <thead>
            <tr className="text-black font-bold">
              <th className="border px-4 py-2">{basicConfigurationsText.index}</th>
              <th className="border px-4 py-2">{basicConfigurationsText.name}</th>
              <th className="border px-4 py-2">{basicConfigurationsText.value}</th>
              <th className="border px-4 py-2">{basicConfigurationsText.actions}</th>
            </tr>
          </thead>
          <tbody> 
            {configurations.map((config, index) => (
              <tr key={index} className="text-black">
                <td className="border px-4 py-2">{config.index}</td>
                <td className="border px-4 py-2">{config.name}</td>
                <td className="border px-4 py-2">{config.valor}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                    onClick={() => handleOpenModal(config)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
      </div>

      {isModalOpen && (
        <EditableForm 
          docId={currentConfigId}
          collectionName="basic_config"
          fields={{
            name: basicConfigurationsText.name,
            valor: basicConfigurationsText.value,
          }}
          initialValues={currentConfig}
          onClose={handleCloseModal}
          onSuccess={handleSuccessfulEdit}
        />
      )}
    </div>
  );
};

export default BasicConfigurations;
