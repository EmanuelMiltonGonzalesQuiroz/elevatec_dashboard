// DownloadData.jsx
import React from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../connection/firebase';
import * as XLSX from 'xlsx';
import { useAuth } from '../../context/AuthContext';

const DownloadData = ({ collectionName, name }) => {
  const { currentUser } = useAuth(); // Obtener usuario actual para el nombre de archivo

  const handleDownload = async () => {
    try {
      const dataCollection = collection(db, collectionName);
      const dataSnapshot = await getDocs(dataCollection);
      const dataList = dataSnapshot.docs.map(doc => doc.data());

      // Crear la hoja con los datos
      const worksheet = XLSX.utils.json_to_sheet(dataList);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, collectionName);

      // Formatear la fecha en español
      const currentDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      // Formato de nombre del archivo: nombre_fecha_usuario.xlsx
      const userName = currentUser ? currentUser.email.split('@')[0] : 'Invitado';
      const fileName = `${name}_${currentDate}_${userName}.xlsx`;

      // Guardar el archivo
      XLSX.writeFile(workbook, fileName);
      console.log('Datos descargados exitosamente.');
    } catch (error) {
      console.error('Error al descargar los datos:', error);
    }
  };

  return (
    <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">
      Descargar Datos
    </button>
  );
};

export default DownloadData;
