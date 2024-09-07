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
  doc.setFontSize(12).setFont("Helvetica", "normal").text("* Pesacarga", 20, currentYPosition + 10);
  doc.text("* Ventilación", 20, currentYPosition + 20);

  // Definir los datos de la segunda tabla
  const paymentPlanData = [
    [{ content: "CUOTA", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "%", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "DESCRIPCIÓN", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, { content: "Monto $us", colSpan: 5, styles: { halign: 'center', fontStyle: 'bold' } }],
    ["1", "30%", { content: "A ser pagado a firma de contrato", colSpan: 5 }, ""],
    ["2", "40%", { content: "A ser pagado a 60 días de firma de contrato", colSpan: 5 }, ""],
    ["3", "20%", { content: "A ser pagado antes de inicio de montaje del ascensor o con equipos en obra", colSpan: 5 }, ""],
    ["4", "5%", { content: "A ser pagado concluida la instalación mecánica de las puertas", colSpan: 5 }, ""],
    ["5", "5%", { content: "A ser pagado contra entrega en funcionamiento del ascensor", colSpan: 5 }, ""],
    [{ content: "TOTAL", colSpan: 7, styles: { fontStyle: 'bold' } }]
  ];

  // Añadir la tabla de "FORMA DE PAGO"
  currentYPosition = doc.lastAutoTable.finalY + 40;
  currentYPosition = checkAddPage(doc, currentYPosition); // Verificar si se necesita nueva página
  doc.autoTable({
    startY: currentYPosition, // Debajo del texto "Opcionales Incluidos"
    head: [[{ content: "FORMA DE PAGO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }]],
    body: paymentPlanData,
    theme: 'grid',
  });

  // Añadir más textos después de la tabla con separación entre ellos y verificando espacio
  currentYPosition = doc.lastAutoTable.finalY + 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 30); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("TIEMPO DE ENTREGA:", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("El equipo se entregará funcionando en seis (6) meses a partir de la firma de contrato y recepción del anticipo establecido en el mismo.", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 40;
  currentYPosition = checkAddPage(doc, currentYPosition, 30); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GARANTÍA DE EQUIPO O FABRICACIÓN", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Los equipos están cubiertos con una garantía de cinco (5) años contra defectos de fabricación...", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 40;
  currentYPosition = checkAddPage(doc, currentYPosition, 30); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GARANTÍA DE INSTALACIÓN Y MONTAJE", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Jalmeco Ltda., responsable de la instalación y montaje...", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 40;
  currentYPosition = checkAddPage(doc, currentYPosition, 30); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("OBLIGACIONES DEL COMPRADOR", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Todas las obras civiles adecuadas para la instalación de los ascensores...", 20, currentYPosition, { maxWidth: 170, align: "justify" });
};

export default TableComponent;
