import { getFirestore, deleteDoc, doc } from 'firebase/firestore';

const deleteMaintenance = async (id, setMaintenanceList) => {
  const db = getFirestore();
  
  // Referencias al documento en 'list of maintenance' y 'locations' usando el mismo id
  const maintenanceRef = doc(db, 'list of maintenance', id);
  const locationRef = doc(db, 'locations', id);

  try {
    // Eliminar el documento de 'list of maintenance'
    await deleteDoc(maintenanceRef);

    // Eliminar el documento de 'locations'
    await deleteDoc(locationRef);

    // Actualizar el estado local para reflejar el cambio (remover el documento eliminado de la lista)
    setMaintenanceList((prevList) => prevList.filter((maintenance) => maintenance.id !== id));

    console.log(`Mantenimiento y ubicación ${id} eliminados permanentemente`);
  } catch (error) {
    console.error('Error al eliminar mantenimiento o ubicación:', error);
  }
};

export default deleteMaintenance;
