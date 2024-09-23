import 'jspdf-autotable';
import { convertNumberToWords } from '../../../../components/layout/convertNumberToWords';

const TechnicalSpecifications = ({ doc, formData, startY, config }) => {
  const { leftMargin = 20, rightMargin = 20, topMargin = 0, bottomMargin = 20 } = config;

  // Lista de contenidos que deben tener líneas horizontales
  const rowsWithLines = [
    "MÁQUINA DE TRACCIÓN",
    "1. ESPECIFICACIONES TÉCNICAS ASCENSOR"
  ];

  const technicalSpecifications = [
    [{ content: "Ciudad de Instalación:", styles: { fontStyle: 'bold' } }, formData['Ciudad']?.nombre || "Falta"],
    [{ content: "Marca:", styles: { fontStyle: 'bold' } }, "Elevatec"],
    [" ", { content: "Tecnología europea", colSpan: 1, styles: { halign: 'left' } }],
    [" ", { content: "Acabados y estética de cabina de fabricación boliviana", colSpan: 1, styles: { halign: 'left' } }],
    [{ content: "Cantidad:", styles: { fontStyle: 'bold' } }, convertNumberToWords(formData['08_Número de ascensores']) + " (" + formData['08_Número de ascensores'] + ") Ascensores sociales de alto tráfico"],
    [{ content: "Tipo:", styles: { fontStyle: 'bold' } }, "Eléctrico " + (formData['Tipo']?.nombre || "Falta") + " de Máquinas"],
    [{ content: "Capacidad:", styles: { fontStyle: 'bold' } }, `Ascensor de ${formData['03_PERSONAS']} pasajeros o ${formData['03_PERSONAS'] * 75} Kg.`],
    [{ content: "Velocidad:", styles: { fontStyle: 'bold' } }, formData['Velocidad']?.nombre || "Falta"],
    [{ content: "Control:", styles: { fontStyle: 'bold' } }, "Selectivo microprocesado simple"],
    [{ content: "Accionamiento:", styles: { fontStyle: 'bold' } }, "Voltaje y Frecuencia Variable VVVF"],
    [{ content: "N° Paradas/Entradas:", styles: { fontStyle: 'bold' } }, formData['01_PARADAS'] + "/" + formData['01_PARADAS'] || "Falta"],
    [{ content: "Pisos a atender:", styles: { fontStyle: 'bold' } }, formData['09_PISOS A ANTENDER'] || "Falta"],
    [{ content: "Embarque:", styles: { fontStyle: 'bold' } }, formData['Embarque']?.nombre + " (entrada y salida por el mismo lado)" || "Falta"],
    [{ content: "Datos eléctricos:", styles: { fontStyle: 'bold' } }, "Fuerza trifásica 380v – 50Hz / Iluminación 220v"],
    [{ content: "MÁQUINA DE TRACCIÓN", colSpan: 2, styles: { fontStyle: 'bold', halign: 'center' } }],
    [{ content: "Máquina de tracción:", styles: { fontStyle: 'bold' } }, formData['MaquinaTraccion']?.nombre || "Falta, sin engranajes, funcionamiento silencioso y ahorro energético"]
  ];

  const lineThickness = 0.2; // Grosor de la línea en mm

  doc.autoTable({
    startY: startY + 10,
    head: [[{ content: "1. ESPECIFICACIONES TÉCNICAS ASCENSOR", colSpan: 2, styles: { halign: 'left' } }]],
    body: technicalSpecifications,
    theme: 'plain',  // Sin bordes por defecto
    styles: {
      fontSize: 9,          // Tamaño de fuente más pequeño
      cellPadding: { top: 1, right: 2, bottom: 1, left: 2 }, // Reduce el padding de las celdas
      lineHeight: 1,        // Espacio entre líneas estándar
      minCellHeight: 0      // Permitir que las celdas tengan la altura mínima
    },
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
    pageBreak: 'auto',
    willDrawCell: function (data) {
      const rowContent = data.row.raw[0].content;

      // Dibujar líneas horizontales si el contenido está en la lista
      if (rowsWithLines.includes(rowContent)) {
        doc.setDrawColor(0);  // Color negro para las líneas
        doc.setLineWidth(lineThickness);
        const startX = data.cell.x;
        const endX = data.cell.x + data.cell.width;
        const y = data.cell.y + data.cell.height;

        // Dibujar las líneas superior e inferior
        doc.line(startX, data.cell.y, endX, data.cell.y); // Línea superior
        doc.line(startX, y, endX, y); // Línea inferior
      }
    },
    didParseCell: function (data) {
      // Reducir el padding específico de la celda
      data.cell.styles.cellPadding = { top: 1, right: 2, bottom: 1, left: 2 };
      // Permitir que la celda tenga una altura mínima menor
      data.cell.styles.minCellHeight = 0;
    },
    drawCell: function (cell, data) {
      const rowContent = data.row.raw[0].content;

      // Deshabilitar los bordes para las celdas del cuerpo, excepto para las filas que están en la lista
      if (!rowsWithLines.includes(rowContent) && data.row.section !== 'head') {
        return false;
      }
    }
  });

  return doc.lastAutoTable.finalY;
};

export default TechnicalSpecifications;
