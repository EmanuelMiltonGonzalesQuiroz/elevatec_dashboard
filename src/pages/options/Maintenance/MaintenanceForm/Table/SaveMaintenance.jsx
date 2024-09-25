import { db } from '../../../../../connection/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

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
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const formattedDate = currentDate.toISOString();

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
    date: formattedDate,
  });

  try {
    // Consultar documentos del año actual
    const maintenanceCollection = collection(db, 'list of maintenance');
    const yearQuery = query(
      maintenanceCollection,
      where('date', '>=', `${currentYear}-01-01`),
      where('date', '<', `${currentYear + 1}-01-01`)
    );

    const querySnapshot = await getDocs(yearQuery);
    const documentCountForYear = querySnapshot.size + 1; // Sumar 1 para el nuevo documento

    // Formato N/año
    const documentId = `${String(documentCountForYear).padStart(2, '0')}/${currentYear}`;
    cleanedData.documentId = documentId; // Asignar el valor del identificador

    // Guardar los datos en Firestore
    await addDoc(maintenanceCollection, cleanedData);

    return `Los datos se guardaron correctamente con el ID: ${documentId}.`;
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    return 'Error al guardar los datos.';
  }
};

export default saveToFirestore;
