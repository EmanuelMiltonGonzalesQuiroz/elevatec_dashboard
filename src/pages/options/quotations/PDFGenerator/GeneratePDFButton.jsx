import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const GeneratePDFButton = ({ config, stops, setPdfBlob }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    console.log("Configuración recibida en GeneratePDFButton:", config);
    console.log("Paradas recibidas en GeneratePDFButton:", stops);

    // Añadir contenido al PDF
    try {
      console.log("Generando PDF...");
      doc.setFontSize(12).setFont("Helvetica", "bold").text(config.headerText || "Encabezado", config.leftMargin || 20, config.topMargin || 20);
      doc.setFontSize(12).setFont("Helvetica", "normal");
      doc.text(`${config.city || "Ciudad"}, ${config.date || new Date().toLocaleDateString()}`, config.leftMargin || 20, config.topMargin + 30 || 50);
      doc.text(config.refNumber || "Referencia", config.leftMargin || 20, config.topMargin + 40 || 60);

      stops.forEach((stop, index) => {
        doc.text(`Piso de la parada ${index + 1}: ${stop}`, config.leftMargin || 20, config.topMargin + 50 + (index * 10) || 70 + (index * 10));
      });

      // Generar PDF y convertirlo a blob
      const pdfBlob = doc.output('blob');
      console.log("Blob generado:", pdfBlob);
      setPdfBlob(URL.createObjectURL(pdfBlob));
      console.log("PDF generado correctamente y configurado en pdfBlob");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <button
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      onClick={generatePDF}
    >
      Generar PDF
    </button>
  );
};

export default GeneratePDFButton;
