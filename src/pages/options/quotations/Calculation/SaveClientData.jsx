import React, { useEffect } from 'react';
import { db } from '../../../../connection/firebase.js';
import { doc, setDoc, collection, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { calculateDistance } from '../../../../components/layout/calculateDistance';

const sanitizeDocId = (id) => {
  return id.replace(/\//g, '_'); // Reemplaza '/' con '_' para asegurar IDs válidos en Firestore
};

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
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const saveData = async () => {
      try {
        const clientName = formData[0]['02_CLIENTE'] || "unknown_client";
        const clientsCollection = collection(db, 'clients');
        const clientsSnapshot = await getDocs(clientsCollection);

        const clientDoc = clientsSnapshot.docs.find(
          (doc) => doc.data().name === formData[0]['02_CLIENTE']
        );

        if (!clientDoc) {
          alert('No se pudo encontrar el ID del cliente.');
          return;
        }
        
        const clientId = clientDoc.id;
        const date = new Date();
        const timestamp = `${date.getFullYear()}_${String(date.getMonth() + 1).padStart(2, '0')}_${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}_${String(date.getMinutes()).padStart(2, '0')}_${String(date.getSeconds()).padStart(2, '0')}Z`;
        const docId = sanitizeDocId(`${clientName}_${timestamp}`);
        const quotationsCol = collection(db, 'list of quotations');

        const cleanedFormDataArray = formData.map(cleanData);
        const cleanedAdditionalDataArray = additionalData.map(cleanData);

        const dataToSave = {
          timestamp: timestamp,
          quotationDetails: cleanedFormDataArray,
          calculatedValues: cleanedAdditionalDataArray,
          clientId: clientId,
          state: "active",
          solicitante: currentUser
        };

        await setDoc(doc(quotationsCol, docId), dataToSave);

        const locationsCol = collection(db, 'locations');

        const getHighestLocationId = async () => {
          const q = query(locationsCol, orderBy('id', 'desc'));
          const querySnapshot = await getDocs(q);
          for (const locationDoc of querySnapshot.docs) {
            const locationId = locationDoc.data().id;
            if (Number.isInteger(locationId)) { // Filtrar solo enteros
              return locationId;
            }
          }
          return 0;
        };

        const highestId = await getHighestLocationId();
        const newLocationId = highestId + 1;

        const cleanedLocationData = cleanData(formData[0]);
        const newLocation = {
          Direccion: cleanedLocationData['Ubicacion_nombre'] || "Sin dirección",
          Tipo: [
            cleanedLocationData['Tipo_0'] || "CONSTRUCCION",
            cleanedLocationData['Tipo_1'] || "CA",
            cleanedLocationData['Tipo_2'] || "C. ASCENSORES"
          ],
          client: clientName || "Cliente desconocido",
          createdAt: timestamp,
          id: newLocationId,
          location: cleanedLocationData['Ubicacion'],
          state: "Cotizacion_A",
          clientId: clientId
        };

        const existingLocationsSnapshot = await getDocs(locationsCol);

        // Guardar IDs de ubicaciones y cotizaciones cercanas
        const closeLocationsIds = [];
        const closeQuotationsIds = [];

        // Iterar sobre cada ubicación existente para encontrar las cercanas
        for (const locationDoc of existingLocationsSnapshot.docs) {
          const existingLocation = locationDoc.data();
          
          if (existingLocation.location && Number.isInteger(existingLocation.id)) {
            const distance = calculateDistance(
              existingLocation.location.lat,
              existingLocation.location.lng,
              newLocation.location.lat,
              newLocation.location.lng
            );

            if (distance < 20) {
              // Agregar el ID de la ubicación cercana
              closeLocationsIds.push(locationDoc.id);

              // Cambiar estado de la ubicación cercana a "default"
              await updateDoc(locationDoc.ref, { state: "default" });

              // Buscar y actualizar el estado de la cotización correspondiente a "deleted"
              const quotationId = sanitizeDocId(existingLocation.client + "_" + existingLocation.createdAt);
              const quotationDocRef = doc(db, 'list of quotations', quotationId);

              // Agregar el ID de la cotización cercana
              closeQuotationsIds.push(quotationId);
              await updateDoc(quotationDocRef, { state: "deleted" });
            }
          }
        }


        // Guardar la nueva ubicación
        await setDoc(doc(locationsCol, docId), newLocation);

      } catch (err) {
        console.error('Error saving quotation data or location data', err);
      }
    };

    saveData();
  }, [formData, additionalData, currentUser]);

  return <p>¡Datos guardados con éxito!</p>;
};

export default SaveClientData;
