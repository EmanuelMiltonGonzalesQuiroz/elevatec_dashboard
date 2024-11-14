// UploadData.jsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../connection/firebase';
import * as XLSX from 'xlsx';

const UploadData = ({ collectionName }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        alert('Por favor, selecciona un archivo');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const dataCollection = collection(db, collectionName);
        for (const record of jsonData) {
          await addDoc(dataCollection, record);
        }
        alert('Datos cargados exitosamente');
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  return (
    <div className='space-x-4'>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
        Cargar Datos
      </button>
    </div>
  );
};

export default UploadData;
