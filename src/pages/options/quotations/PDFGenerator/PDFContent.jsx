import React from 'react';
import { jsPDF } from 'jspdf';
import Header from './Header';
import MainContent from './MainContent';
import TechnicalSpecifications from './TechnicalSpecifications';
import TechnicalDetails from './TechnicalDetails';
import TableComponent from './TableComponent';
import Final from './Final';

// Función para verificar si se necesita un salto de página
const checkAddPage = (doc, currentY) => {
  const pageHeight = doc.internal.pageSize.height; // Altura de la página
  if (currentY + 20 > pageHeight) { // Ajusta según el tamaño del contenido
    doc.addPage();
    return 30; // Reinicia la posición Y en la nueva página
  }
  return currentY;
};

const PDFContent = ({ formData, values, timestamp, type }) => {
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

    // Verificar que los valores de `formData` existen antes de pasarlos al `config`
    const city = formData['Ciudad']?.nombre || "Ciudad Desconocida";
    const recipient = formData['02_CLIENTE'] || "Cliente Desconocido";

    const config = {
      leftMargin: 20,
      topMargin: 20,
      bottomMargin: 20,
      city: city, // Asegurarse de que no sea undefined o null
      date: formattedDate,
      refNumber: "COT-061/2021/SC.",
      recipient: recipient, // Asegurarse de que no sea undefined o null
      proposalTitle: proposalTitle
    };

    // Inicializa correctamente startY
    let startY = 30; // Cambié esto a 30 para evitar problemas de Y undefined

    // Página 1: Cabecera y contenido principal
    startY = Header({ doc, config, startY });

    // Usar el valor retornado por Header como startY para MainContent
    startY = MainContent({ doc, config, formData, startY }); 

    // Especificaciones técnicas (habilitado)
    startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
    startY = TechnicalSpecifications({ doc, formData, startY }); 

    // Detalles técnicos (habilitado)
    startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
    startY = TechnicalDetails({ doc, formData, startY });

    // Tabla de componentes finales
    startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
    startY = TableComponent({ doc, formData, values, startY });

    // Sección final
    startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
    Final({ doc, config, startY });

    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  };

  const pdfUrl = generatePDF();

  return (
    <iframe src={pdfUrl} width="100%" height="600px" title="Vista PDF" />
  );
};

export default PDFContent;
