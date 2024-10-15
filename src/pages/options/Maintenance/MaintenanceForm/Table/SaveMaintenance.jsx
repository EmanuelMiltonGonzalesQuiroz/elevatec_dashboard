import { db } from '../../../../../connection/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

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

// Function to get the highest current 'id' in the 'locations' collection
const getNextLocationId = async () => {
  try {
    const locationsCollection = collection(db, 'locations');
    const snapshot = await getDocs(locationsCollection);

    let maxId = 0;
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.id && typeof data.id === 'number') {
        maxId = Math.max(maxId, data.id);
      }
    });

    return maxId + 1; // Next ID will be the highest ID + 1
  } catch (error) {
    console.error('Error al obtener el ID más alto:', error);
    throw new Error('No se pudo obtener el próximo ID de ubicación.');
  }
};

const saveToFirestore = async ({
  plan, buildingName, location, filteredItems, totalPriceByPlan,
  directPercentage, approvalPercentage, finalTotal, client, currentUser
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const formattedDate = currentDate.toISOString();

  try {
    // Obtener el ID más alto en la colección 'locations' y sumar 1
    const nextLocationId = await getNextLocationId();

    // Query for 'list of maintenance' documents within the current year
    const maintenanceCollection = collection(db, 'list of maintenance');
    const yearQuery = query(
      maintenanceCollection,
      where('date', '>=', `${currentYear}-01-01`),
      where('date', '<', `${currentYear + 1}-01-01`)
    );
    const clientsCollection = collection(db, 'clients');
    const clientsSnapshot = await getDocs(clientsCollection);
    const clientDoc = clientsSnapshot.docs.find(
      (doc) => doc.data().name === client.label
    );

    if (!clientDoc) {
      throw new Error('No se pudo encontrar el ID del cliente.');
    }

    const clientId = clientDoc.id;

    const documentId = `${client.label}, ${currentDate}`; // El ID será el mismo para ambas colecciones, pero usando '_' en lugar de '/'

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
      createdBy: currentUser.username
    });

    // Usar setDoc para la colección 'list of maintenance' con el mismo documentId
    await setDoc(doc(db, 'list of maintenance', documentId), cleanedData);

    // Save to 'locations' collection
    if (!client) {
      throw new Error('Missing required fields for location.');
    }

    await setDoc(doc(db, 'locations', documentId), { // Usar el mismo documentId
      client: client.label,
      clientId: clientId,
      id: nextLocationId,  // Usamos el próximo ID generado
      Direccion: buildingName,
      location: location,
      Tipo: ["Mantenimiento", "", ""],
      state: 'Cotizacion_M', // Use 'Tipo0' to set the state
      createdAt: currentDate,
    });

    return `Guardado`;

  } catch (error) {
    console.error('Error saving data:', error);
    return 'Error saving data.';
  }
};

export default saveToFirestore;
