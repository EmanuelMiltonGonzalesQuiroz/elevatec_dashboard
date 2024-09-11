import { useEffect } from 'react';
import { db } from '../../../connection/firebase'; // Asegúrate de tener correctamente configurada la conexión a Firebase
import { collection, addDoc } from 'firebase/firestore';

const SaveMaintenance = ({ 
    plan, 
    buildingName, 
    position, 
    filteredItems, 
    totalPriceByPlan, 
    directPercentage, 
    approvalPercentage, 
    finalTotal 
}) => {

  // Función para obtener la fecha actual en formato ISO
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString(); // Devuelve la fecha en formato ISO (ejemplo: 2023-09-11T12:34:56.789Z)
  };

  // Función para guardar los datos en Firebase
  const saveToFirestore = async () => {
    try {
      const currentDate = getCurrentDate(); // Obtener la fecha actual
      await addDoc(collection(db, 'list of maintenance'), {
        plan,
        buildingName,
        location: position,
        filteredItems,
        totalPriceByPlan,
        directPercentage,
        approvalPercentage,
        finalTotal,
        date: currentDate, // Guardar la fecha actual
      });
    } catch (error) {
      console.error('Error al guardar los datos en Firebase:', error);
    }
  };

  // Guardar los datos cuando el componente cargue
  useEffect(() => {
    saveToFirestore(); // Guardar los datos en Firestore
  }, ); // Ejecutar solo una vez cuando el componente cargue

  return null; // No retorna ninguna UI
};

export default SaveMaintenance;
