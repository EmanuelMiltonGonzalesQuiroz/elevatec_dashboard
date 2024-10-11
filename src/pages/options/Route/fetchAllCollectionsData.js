import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase.js';

export const fetchAllCollectionsData = async (collections) => {
  const data = {};

  for (const collectionName of collections) {
    try {
      const dataCollectionRef = collection(db, collectionName);
      const dataSnapshot = await getDocs(dataCollectionRef);
      const formattedData = dataSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      data[collectionName] = formattedData;
    } catch (error) {
      console.error(`Error al cargar los datos de la colección ${collectionName}:`, error);
    }
  }

  return data;
};
