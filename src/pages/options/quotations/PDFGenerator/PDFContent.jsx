import React from 'react';
import { jsPDF } from 'jspdf';
import Header from './Header';
import Footer from './Footer';
import MainContent from './MainContent';
import TechnicalSpecifications from './TechnicalSpecifications';
import TechnicalDetails from './TechnicalDetails';
import TableComponent from './TableComponent';
import Final from './Final';

const PDFContent = ({ formData, values, timestamp }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

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

    // Obtener el número de ascensores, asegurándose de que es un número válido
    const numAscensoresRaw = formData['08_Número de ascensores'];
    const numAscensores = parseInt(numAscensoresRaw, 10);

    // Manejar casos donde numAscensores no es un número válido
    const cantidadAscensores = isNaN(numAscensores) || numAscensores < 1 ? 1 : numAscensores;

    // Generar el título de la propuesta dinámicamente
    const proposalTitle = `Presentación Propuesta Provisión e Instalación de ${cantidadAscensores} Ascensor${cantidadAscensores === 1 ? '' : 'es'}`;

    const config = {
      leftMargin: 20,
      topMargin: 20,
      bottomMargin: 20,
      city: formData['Ciudad']?.nombre || "Falta",
      date: formattedDate,
      refNumber: "COT-061/2021/SC.",
      recipient: formData['02_CLIENTE'] || "Falta",
      proposalTitle: proposalTitle
    };

    let startY = 20; // Posición inicial

    // Página 1: Cabecera y contenido principal
    Header({ doc, config, formData, values });
    MainContent({ doc, config, formData, values });

    // Ajustar la posición para el siguiente contenido
    startY = doc.lastAutoTable?.finalY + 10 || 90;

    Footer({ doc, pageNumber: doc.internal.getNumberOfPages() });

    // Especificaciones técnicas
    startY = doc.lastAutoTable?.finalY + 20; // Asegurar que no haya sobreposición
    TechnicalSpecifications({ doc, formData, startY });
    startY = doc.lastAutoTable?.finalY + 20; // Obtener la posición final de la tabla
    Footer({ doc, pageNumber: doc.internal.getNumberOfPages() });

    // Detalles técnicos
    startY = doc.lastAutoTable?.finalY + 20;
    TechnicalDetails({ doc, formData, startY });
    startY = doc.lastAutoTable?.finalY + 20;
    Footer({ doc, pageNumber: doc.internal.getNumberOfPages() });

    // Tabla de componentes finales
    startY = doc.lastAutoTable?.finalY + 20;
    TableComponent({ doc, formData, values, startY });
    startY = doc.lastAutoTable?.finalY + 20;
    Footer({ doc, pageNumber: doc.internal.getNumberOfPages() });

    // Sección final
    startY = doc.lastAutoTable?.finalY + 20;
    Final({ doc, config, startY });
    Footer({ doc, pageNumber: doc.internal.getNumberOfPages() });

    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  };

  const pdfUrl = generatePDF();

  return (
    <iframe src={pdfUrl} width="100%" height="600px" title="Vista PDF" />
  );
};

export default PDFContent;
