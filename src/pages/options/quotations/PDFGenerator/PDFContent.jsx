import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { generateJalmecoPDF } from './GenerateJalmecoPDF';
import { generateTeknoPDF } from './GenerateTeknoPDF';
import { generateBasePDF } from './GenerateBasePDF';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../connection/firebase.js';
import extraPDFJalmeco from '../../../../assets/images/extraPdfJalmeco.pdf'; 

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
  const [quotationCode, setQuotationCode] = useState('');
  const [isFetchingQuotations, setIsFetchingQuotations] = useState(true); // Nuevo estado para controlar cuando se terminen de obtener las cotizaciones
  const [isGenerating, setIsGenerating] = useState(true); // Estado para mostrar el mensaje de espera
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

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
    
        if (quotation.data.timestamp === timestamp) {
          setQuotationCode(quotation.code);
        }
      });
    
      setIsFetchingQuotations(false); // Finaliza el proceso de obtención de cotizaciones
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
        rightMargin: 20,
        topMargin: 40,
        bottomMargin: 35,
        city: city,
        date: formattedDate,
        refNumber: quotationCode || "COT-XXX/AAAA/SC.",
        recipient: recipient,
        proposalTitle: proposalTitle
      };
    } else if (type.toLowerCase().includes('tekno') || type.toLowerCase().includes('tecno')) {
      config = {
        leftMargin: 20,
        rightMargin: 45,
        topMargin: 40,
        bottomMargin: 30,
        city: city,
        date: formattedDate,
        refNumber: quotationCode || "COT-XXX/AAAA/SC.",
        recipient: recipient,
        proposalTitle: proposalTitle
      };
    } else {
      config = {
        leftMargin: 20,
        rightMargin: 20,
        topMargin: 30,
        bottomMargin: 20,
        city: city,
        date: formattedDate,
        refNumber: quotationCode || "COT-XXX/AAAA/SC.",
        recipient: recipient,
        proposalTitle: proposalTitle
      };
    }

    if (type.toLowerCase().includes('jalmeco')) {
      generateJalmecoPDF(doc, formData, values, config);
    } else if (type.toLowerCase().includes('tekno') || type.toLowerCase().includes('tecno')) {
      generateTeknoPDF(doc, formData, values, config);
    } else {
      generateBasePDF(doc, formData, values, config);
    }

    return doc;
  };

  const mergePDFs = async (generatedDoc) => {
    const pdfDoc = await PDFDocument.load(await generatedDoc.output('arraybuffer'));
    const extraPDFBytes = await fetch(extraPDFJalmeco).then(res => res.arrayBuffer());
    const extraPdf = await PDFDocument.load(extraPDFBytes);

    const copiedPages = await pdfDoc.copyPages(extraPdf, extraPdf.getPageIndices());
    copiedPages.forEach(page => pdfDoc.addPage(page));

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(pdfBlob);
  };

  const generateAndMergePDF = async () => {
    const generatedDoc = generatePDF();
    const mergedPdfUrl = await mergePDFs(generatedDoc);
    return mergedPdfUrl;
  };

  useEffect(() => {
    const generateMergedPDF = async () => {
      if (!isFetchingQuotations) { // Esperar hasta que las cotizaciones se obtengan
        const pdfUrl = await generateAndMergePDF();
        setMergedPdfUrl(pdfUrl);
        setIsGenerating(false); // Finalizar el estado de generación del PDF
      }
    };

    generateMergedPDF();
  }, [timestamp, formData, isFetchingQuotations]);

  return (
    <>
      {isGenerating || isFetchingQuotations ? (
        <div>Abriendo PDF, por favor espera...</div> 
      ) : (
        mergedPdfUrl && <iframe src={mergedPdfUrl} width="100%" height="600px" title="Vista PDF" />
      )}
    </>
  );
};

export default PDFContent;
