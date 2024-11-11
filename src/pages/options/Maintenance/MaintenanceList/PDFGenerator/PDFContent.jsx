import React, { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { generateJalmecoPDF } from './GenerateJalmecoPDF';
import { generateTeknoPDF } from './GenerateTeknoPDF';
import { generateBasePDF } from './GenerateBasePDF';
import { generateJalmecoPDFsin } from './generateJalmecoPDFsin';
import { generateTeknoPDFsin } from './generateTeknoPDFsin';
import PDFToWordConverter from './PDFToWordConverter'; // Importar el convertidor de PDF a Word

const PDFContent = ({ recipe, type }) => {
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true); // Estado para verificar si se está generando el PDF
  const [hasConverted, setHasConverted] = useState(false); // Estado para evitar múltiples conversiones a Word

  // Usar useCallback para definir generatePDF una vez y evitar recrearla en cada render.
  const generatePDF = useCallback(() => {
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
    if (type.toLowerCase().includes('jalmeco') && type.toLowerCase().includes('con')) {
      generateJalmecoPDF(doc, recipe, config);
    } else if ((type.toLowerCase().includes('tekno') || type.toLowerCase().includes('tecno')) && type.toLowerCase().includes('con')) {
      generateTeknoPDF(doc, recipe, config);
    } else if (type.toLowerCase().includes('jalmeco') && type.toLowerCase().includes('sin')) {
      generateJalmecoPDFsin(doc, recipe, config);
    } else if ((type.toLowerCase().includes('tekno') || type.toLowerCase().includes('tecno')) && type.toLowerCase().includes('sin')) {
      generateTeknoPDFsin(doc, recipe, config);
    } else {
      generateBasePDF(doc, recipe, config);
    }

    return doc;
  }, [recipe, type]);

  const mergePDFs = async (generatedDoc) => {
    const pdfDoc = await PDFDocument.load(await generatedDoc.output('arraybuffer'));
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(pdfBlob);
  };

  const generateAndMergePDF = useCallback(async () => {
    const generatedDoc = generatePDF();
    const pdfBlobUrl = await mergePDFs(generatedDoc);
    setMergedPdfUrl(pdfBlobUrl); // Establece el URL del PDF generado
    setIsGenerating(false); // Indica que la generación ha terminado
  }, [generatePDF]);

  const handleSave = useCallback(() => {
    const documentIdPart = recipe.documentId.split('/')[0];
    const fileName = `0${documentIdPart}_Mantenimiento_${recipe.date.split('T')[0]}.pdf`;

    const downloadPDF = async () => {
      const generatedDoc = generatePDF();
      const pdfBlobUrl = await mergePDFs(generatedDoc);

      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = fileName;
      link.click();
    };

    downloadPDF();
  }, [generatePDF, recipe]);

  // Llama a la función para generar el PDF en todos los casos, ya que incluso si es Word, primero se necesita el PDF.
  useEffect(() => {
    generateAndMergePDF();
  }, [generateAndMergePDF]);

  return (
    <>
      {/* Mostrar el botón de guardar PDF solo si no es Word */}
      {!type.toLowerCase().includes('word') && (
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
            cursor: 'pointer',
          }}
        >
          Guardar PDF
        </button>
      )}

      {isGenerating ? (
        <div>{type.toLowerCase().includes('word') ? 'Generando Word...' : 'Abriendo PDF, por favor espera...'}</div> // Mensaje de carga mientras se genera el PDF o Word
      ) : (
        mergedPdfUrl && !type.toLowerCase().includes('word') && (
          <>
            <iframe
              src={`${mergedPdfUrl}#filename=hola.pdf`}
              className="h-[80vh] min-w-[80vw]"
              title="Vista PDF"
            />
          </>
        )
      )}

      {/* Convertir el PDF generado a Word solo una vez, sin mostrar el PDF */}
      {!hasConverted && type.toLowerCase().includes('word') && mergedPdfUrl && (
        <PDFToWordConverter
          recipe={recipe}
          fileName={`0${recipe.documentId.split('/')[0]}_Mantenimiento_${recipe.date.split('T')[0]}`}
          onConvert={() => setHasConverted(true)} // Marcar que la conversión ya se hizo
        />
      )}
    </>
  );
};

export default PDFContent;
