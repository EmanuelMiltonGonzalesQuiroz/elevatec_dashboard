// src/pages/options/RouteSettings/RouteSettings.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import RouteTable from './RouteTable';
import { collectionNameMapping } from '../../../utils/collectionNames';

const RouteSettings = () => {
  const [activeCollection, setActiveCollection] = useState('configuraciones_de_ascensor');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const collections = Object.keys(collectionNameMapping);

  // Utilizamos useCallback para memorizar fetchData
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const dataCollectionRef = collection(db, activeCollection);
      const dataSnapshot = await getDocs(dataCollectionRef);
      const formattedData = dataSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
    setLoading(false);
  }, [activeCollection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-4 bg-gray-100 text-black">
      <div className="flex mb-4 flex-wrap">
        {collections.map((collectionName) => (
          <button
            key={collectionName}
            className={`mr-2 mb-2 p-2 ${
              activeCollection === collectionName
                ? 'bg-blue-500 text-white'
                : 'bg-white text-black'
            } rounded`}
            onClick={() => setActiveCollection(collectionName)}
          >
            {collectionNameMapping[collectionName]}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <RouteTable
            data={data}
            activeCollection={activeCollection}
            onDataUpdate={fetchData} // Pasamos fetchData como onDataUpdate
          />
        )}
      </div>
    </div>
  );
};

export default RouteSettings;
