import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../connection/firebase';

const FetchAllCollections = ({ onDataFetched }) => {
  const [lastFetchTime, setLastFetchTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const currentTime = Date.now();
      if (currentTime - lastFetchTime < 5000) { 
        return;
      }


      const collections = [
        'basic_config',
        'doors',
        'elements',
        'groups',
        'internal_config',
        'motors',
        'price_table',
        "maneuver"
      ];

      const dataPromises = collections.map(async (collectionName) => {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        const data = {};
        snapshot.forEach((doc) => {
          data[doc.id] = doc.data(); // Usa el ID del documento como la clave en lugar de un índice
        });
        return data;
      });

      const results = await Promise.all(dataPromises);

      const [basicConfig, doors, elements, groups, internalConfig, motors, priceTable, maneuver] = results;

      onDataFetched({
        basic_config: basicConfig,
        doors: doors,
        elements: elements,
        groups: groups,
        internal_config: internalConfig,
        motors: motors,
        price_table: priceTable,
        maneuver:maneuver
      });

      setLastFetchTime(currentTime); // Actualiza el tiempo del último fetch
    };

    fetchData();
  }, [onDataFetched, lastFetchTime]);

  return null;
};

export default FetchAllCollections;
