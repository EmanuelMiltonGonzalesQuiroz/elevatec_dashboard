import { db } from '../../../../../connection/firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

// Function to clean the object and remove properties with undefined or null values
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
  directPercentage, approvalPercentage, finalTotal, client, description, formData, markerPosition
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const formattedDate = currentDate.toISOString();
  
  try {
    // Save to 'list of maintenance' collection
    const maintenanceCollection = collection(db, 'list of maintenance');
    const yearQuery = query(
      maintenanceCollection,
      where('date', '>=', `${currentYear}-01-01`),
      where('date', '<', `${currentYear + 1}-01-01`)
    );

    const querySnapshot = await getDocs(yearQuery);
    const documentCountForYear = querySnapshot.size + 1; // Increment by 1 for the new document
    const documentId = `${String(documentCountForYear).padStart(2, '0')}/${currentYear}`;

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
      documentId,
    });

    await addDoc(maintenanceCollection, cleanedData);

    // Save to 'locations' collection
    if (!client ) {
      throw new Error('Missing required fields for location.');
    }
    const currentDate1 = new Date();
      const formattedDate2 = currentDate1.toISOString().replace(/[:.]/g, '_');

    const locationId = `${client.label}_${formattedDate2}`;
    
    await setDoc(doc(db, 'locations', locationId), {
      client: client.label,
      id: documentCountForYear,
      Direccion: buildingName,
      location: location,
      Tipo: ["Mantenimiento", "", ""],
      state: 'Mantenimiento', // Use 'Tipo0' to set the state
      createdAt: currentDate1,
    });

    return `Guardado`;

  } catch (error) {
    console.error('Error saving data:', error);
    return 'Error saving data.';
  }
};

export default saveToFirestore;
