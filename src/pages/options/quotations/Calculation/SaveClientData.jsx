import React, { useEffect } from 'react';
import { db } from '../../../../connection/firebase.js';
import { doc, setDoc, collection, getDocs,  query, orderBy } from 'firebase/firestore';

const sanitizeDocId = (id) => {
  return id.replace(/\//g, '_'); // Reemplaza '/' con '_' para asegurar IDs válidos en Firestore
};

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

const SaveClientData = ({ formData, additionalData }) => {
  useEffect(() => {
    const saveData = async () => {
      try {
        const clientName = formData['02_CLIENTE'] || "unknown_client";
        const clientsCollection = collection(db, 'clients');
        const clientsSnapshot = await getDocs(clientsCollection);
    
        // Encontrar el documento del cliente que coincide con el nombre seleccionado
        const clientDoc = clientsSnapshot.docs.find(
          (doc) => doc.data().name === formData['02_CLIENTE']
        );
    
        if (!clientDoc) {
          alert('No se pudo encontrar el ID del cliente.');
          return;
        }
        const clientId = clientDoc.id; 

        // Obtener la hora local sin milisegundos
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const timestamp = `${year}_${month}_${day}T${hours}_${minutes}_${seconds}Z`;
        const docId = sanitizeDocId(`${clientName}_${timestamp}`);
        const quotationsCol = collection(db, 'list of quotations');

        // Obtener todos los documentos del cliente
        const querySnapshot = await getDocs(quotationsCol);
        let tooClose = false;

        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          const docTimestamp = docData.timestamp || "";
          const docClientName = docData.quotationDetails?.['02_CLIENTE'] || "";

          if (docClientName === clientName) {
            // Comparar los timestamps
            const lastDate = new Date(docTimestamp.replace(/_/g, '-').replace('T', ' ').replace('Z', ''));
            const currentDate = new Date(date.getTime());
            const diffInSeconds = (currentDate - lastDate) / 1000;

            if (diffInSeconds < 3) {
              tooClose = true;
            }
          }
        });

        // Si se encuentra una entrada muy cercana, cancelar la operación
        if (tooClose) {
          return;
        }

        // Limpiar los datos antes de guardarlos
        const cleanedFormData = cleanData(formData);
        const cleanedAdditionalData = cleanData(additionalData);

        // Guardar el timestamp en la base de datos para futuras verificaciones
        const dataToSave = {
          timestamp: timestamp,
          quotationDetails: cleanedFormData, // Guardar formData sin valores undefined o null
          calculatedValues: cleanedAdditionalData,
          clientId: clientId, // Guardar additionalData sin valores undefined o null
        };

        // Guardar la cotización en la colección 'list of quotations'
        await setDoc(doc(quotationsCol, docId), dataToSave);

        // Guardar la ubicación en la colección 'locations'
        const locationsCol = collection(db, 'locations');

// Función para obtener el ID disponible más bajo
const getLowestAvailableId = async () => {
  const q = query(locationsCol, orderBy("id")); // Ordenar por ID
  const querySnapshot = await getDocs(q);
  let lowestAvailableId = 1; // Empezamos desde el ID 1
  const ids = querySnapshot.docs.map(doc => parseInt(doc.data().id, 10)).filter(id => !isNaN(id)); // Convertir los IDs a números
  
  // Buscar el ID más bajo disponible
  for (let i = 1; i <= ids.length + 1; i++) {
    if (!ids.includes(i)) {
      lowestAvailableId = i;
      break;
    }
  }

  return lowestAvailableId.toString(); // Devolver el ID como cadena
};

// Obtener el ID disponible más bajo y luego guardar el documento
const lowestAvailableId = await getLowestAvailableId();

const locationData = {
  Direccion: cleanedFormData['Ubicacion_nombre'] || "Sin dirección", // Dirección o valor por defecto
  Tipo: [
    cleanedFormData['Tipo_0'] || "CONSTRUCCION", // Primer valor en el array
    cleanedFormData['Tipo_1'] || "CA", // Segundo valor en el array
    cleanedFormData['Tipo_2'] || "C. ASCENSORES" // Tercer valor en el array
  ],
  client: clientName || "Cliente desconocido", // Nombre del cliente o valor por defecto
  createdAt: timestamp, // Marca de tiempo generada por Firestore
  id: lowestAvailableId, // ID más bajo disponible
  location: cleanedFormData['Ubicacion'],
  state: "Cotizacion_A",
  clientId:clientId // Estado específico
};
        await setDoc(doc(locationsCol, docId), locationData);

      } catch (err) {
        console.error('Error saving quotation data or location data', err);
      }
    };

    saveData();
  }, [formData, additionalData]);

  return <p>¡Datos guardados con éxito!</p>;
};

export default SaveClientData;
