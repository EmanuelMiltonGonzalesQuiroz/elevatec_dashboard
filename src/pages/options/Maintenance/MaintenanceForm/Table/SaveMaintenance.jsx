import { db } from '../../../../../connection/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Función para limpiar el objeto y eliminar propiedades con valores undefined o null
const cleanData = (data) => {
  if (Array.isArray(data)) {
    return data.map(cleanData);
  } else if (typeof data === 'object' && data !== null) {
    const cleanedData = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        cleanedData[key] = cleanData(value);
      }
    });
    return cleanedData;
  }
  return data;
};

const saveToFirestore = async ({
  plan, buildingName, location, filteredItems, totalPriceByPlan,
  directPercentage, approvalPercentage, finalTotal, client
}) => {
  const getCurrentDate = () => new Date().toISOString();

  // Limpiar los datos antes de enviarlos a Firestore
  const sanitizedItems = cleanData(filteredItems.filter(item => 
    item.type?.type !== 'Plan' && 
    item.type?.type !== 'Client' && 
    typeof item.type !== 'function' && 
    !(item.type?.name && item.type?.position)
  ));

  const cleanedData = cleanData({
    plan,
    buildingName,
    location,
    filteredItems: sanitizedItems,
    totalPriceByPlan,
    directPercentage,
    approvalPercentage,
    finalTotal,
    client,
    date: getCurrentDate(),
  });

  try {
    await addDoc(collection(db, 'list of maintenance'), cleanedData);
    return 'Los datos se guardaron correctamente.';
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    return 'Error al guardar los datos.';
  }
};

export default saveToFirestore;
