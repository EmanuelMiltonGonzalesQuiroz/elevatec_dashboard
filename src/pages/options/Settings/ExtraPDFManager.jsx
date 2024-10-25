import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../../connection/firebase'; // Importa tu conexión de Firebase

const ExtraPDFManager = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Cargar el PDF inicial desde Firebase Storage
  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const pdfRef = ref(storage, 'PDF/extraPdfJalmeco.pdf'); // Ruta del PDF en el storage
        const url = await getDownloadURL(pdfRef);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error al obtener el PDF desde Firebase:', error);
      }
    };

    fetchPdfUrl();
  }, []);

  // Manejar la selección del archivo PDF
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Subir el nuevo PDF a Firebase Storage
  const handleUpload = () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo PDF.');
      return;
    }

    const storageRef = ref(storage, 'PDF/extraPdfJalmeco.pdf'); // Sube y reemplaza el PDF en el storage
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    setIsUploading(true);

    // Monitorizar el progreso de la subida
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error al subir el archivo:', error);
        setIsUploading(false);
      },
      () => {
        setIsUploading(false);
        setUploadProgress(0);
        alert('Archivo PDF actualizado con éxito.');
        // Volver a obtener la URL del archivo subido para previsualizarlo
        getDownloadURL(storageRef).then((url) => {
          setPdfUrl(url);
        });
      }
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-h-[60vh] overflow-auto">
      <h2 className="text-xl font-bold mb-4">Gestión del PDF Extra</h2>

      {/* Vista previa del PDF */}
      {pdfUrl ? (
        <div className="mb-4">
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            width="100%"
            height="400px"
            title="Vista previa del PDF"
          />
        </div>
      ) : (
        <div className="text-gray-500 mb-4">Cargando PDF...</div>
      )}

      {/* Carga de un nuevo archivo PDF */}
      <div className="mb-4">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>

      {/* Botón de subida */}
      <button
        className={`p-2 ${isUploading ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded`}
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? `Subiendo... ${Math.round(uploadProgress)}%` : 'Subir nuevo PDF'}
      </button>
    </div>
  );
};

export default ExtraPDFManager;
