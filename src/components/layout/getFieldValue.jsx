import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../connection/firebase';

const getFieldValue = async (collectionName, docId, fieldName) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data[fieldName] || null; // Devuelve el valor del campo o null si no se encuentra
    } else {
      console.error('Documento no encontrado');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el campo:', error);
    return null;
  }
};

export default getFieldValue;
