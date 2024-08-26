import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../connection/firebase';

const FetchItemsFromDocument = ({ collectionName, documentName, campname, onDataFetched }) => {
  useEffect(() => {
    const fetchItems = async () => {
      const docRef = doc(db, collectionName, documentName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const items = docSnap.data().items.map(item => item[campname]); // Extrae el campo especificado
        onDataFetched(items);
      } else {
        console.log('No such document!');
      }
    };

    fetchItems();
  }, [collectionName, documentName, campname, onDataFetched]);

  return null;
};

export default FetchItemsFromDocument;