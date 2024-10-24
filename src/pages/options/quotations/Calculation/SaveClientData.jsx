import React, { useEffect } from 'react';
import { db } from '../../../../connection/firebase.js';
import { doc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

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
  const { currentUser} = useAuth();
  useEffect(() => {
    const saveData = async () => {
      try {
        // Usamos la primera cotización para obtener el nombre del cliente
        const clientName = formData[0]['02_CLIENTE'] || "unknown_client";
        const clientsCollection = collection(db, 'clients');
        const clientsSnapshot = await getDocs(clientsCollection);

        // Encontrar el documento del cliente que coincide con el nombre seleccionado
        const clientDoc = clientsSnapshot.docs.find(
          (doc) => doc.data().name === formData[0]['02_CLIENTE']
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

        // Limpiar los datos antes de guardarlos
        const cleanedFormDataArray = formData.map(cleanData);
        const cleanedAdditionalDataArray = additionalData.map(cleanData);

        // Guardar todas las cotizaciones en un solo documento de Firestore
        const dataToSave = {
          timestamp: timestamp,
          quotationDetails: cleanedFormDataArray, // Guardar todas las cotizaciones como un array
          calculatedValues: cleanedAdditionalDataArray, // Guardar todos los valores calculados como un array
          clientId: clientId,
          state: "active",
          solicitante: currentUser
        };

        // Guardar la cotización en la colección 'list of quotations'
        await setDoc(doc(quotationsCol, docId), dataToSave);

        // Guardar una sola ubicación con el id más alto
        const locationsCol = collection(db, 'locations');

        // Obtener el ID más alto de la colección 'locations'
        const getHighestLocationId = async () => {
          const q = query(locationsCol, orderBy('id', 'desc'));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const highestLocation = querySnapshot.docs[0];
            return highestLocation.data().id;
          }
          return 0; // Si no hay ubicaciones previas, empezamos en 0
        };

        // Obtener el nuevo ID más alto
        const highestId = await getHighestLocationId();
        const newLocationId = highestId + 1; // Asignar el nuevo ID incrementado

        // Limpiar y preparar los datos de la ubicación
        const cleanedLocationData = cleanData(formData[0]); // Usamos la primera cotización para la ubicación principal

        const locationData = {
          Direccion: cleanedLocationData['Ubicacion_nombre'] || "Sin dirección", // Dirección o valor por defecto
          Tipo: [
            cleanedLocationData['Tipo_0'] || "CONSTRUCCION", // Primer valor en el array
            cleanedLocationData['Tipo_1'] || "CA", // Segundo valor en el array
            cleanedLocationData['Tipo_2'] || "C. ASCENSORES" // Tercer valor en el array
          ],
          client: clientName || "Cliente desconocido", // Nombre del cliente o valor por defecto
          createdAt: timestamp, // Marca de tiempo generada por Firestore
          id: newLocationId, // Asignamos el nuevo ID más alto
          location: cleanedLocationData['Ubicacion'],
          state: "Cotizacion_A",
          clientId: clientId // Estado específico
        };

        // Guardar la ubicación en la colección 'locations'
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
