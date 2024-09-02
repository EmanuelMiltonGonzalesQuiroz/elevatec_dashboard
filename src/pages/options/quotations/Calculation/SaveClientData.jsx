import React, { useEffect } from 'react';
import { db } from '../../../../connection/firebase.js';
import { doc, setDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

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
        const docId = `${clientName}_${timestamp}`;
        const quotationsCol = collection(db, 'list of quotations');
        const newDocRef = doc(quotationsCol, docId);

        // Verificar si existe una entrada reciente para el mismo cliente
        const q = query(
          quotationsCol,
          where('quotationDetails.02_CLIENTE', '==', clientName),
          orderBy('timestamp', 'desc'),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const lastDoc = querySnapshot.docs[0];
          const lastTimestamp = lastDoc.data().timestamp;

          // Convertir ambos timestamps a objetos Date
          const lastDate = new Date(lastTimestamp.replace(/_/g, '-').replace('T', ' ').replace('Z', ''));
          const currentDate = new Date(date.getTime());

          const diffInSeconds = (currentDate - lastDate) / 1000;

          // Si la diferencia es menor a 5 segundos, cancelar la operación
          if (diffInSeconds < 5) {
            console.log('Error: Guardado de la cotización cancelado por estar demasiado cerca de la última entrada.');
            return;
          }
        }

        // Guardar el timestamp en la base de datos para futuras verificaciones
        const dataToSave = {
          timestamp: timestamp,
          quotationDetails: formData, // Guardar formData sin limpiar para mantener consistencia
          calculatedValues: additionalData // Guardar additionalData sin limpiar para mantener consistencia
        };

        await setDoc(newDocRef, dataToSave);
        console.log(`Quotation data for ${docId} saved in Firestore`);
      } catch (err) {
        console.error('Error saving quotation data', err);
      }
    };

    saveData();
  }, [formData, additionalData]);

  return <p>¡Datos guardados con éxito!</p>;
};

export default SaveClientData;
