import 'jspdf-autotable';

// Función para verificar si se necesita un salto de página
const checkAddPage = (doc, currentY, additionalSpace = 20) => {
  const pageHeight = doc.internal.pageSize.height;
  if (currentY + additionalSpace > pageHeight) {
    doc.addPage();
    return 30; // Reinicia la posición Y en la nueva página
  }
  return currentY;
};

const TableComponent = ({ doc, formData, values, startY }) => {
  // Definir los datos principales
  const valorFormateado = parseFloat(values["VAR7"].toFixed(2)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const tableData = [
    ["ITEM", "DESCRIPCIÓN", "CANT.", "VEL.", "CAP.", "PARADAS", "UNITARIO $us", "TOTAL $us"],
    ["10", "10", "10", "10", "10", "10", "10", "10"],
    [{ content: "Valor Total del Equipo Instalado y Funcionando", colSpan: 7, styles: { halign: 'center', fontStyle: 'bold' } }, valorFormateado || " "],
    [{ content: "TIPO DE PAGO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }, ""],
    [{ content: "Efectivo", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, "", { content: "Depósito", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, "", { content: "Dólar", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, "", { content: "Bolivianos", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, ""],
  ];

  // Añadir la tabla principal
  doc.autoTable({
    startY: startY, // Usar startY proporcionado para la posición inicial
    head: [[{ content: "PRECIO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }]],
    body: tableData,
    theme: 'grid',
  });

  // Añadir texto adicional "Opcionales Incluidos"
  let currentYPosition = doc.lastAutoTable.finalY + 10;
  currentYPosition = checkAddPage(doc, currentYPosition); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("Opcionales Incluidos:", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("* Pesacarga", 20, currentYPosition);
  currentYPosition += 10;
  doc.text("* Ventilación", 20, currentYPosition);

  // Definir los datos de la segunda tabla
  const paymentPlanData = [
    [
      { content: "CUOTA", styles: { halign: 'center', fontStyle: 'bold', cellWidth: 20 } },
      { content: "%", styles: { halign: 'center', fontStyle: 'bold', cellWidth: 20 } },
      { content: "DESCRIPCIÓN", colSpan: 5, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 40 } },
      { content: "Monto $us", styles: { halign: 'center', fontStyle: 'bold', cellWidth: 30 } }
    ],
    ["1", "30%", { content: "A ser pagado a firma de contrato", colSpan: 5 }, " "],
    ["2", "40%", { content: "A ser pagado a 60 días de firma de contrato", colSpan: 5 }, " "],
    ["3", "20%", { content: "A ser pagado antes de inicio de montaje del ascensor o con equipos en obra", colSpan: 5 }, " "],
    ["4", "5%", { content: "A ser pagado concluida la instalación mecánica de las puertas", colSpan: 5 }, " "],
    ["5", "5%", { content: "A ser pagado contra entrega en funcionamiento del ascensor", colSpan: 5 }, " "],
    [{ content: "TOTAL", colSpan: 7, styles: { fontStyle: 'bold' } }, { content: " ", styles: { fontStyle: 'bold' } }]
  ];
  
  // Add the "FORMA DE PAGO" table
  currentYPosition = doc.lastAutoTable.finalY + 40;
  currentYPosition = checkAddPage(doc, currentYPosition); // Check if a new page is needed
  doc.autoTable({
    startY: currentYPosition, 
    head: [[{ content: "FORMA DE PAGO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }]],
    body: paymentPlanData,
    theme: 'grid',
    columnStyles: {
      0: { cellWidth: 20 },  // CUOTA
      1: { cellWidth: 20 },  // %
      2: { cellWidth: 40 }, // DESCRIPCIÓN
      3: { cellWidth: 30 }   // Monto $us
    }
  });
  

  // Añadir más textos después de la tabla con separación entre ellos y verificando espacio
  currentYPosition = doc.lastAutoTable.finalY + 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 30); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("TIEMPO DE ENTREGA:", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("El equipo se entregará funcionando en seis (6) meses a partir de la firma de contrato y recepción del anticipo establecido en el mismo.", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 30); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GARANTÍA DE EQUIPO O FABRICACIÓN", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Los equipos están cubiertos con una garantía de cinco (5) años contra defectos de fabricación...", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 30); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GARANTÍA DE INSTALACIÓN Y MONTAJE", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Jalmeco Ltda., responsable de la instalación y montaje...", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 30); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("OBLIGACIONES DEL COMPRADOR", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Todas las obras civiles adecuadas para la instalación de los ascensores...", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  // Devolver la última posición Y actualizada para que `Final` comience justo después
  return currentYPosition + 20;
};

export default TableComponent;
