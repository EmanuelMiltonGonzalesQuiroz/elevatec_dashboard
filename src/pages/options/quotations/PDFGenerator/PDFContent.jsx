import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { generateJalmecoPDF } from './GenerateJalmecoPDF';
import { generateTeknoPDF } from './GenerateTeknoPDF';
import { generateBasePDF } from './GenerateBasePDF';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../connection/firebase.js';

// Función para obtener la abreviatura de la ciudad
const getCityAbbreviation = (cityName) => {
  const cityMap = {
    "potosi": "PT",
    "potosí": "PT",
    "cochabamba": "CB",
    "santa cruz": "SC",
    "la paz": "LP",
    "oruro": "OR",
    "tarija": "TJ",
    "sucre": "SU",
    "beni": "BN",
    "transporte por el cliente": "OT" // Abreviatura OT para transporte por el cliente u otros
  };
  return cityMap[cityName.toLowerCase()] || "OT";
};

const PDFContent = ({ formData, values, timestamp, type }) => {
  console.log(timestamp)
  const [quotationCode, setQuotationCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(true); // Estado para mostrar el mensaje de espera

  useEffect(() => {
    const convertTimestampToDate = (timestamp) => {
      const [datePart, timePart] = timestamp.split('T');
      const [year, month, day] = datePart.split('_');
      const [hour, minute, second] = timePart.split('_').map((t) => t.replace('Z', ''));
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
    };
    
    const fetchQuotations = async () => {
      const collectionRef = collection(db, 'list of quotations');
      const snapshot = await getDocs(collectionRef);
    
      // Convertir el timestamp a fecha y ordenar las cotizaciones
      const quotations = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp;
    
          // Convertir el timestamp personalizado a un objeto Date
          const formattedDate = convertTimestampToDate(timestamp);
    
          return { id: doc.id, data, date: formattedDate };
        })
        // Ordenar las fechas correctamente
        .sort((a, b) => a.date - b.date);
    
      // Asignar códigos y mostrar los índices de cada cotización
      quotations.forEach((quotation, index) => {
        const year = quotation.data.timestamp.split('T')[0].split('_')[0];
        const city = formData['Ciudad']?.nombre || 'Desconocido';
        const cityAbbreviation = getCityAbbreviation(city);
    
        // Asignar el código de cotización con el índice adecuado
        quotation.code = `COT-${index + 101}/${year}/${cityAbbreviation}`;
    
        // Mostrar en consola la fecha y el índice asignado
    
        if (quotation.data.timestamp === timestamp) {
          setQuotationCode(quotation.code);
        }
      });
    
      setIsGenerating(false); // PDF generado
    };
    
    
    fetchQuotations();
  }, [timestamp, formData]);

  const generatePDF = () => {
    // Configurar el tamaño de la página en 'letter'
    const doc = new jsPDF({
      format: 'letter', // Establece el tamaño a carta (Letter)
      unit: 'mm',
    });

    // Parsear timestamp
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
        refNumber: quotationCode || "COT-XXX/AAAA/SC.",
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
        refNumber: quotationCode || "COT-XXX/AAAA/SC.",
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
        refNumber: quotationCode || "COT-XXX/AAAA/SC.",
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
    <>
      {isGenerating ? (
        <div>Abriendo PDF, por favor espera...</div> // Mostrar mensaje mientras se genera el PDF
      ) : (
        <iframe src={pdfUrl} width="100%" height="600px" title="Vista PDF" />
      )}
    </>
  );
};

export default PDFContent;
