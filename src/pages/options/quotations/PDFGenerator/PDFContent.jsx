import React from 'react';
import { jsPDF } from 'jspdf';
import { generateJalmecoPDF } from './GenerateJalmecoPDF';
import { generateTeknoPDF } from './GenerateTeknoPDF';
import { generateBasePDF } from './GenerateBasePDF';

const PDFContent = ({ formData, values, timestamp, type }) => {
  const generatePDF = () => {
    // Configurar el tamaño de la página en 'letter'
    const doc = new jsPDF({
      format: 'letter', // Establece el tamaño a carta (Letter)
      unit: 'mm',
    });
  
    // Parse timestamp
    let formattedDate;
    if (timestamp) {
      try {
        const dateParts = timestamp.split('T')[0].split('_');
        formattedDate = `${dateParts[2]} de ${dateParts[1]} de ${dateParts[0]}`;
      } catch (error) {
        console.error("Error al parsear el timestamp:", error);
        formattedDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    } else {
      formattedDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  
    // Obtener el número de ascensores
    const numAscensoresRaw = formData['08_Número de ascensores'];
    const numAscensores = parseInt(numAscensoresRaw, 10);
    const cantidadAscensores = isNaN(numAscensores) || numAscensores < 1 ? 1 : numAscensores;
    const proposalTitle = `Presentación Propuesta Provisión e Instalación de ${cantidadAscensores} Ascensor${cantidadAscensores === 1 ? '' : 'es'}`;
    const city = formData['Ciudad']?.nombre || "Ciudad Desconocida";
    const recipient = formData['02_CLIENTE'] || "Cliente Desconocido";
  
    // Configuraciones dinámicas según el tipo de PDF
    let config;
    if (type.toLowerCase().includes('jalmeco')) {
      config = {
        leftMargin: 20,
        rightMargin: 20,      // Sin margen derecho
        topMargin: 40,       // Margen superior de 50 mm
        bottomMargin: 35,    // Margen inferior de 35 mm
        city: city,
        date: formattedDate,
        refNumber: "COT-061/2021/SC.",
        recipient: recipient,
        proposalTitle: proposalTitle
      };
    } else if (type.toLowerCase().includes('tekno') || type.toLowerCase().includes('tecno')) {
      config = {
        leftMargin: 20,
        rightMargin: 45,     // Margen derecho de 60 mm para la imagen
        topMargin: 40,       // Margen superior de 50 mm
        bottomMargin: 30,    // Margen inferior de 30 mm
        city: city,
        date: formattedDate,
        refNumber: "COT-061/2021/SC.",
        recipient: recipient,
        proposalTitle: proposalTitle
      };
    } else {
      config = {
        leftMargin: 20,
        rightMargin: 20,     // Márgenes estándar
        topMargin: 30,       // Margen superior de 30 mm
        bottomMargin: 20,    // Margen inferior de 20 mm
        city: city,
        date: formattedDate,
        refNumber: "COT-061/2021/SC.",
        recipient: recipient,
        proposalTitle: proposalTitle
      };
    }
  
    // Lógica para elegir el tipo de PDF según `type`
    if (type.toLowerCase().includes('jalmeco')) {
      generateJalmecoPDF(doc, formData, values, config);
    } else if (type.toLowerCase().includes('tekno') || type.toLowerCase().includes('tecno')) {
      generateTeknoPDF(doc, formData, values, config);
    } else {
      generateBasePDF(doc, formData, values, config);
    }
  
    // Total de páginas generadas
    const totalPages = doc.getNumberOfPages();
  
    // Agregar el número de página en cada página al final del documento
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${totalPages}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
    }
  
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  };
  
  const pdfUrl = generatePDF();

  return (
    <iframe src={pdfUrl} width="100%" height="600px" title="Vista PDF" />
  );
};

export default PDFContent;
