import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../connection/firebase';

const FetchAllCollections = ({ onDataFetched }) => {
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data from Firestore...'); // Añade este log para verificar consultas a la BD

      const collections = [
        'basic_config',
        'doors',
        'elements',
        'groups',
        'internal_config',
        'motors',
        'price_table',
      ];

      const dataPromises = collections.map(async (collectionName) => {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        return snapshot.docs.map(doc => doc.data());
      });

      const results = await Promise.all(dataPromises);

      const [basicConfig, doors, elements, groups, internalConfig, motors, priceTable] = results;

      onDataFetched({
        basic_config: basicConfig,
        doors: doors,
        elements: elements,
        groups: groups,
        internal_config: internalConfig,
        motors: motors,
        price_table: priceTable,
      });
    };

    fetchData();
  }, [onDataFetched]);

  return null;
};

export default FetchAllCollections;
