import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { generateJalmecoPDF } from './GenerateJalmecoPDF';
import { generateTeknoPDF } from './GenerateTeknoPDF';
import { generateBasePDF } from './GenerateBasePDF';

const PDFContent = ({ recipe, type }) => {
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true); // Estado para verificar si se está generando el PDF

  const generatePDF = () => {
    const doc = new jsPDF({
      format: 'letter',
      unit: 'mm',
    });

    // Configuración básica que se mandará a los generadores de PDF
    let config;
    if (type.toLowerCase().includes('jalmeco')) {
      config = {
        leftMargin: 20,
        rightMargin: 20,
        topMargin: 40,
        bottomMargin: 30,
        experience: 30,
      };
    } else if (type.toLowerCase().includes('tekno') || type.toLowerCase().includes('tecno')) {
      config = {
        leftMargin: 20,
        rightMargin: 45,
        topMargin: 40,
        bottomMargin: 30,
      };
    } else {
      config = {
        leftMargin: 20,
        rightMargin: 20,
        topMargin: 15,
        bottomMargin: 20,
      };
    }

    // Selecciona el tipo de PDF a generar y pasa los datos necesarios
    if (type.toLowerCase().includes('jalmeco')) {
      generateJalmecoPDF(doc, recipe, config);
    } else if (type.toLowerCase().includes('tekno') || type.toLowerCase().includes('tecno')) {
      generateTeknoPDF(doc, recipe, config);
    } else {
      generateBasePDF(doc, recipe, config);
    }

    return doc;
  };

  const mergePDFs = async (generatedDoc) => {
    const pdfDoc = await PDFDocument.load(await generatedDoc.output('arraybuffer'));
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(pdfBlob);
  };

  const generateAndMergePDF = async () => {
    const generatedDoc = generatePDF();
    const pdfBlobUrl = await mergePDFs(generatedDoc);
    setMergedPdfUrl(pdfBlobUrl); // Establece el URL del PDF generado
    setIsGenerating(false); // Indica que la generación ha terminado
  };

  const handleSave = () => {
    const fileName = `Mantenimiento_${recipe.date.split('T')[0]}.pdf`;

    const downloadPDF = async () => {
      const generatedDoc = generatePDF();
      const pdfBlobUrl = await mergePDFs(generatedDoc);
      
      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = fileName;
      link.click();
    };

    downloadPDF();
  };

  // Llama a la función para generar el PDF cuando se monte el componente
  useEffect(() => {
    generateAndMergePDF();
  }, []);

  return (
    <>
      <button 
        onClick={handleSave} 
        style={{
          width: '100%', 
          backgroundColor: 'green', 
          color: 'white', 
          textAlign: 'center', 
          padding: '10px', 
          fontSize: '16px',
          border: 'none',
          cursor: 'pointer'
        }}>
        Guardar
      </button>

      {isGenerating ? (
        <div>Abriendo PDF, por favor espera...</div> // Mensaje de carga mientras se genera el PDF
      ) : (
        mergedPdfUrl && (
          <iframe 
            src={`${mergedPdfUrl}#filename=hola.pdf`} 
            width="100%" 
            height="600px" 
            title="Vista PDF" 
          />
        )
      )}
    </>
  );
};

export default PDFContent;
