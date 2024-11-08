import 'jspdf-autotable';
import { convertNumberToWords } from '../../../../components/layout/convertNumberToWords';

// Función para verificar si se necesita un salto de página
const checkAddPage = (doc, currentY, additionalSpace = 20, config) => {
  const { bottomMargin = 20 } = config; // Obtener margen inferior de la configuración
  const pageHeight = doc.internal.pageSize.height;
  if (currentY + additionalSpace > pageHeight - bottomMargin) {
    doc.addPage();
    return config.topMargin +10 || 30; // Reinicia la posición Y en la nueva página, respetando el margen superior
  }
  return currentY;
};

const TechnicalSpecifications = ({ doc, formData, startY, config }) => {
  const { leftMargin = 20, rightMargin = 20, topMargin = 30, bottomMargin = 20 } = config;

  // Lista de contenidos que deben tener líneas horizontales
  const rowsWithLines = [
    "MÁQUINA DE TRACCIÓN",
    "1. ESPECIFICACIONES TÉCNICAS ASCENSOR"
  ];

  let currentYPosition = startY;

  formData.forEach((dataItem, index) => {
    currentYPosition = checkAddPage(doc, currentYPosition, 50, config); // Verificar si se necesita nueva página

    // Añadir título
    doc.setFontSize(12).setFont("Helvetica", "bold").text(`Especificaciones Técnicas N° ${index + 1}`, leftMargin, currentYPosition);
    currentYPosition += 5;

    const technicalSpecifications = [
      [{ content: "Ciudad de Instalación:", styles: { fontStyle: 'bold' } }, dataItem['Ciudad']?.nombre || "Falta"],
      [{ content: "Marca:", styles: { fontStyle: 'bold' } }, "Elevatec"],
      [" ", { content: "Tecnología europea", colSpan: 1, styles: { halign: 'left' } }],
      [" ", { content: "Acabados y estética de cabina de fabricación boliviana", colSpan: 1, styles: { halign: 'left' } }],
      [{ content: "Cantidad:", styles: { fontStyle: 'bold' } }, convertNumberToWords(dataItem['08_Número de ascensores']) + " (" + dataItem['08_Número de ascensores'] + ") Ascensores sociales de alto tráfico"],
      [{ content: "Tipo:", styles: { fontStyle: 'bold' } }, "Eléctrico " + (dataItem['Tipo']?.nombre || "Falta") + " de Máquinas"],
      [{ content: "Capacidad:", styles: { fontStyle: 'bold' } }, `Ascensor de ${dataItem['03_PERSONAS']} pasajeros o ${dataItem['03_PERSONAS'] * 75} Kg.`],
      [{ content: "Velocidad:", styles: { fontStyle: 'bold' } }, dataItem['Velocidad']?.nombre || "Falta"],
      [{ content: "Control:", styles: { fontStyle: 'bold' } }, "Selectivo microprocesado simple"],
      [{ content: "Accionamiento:", styles: { fontStyle: 'bold' } }, "Voltaje y Frecuencia Variable VVVF"],
      [{ content: "N° Paradas/Entradas:", styles: { fontStyle: 'bold' } }, dataItem['01_PARADAS'] + "/" + dataItem['01_PARADAS'] || "Falta"],
      [{ content: "Pisos a atender:", styles: { fontStyle: 'bold' } }, dataItem['09_PISOS A ANTENDER'] || "Falta"],
      [{ content: "Embarque:", styles: { fontStyle: 'bold' } }, dataItem['Embarque']?.nombre + " (entrada y salida por el mismo lado)" || "Falta"],
      [{ content: "Datos eléctricos:", styles: { fontStyle: 'bold' } }, "Fuerza trifásica 380v – 50Hz / Iluminación 220v"],
      [{ content: "MÁQUINA DE TRACCIÓN", colSpan: 2, styles: { fontStyle: 'bold', halign: 'center' } }],
      [{ content: "Máquina de tracción:", styles: { fontStyle: 'bold' } }, dataItem['MaquinaTraccion']?.nombre || "Falta, sin engranajes, funcionamiento silencioso y ahorro energético"]
    ];

    const lineThickness = 0.2; // Grosor de la línea en mm

    doc.autoTable({
      startY: currentYPosition,
      head: [[{ content: "1. ESPECIFICACIONES TÉCNICAS ASCENSOR", colSpan: 2, styles: { halign: 'left' } }]],
      body: technicalSpecifications,
      theme: 'plain',  // Sin bordes por defecto
      styles: {
        fontSize: 9,
        cellPadding: { top: 1, right: 2, bottom: 1, left: 2 },
        lineHeight: 1,
        minCellHeight: 0
      },
      margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
      pageBreak: 'auto',
      willDrawCell: function (data) {
        const rowContent = data.row.raw[0].content;

        if (rowsWithLines.includes(rowContent)) {
          doc.setDrawColor(0);
          doc.setLineWidth(lineThickness);
          const startX = data.cell.x;
          const endX = data.cell.x + data.cell.width;
          const y = data.cell.y + data.cell.height;

          doc.line(startX, data.cell.y, endX, data.cell.y); // Línea superior
          doc.line(startX, y, endX, y); // Línea inferior
        }
      },
      didParseCell: function (data) {
        data.cell.styles.cellPadding = { top: 1, right: 2, bottom: 1, left: 2 };
        data.cell.styles.minCellHeight = 0;
      },
      drawCell: function (cell, data) {
        const rowContent = data.row.raw[0].content;

        if (!rowsWithLines.includes(rowContent) && data.row.section !== 'head') {
          return false;
        }
      }
    });

    currentYPosition = doc.lastAutoTable.finalY + 10;
  });

  return doc.lastAutoTable.finalY;
};

export default TechnicalSpecifications;
