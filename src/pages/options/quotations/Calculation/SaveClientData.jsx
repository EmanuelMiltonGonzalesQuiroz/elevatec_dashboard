import React, { useEffect } from 'react';
import { db } from '../../../../connection/firebase.js';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

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
          console.log('Error: Guardado de la cotización cancelado por estar demasiado cerca de la última entrada.');
          return;
        }

        // Limpiar los datos antes de guardarlos
        const cleanedFormData = cleanData(formData);
        const cleanedAdditionalData = cleanData(additionalData);

        // Guardar el timestamp en la base de datos para futuras verificaciones
        const dataToSave = {
          timestamp: timestamp,
          quotationDetails: cleanedFormData, // Guardar formData sin valores undefined o null
          calculatedValues: cleanedAdditionalData // Guardar additionalData sin valores undefined o null
        };

        // Guardar la cotización en la colección 'list of quotations'
        await setDoc(doc(quotationsCol, docId), dataToSave);
        console.log(`Quotation data for ${docId} saved in Firestore`);

        // Guardar la ubicación en la colección 'locations'
        const locationsCol = collection(db, 'locations');
        const locationData = {
          location: cleanedFormData['Ubicacion'], // Latitud y Longitud de la ubicación
          state: 'pendiente', // Estado inicial
          client: clientName, // Nombre del cliente
        };
        await setDoc(doc(locationsCol, docId), locationData);
        console.log(`Location data for ${docId} saved in Firestore`);

      } catch (err) {
        console.error('Error saving quotation data or location data', err);
      }
    };

    saveData();
  }, [formData, additionalData]);

  return <p>¡Datos guardados con éxito!</p>;
};

export default SaveClientData;
