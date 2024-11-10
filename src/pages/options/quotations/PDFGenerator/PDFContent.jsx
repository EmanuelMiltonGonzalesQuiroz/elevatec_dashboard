import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { generateJalmecoPDF } from './GenerateJalmecoPDF';
import { generateTeknoPDF } from './GenerateTeknoPDF';
import { generateBasePDF } from './GenerateBasePDF';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../../../connection/firebase.js';
import { ref, getDownloadURL } from 'firebase/storage';
import { generateJalmecoPDFSin } from './GenerateJalmecoPDFSin.jsx';
import { generateTeknoPDFSin } from './GenerateTeknoPDFSin.jsx';

const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
};

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
    "transporte por el cliente": "OT" 
  };
  return cityMap[cityName.toLowerCase()] || "OT";
};

const PDFContent = ({ formData, values, timestamp, type }) => {
  const [quotationCode, setQuotationCode] = useState('');
  const [isFetchingQuotations, setIsFetchingQuotations] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
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
    
      const quotations = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp;
          const formattedDate = convertTimestampToDate(timestamp);
          return { id: doc.id, data, date: formattedDate };
        })
        .sort((a, b) => a.date - b.date);
    
      quotations.forEach((quotation, index) => {
        const year = quotation.data.timestamp.split('T')[0].split('_')[0];
        const city = formData[0]['Ciudad']?.nombre || 'Desconocido';
        const cityAbbreviation = getCityAbbreviation(city);
        quotation.code = `COT-${index + 101}/${year}/${cityAbbreviation}`;
    
        if (quotation.data.timestamp === timestamp) {
          setQuotationCode(quotation.code);
        }
      });
    
      setIsFetchingQuotations(false);
    };
    
    fetchQuotations();
  }, [formData, timestamp]);

  const generatePDF = () => {
    const doc = new jsPDF({
      format: 'letter',
      unit: 'mm',
    });

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

    const numAscensoresRaw = formData[0]['08_Número de ascensores'];
    const numAscensores = parseInt(numAscensoresRaw, 10);
    const cantidadAscensores = isNaN(numAscensores) || numAscensores < 1 ? 1 : numAscensores;
    const proposalTitle = `Presentación Propuesta Provisión e Instalación de ${cantidadAscensores} Ascensor${cantidadAscensores === 1 ? '' : 'es'}`;
    const city = formData[0]['Ciudad']?.nombre || "Ciudad Desconocida";
    const recipient = formData[0]['02_CLIENTE'] || "Cliente Desconocido";

    let config;
    if (type.toLowerCase().includes('jalmeco')) {
      config = {
        leftMargin: 20,
        rightMargin: 20,
        topMargin: 40,
        bottomMargin: 30,
        experience: 30,
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
        experience: 10,
        date: formattedDate,
        refNumber: quotationCode || "COT-XXX/AAAA/SC.",
        recipient: recipient,
        proposalTitle: proposalTitle
      };
    } else {
      config = {
        leftMargin: 20,
        rightMargin: 20,
        topMargin: 15,
        bottomMargin: 20,
        city: city,
        experience: 10,
        date: formattedDate,
        refNumber: quotationCode || "COT-XXX/AAAA/SC.",
        recipient: recipient,
        proposalTitle: proposalTitle
      };
    }

    if (type.toLowerCase().includes('sin_membretado_jalmeco')) {
      generateJalmecoPDFSin(doc, formData, values, config);
    } else if (type.toLowerCase().includes('sin_membretado_teknolift') || type.toLowerCase().includes('sin_membretado_tecnolift')) {
      generateTeknoPDFSin(doc, formData, values, config);
    } else if (type.toLowerCase().includes('jalmeco')) {
      generateJalmecoPDF(doc, formData, values, config);
    } else if (type.toLowerCase().includes('tekno') || type.toLowerCase().includes('tecno')) {
      generateTeknoPDF(doc, formData, values, config);
    } else {
      generateBasePDF(doc, formData, values, config);
    }

    return doc;
  };
  const fetchExtraPDF = async (url) => {
    try {
      const response = await fetch(url);
  
      // Verifica si la respuesta es correcta antes de intentar leer el cuerpo
      if (!response.ok) {
        throw new Error(`Error fetching PDF from ${url}: ${response.statusText}`);
      }
  
      // Solo lee el cuerpo una vez
      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
    } catch (error) {
      console.error('Error al obtener el PDF desde Firebase Storage:', error);
      throw error;
    }
  };
  

  const mergePDFs = async (generatedDoc) => {
    try {
      const pdfDoc = await PDFDocument.load(await generatedDoc.output('arraybuffer'));
      
      // Obtener URL del PDF adicional desde Firebase Storage
      const extraPdfUrl = await getDownloadURL(ref(storage, 'PDF/extraPdfJalmeco.pdf'));
      
      // Descargar y cargar el PDF adicional
      const extraPdfBytes = await fetchExtraPDF(extraPdfUrl);
      const extraPdfDoc = await PDFDocument.load(extraPdfBytes);
      
      const copiedPages = await pdfDoc.copyPages(extraPdfDoc, extraPdfDoc.getPageIndices());
      copiedPages.forEach(page => pdfDoc.addPage(page));

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      return URL.createObjectURL(pdfBlob);
    } catch (error) {
      console.error("Error al combinar los PDFs:", error);
      throw error;
    }
  };

  const generateAndMergePDF = async () => {
    const generatedDoc = generatePDF();
    const mergedPdfUrl = await mergePDFs(generatedDoc);
    return mergedPdfUrl;
  };

  const handleSave = () => {
    const numCotizaciones = quotationCode.split('-')[1];
    const nombreCliente = formData[0]['02_CLIENTE'] || "ClienteDesconocido";
    const cantidadPersonas = formData[0]['03_PERSONAS'] || "CantidadDesconocida";
    const cantidadParadas = formData[0]['01_PARADAS'] || "ParadasDesconocidas";

    const fileName = `Cotización ${numCotizaciones} Cliente ${nombreCliente} Personas ${cantidadPersonas} Paradas ${cantidadParadas}.pdf`;

    const downloadPDF = async () => {
      const generatedDoc = generatePDF();
      const pdfBlob = await mergePDFs(generatedDoc);
      const link = document.createElement('a');
      link.href = pdfBlob;
      link.download = fileName;
      link.click();
    };

    downloadPDF();
  };
  const handleDownloadWord = () => {
    const numCotizaciones = quotationCode.split('-')[1];
    const nombreCliente = formData[0]['02_CLIENTE'] || "ClienteDesconocido";
    const cantidadPersonas = formData[0]['03_PERSONAS'] || "CantidadDesconocida";
    const cantidadParadas = formData[0]['01_PARADAS'] || "ParadasDesconocidas";

    const fileName = `Cotización ${numCotizaciones} Cliente ${nombreCliente} Personas ${cantidadPersonas} Paradas ${cantidadParadas}.docx`;

    const downloadWord = async () => {
        const generatedDoc = generatePDF(); // Genera el documento PDF
        const pdfBlob = new Blob([await generatedDoc.output('arraybuffer')], { type: 'application/pdf' });
        const formData = new FormData();
        formData.append('file', pdfBlob, 'generated.pdf');

        try {
            const response = await fetch('http://127.0.0.1:8000/convert', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const wordBlob = await response.blob();
                const wordUrl = window.URL.createObjectURL(wordBlob);

                const link = document.createElement('a');
                link.href = wordUrl;
                link.setAttribute('download', fileName);  // Usa el nombre dinámico
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(wordUrl);
            } else {
                console.error('Error en la conversión del archivo PDF a Word.');
            }
        } catch (error) {
            console.error('Error en la solicitud de conversión a Word:', error);
        }
    };

    downloadWord();
};

  

  useEffect(() => {
    const generateMergedPDF = async () => {
      if (!isFetchingQuotations) {
        const pdfUrl = await generateAndMergePDF();
        setMergedPdfUrl(pdfUrl);
        setIsGenerating(false);
        
        if (isMobileDevice() && pdfUrl) {
          window.open(pdfUrl, '_blank');
        }
      }
    };

    generateMergedPDF();
  }, [timestamp, formData[0], isFetchingQuotations]);

  return (
    <>
      <button 
        onClick={type.toLowerCase().includes('word') ? handleDownloadWord : handleSave}
        style={{
          width: '100%', 
          backgroundColor: type.toLowerCase().includes('word') ? 'blue' : 'green', 
          color: 'white', 
          textAlign: 'center', 
          padding: '10px', 
          fontSize: '16px',
          border: 'none',
          cursor: 'pointer'
        }}
      > 
        {type.toLowerCase().includes('word') ? 'Guardar Word' : 'Guardar PDF'}
      </button> 
  
      {!type.toLowerCase().includes('word') && (
        isGenerating || isFetchingQuotations ? (
          <div>Abriendo PDF, por favor espera...</div> 
        ) : (
          mergedPdfUrl && <iframe src={`${mergedPdfUrl}#filename=hola.pdf`} className="h-[80vh] min-w-[80vw]" title="Vista PDF" />
        )
      )}
    </>
  );
  
};

export default PDFContent;