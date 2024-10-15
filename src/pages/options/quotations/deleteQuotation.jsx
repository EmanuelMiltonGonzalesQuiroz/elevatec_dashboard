import { getFirestore, deleteDoc, doc } from 'firebase/firestore';

// Función para eliminar permanentemente una cotización y su ubicación relacionada en Firestore
const deleteQuotation = async (id, setQuotations) => {
  const db = getFirestore();
  const quotationRef = doc(db, 'list of quotations', id);
  const locationRef = doc(db, 'locations', id); // Referencia al documento de la ubicación

  try {
    // Elimina el documento de la cotización
    await deleteDoc(quotationRef);

    // Elimina el documento de la ubicación relacionada
    await deleteDoc(locationRef);

    // Actualizar el estado local para reflejar el cambio en la interfaz de usuario
    setQuotations((prevQuotations) => prevQuotations.filter((quotation) => quotation.id !== id));

    console.log(`Cotización y ubicación ${id} eliminadas permanentemente`);
  } catch (error) {
    console.error('Error al eliminar la cotización o la ubicación:', error);
  }
};

export default deleteQuotation;
