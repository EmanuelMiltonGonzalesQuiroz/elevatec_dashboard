import {useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../connection/firebase';

const FetchFieldFromCollection = ({ collectionName, fieldName, onDataFetched }) => {
  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      const items = snapshot.docs.flatMap(doc => 
        doc.data().items.map(item => item[fieldName])
      );
      onDataFetched(items);
    };

    fetchData();
  }, [collectionName, fieldName, onDataFetched]);

  return null;
};

export default FetchFieldFromCollection;
