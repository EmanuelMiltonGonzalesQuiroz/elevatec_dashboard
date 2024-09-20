import 'jspdf-autotable';

// Función para verificar si se necesita un salto de página
const checkAddPage = (doc, currentY, additionalSpace = 20, config) => {
  const { bottomMargin = 20 } = config; // Obtener margen inferior de la configuración
  const pageHeight = doc.internal.pageSize.height;
  if (currentY + additionalSpace > pageHeight - bottomMargin) {
    doc.addPage();
    return 30; // Reinicia la posición Y en la nueva página
  }
  return currentY;
};

const TableComponent = ({ doc, formData, values, startY, config }) => {
  const { leftMargin = 20, rightMargin = 20, topMargin = 20, bottomMargin = 20 } = config; // Obtener márgenes desde config
  const pageWidth = doc.internal.pageSize.width;
  const tableWidth = pageWidth - leftMargin - rightMargin;

  // Definir los datos principales
  const valorFormateado = parseFloat(values["VAR7"].toFixed(2)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const valorFormateadoUnitario = parseFloat(values["VAR6"].toFixed(2)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rowsFromFormData = [
    ["Ascensor de pasajeros Eléctrico " + formData.Tipo.nombre, formData["08_Número de ascensores"], 0, valorFormateadoUnitario, valorFormateado],
  ];

  const metodosDePago = formData.MetodoDePago ? formData.MetodoDePago.split('_') : [];

  // Función para agregar un check si el método de pago está presente
  const getCheckOrEmpty = (metodo) => metodosDePago.includes(metodo) ? "X" : "";

  const tableData = [
    ["ITEM", "DESCRIPCIÓN", "CANT.", "VEL.", "CAP.", "PARADAS", "UNITARIO $us", "TOTAL $us"],
    ...rowsFromFormData.map((row, index) => [
      index + 1,
      row[0] || "0",
      row[1] || "0",
      formData?.Velocidad?.nombre || "0",
      formData["03_PERSONAS"] || "0",
      formData["01_PARADAS"] || "0",
      row[3] || "0",
      row[4] || "0",
    ]),
    [{ content: "Valor Total del Equipo Instalado y Funcionando", colSpan: 7, styles: { halign: 'center', fontStyle: 'bold' } }, valorFormateado || " "],
    [{ content: "TIPO DE PAGO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }, ""],
    [
      { content: "Efectivo", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, getCheckOrEmpty("Efectivo"),
      { content: "Depósito", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, getCheckOrEmpty("Deposito"),
      { content: "Dólar", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, getCheckOrEmpty("Dolar"),
      { content: "Bolivianos", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, getCheckOrEmpty("Bolivianos"),
    ]
  ];

  doc.autoTable({
    startY: startY + 10, // Añadir un poco de espacio desde el punto inicial
    head: [[{ content: "PRECIO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold', fillColor: [22, 160, 133] } }]],
    body: tableData,
    theme: 'grid',
    tableWidth: tableWidth, // Asegurar que respete los márgenes
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin }, // Márgenes verticales y horizontales
    styles: { overflow: 'linebreak' }, // Hacer que el texto largo haga saltos de línea
    pageBreak: 'auto', // Romper la tabla si no cabe en la página
  });

  // Añadir texto adicional "Opcionales Incluidos"
  let currentYPosition = doc.lastAutoTable.finalY + 10;
  const opcionales = [
    { nombre: "Aire acondicionado", key: "Aire_acondicionado" },
    { nombre: "Indicador de solo boton", key: "Indicador_de_solo_boton" },
    { nombre: "Pesacarga", key: "Pesacarga" },
    { nombre: "Pre Apertura de puertas", key: "Pre_Apertura_de_puertas" },
    { nombre: "Regenerador de energia", key: "Regenerador_de_energia" },
    { nombre: "Sistema de monitoreo", key: "Sistema_de_monitoreo" },
    { nombre: "Ventilación", key: "Ventiladores" },
  ];

  const opcionalesIncluidos = opcionales.filter(item => formData[item.key]?.valor !== 0 && formData[item.key]?.valor !== undefined);

  currentYPosition = checkAddPage(doc, currentYPosition, 10, config);
  doc.setFontSize(12).setFont("Helvetica", "bold").text("Opcionales Incluidos:", leftMargin, currentYPosition);
  currentYPosition += 10;

  if (opcionalesIncluidos.length > 0) {
    opcionalesIncluidos.forEach(opcional => {
      doc.setFontSize(12).setFont("Helvetica", "normal").text(`* ${opcional.nombre}`, leftMargin, currentYPosition);
      currentYPosition += 10;
    });
    currentYPosition += opcionalesIncluidos.length * 5;
  } else {
    doc.setFontSize(12).setFont("Helvetica", "normal").text("No se agregó ningún opcional", leftMargin, currentYPosition);
    currentYPosition += 20;
  }

  // Definir los datos de la tabla "FORMA DE PAGO"
  const cuota1 = (parseFloat(values["VAR7"]) * 0.3).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cuota2 = (parseFloat(values["VAR7"]) * 0.4).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cuota3 = (parseFloat(values["VAR7"]) * 0.2).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cuota4 = (parseFloat(values["VAR7"]) * 0.05).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cuota5 = (parseFloat(values["VAR7"]) * 0.05).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const total = valorFormateado;

  const paymentPlanData = [
    [
      { content: "CUOTA", styles: { halign: 'center', fontStyle: 'bold', cellWidth: 20 } },
      { content: "%", styles: { halign: 'center', fontStyle: 'bold', cellWidth: 20 } },
      { content: "DESCRIPCIÓN", colSpan: 5, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 40 } },
      { content: "Monto $us", styles: { halign: 'center', fontStyle: 'bold', cellWidth: 30 } }
    ],
    ["1", "30%", { content: "A ser pagado a firma de contrato", colSpan: 5 }, cuota1],
    ["2", "40%", { content: "A ser pagado a 60 días de firma de contrato", colSpan: 5 }, cuota2],
    ["3", "20%", { content: "A ser pagado antes de inicio de montaje del ascensor o con equipos en obra", colSpan: 5 }, cuota3],
    ["4", "5%", { content: "A ser pagado concluida la instalación mecánica de las puertas", colSpan: 5 }, cuota4],
    ["5", "5%", { content: "A ser pagado contra entrega en funcionamiento del ascensor", colSpan: 5 }, cuota5],
    [{ content: "TOTAL", colSpan: 7, styles: { fontStyle: 'bold' } }, { content: total, styles: { fontStyle: 'bold' } }]
  ];

  // Añadir la tabla "FORMA DE PAGO"
  currentYPosition = doc.lastAutoTable.finalY + 60;
  currentYPosition = checkAddPage(doc, currentYPosition, 60, config); // Verificar si se necesita nueva página

  doc.autoTable({
    startY: currentYPosition+10,
    head: [[{ content: "FORMA DE PAGO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold', fillColor: [22, 160, 133] } }]],
    body: paymentPlanData,
    theme: 'grid',
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 20 },
      2: { cellWidth: 40 },  // DESCRIPCIÓN
      3: { cellWidth: 30 }   // Monto $us
    },
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin }, // Márgenes
    styles: { overflow: 'linebreak' }, // Hacer que el texto largo haga saltos de línea
    pageBreak: 'auto', // Romper la tabla si no cabe en la página
  });

  // Añadir más textos después de la tabla con separación entre ellos y verificando espacio
  currentYPosition = doc.lastAutoTable.finalY + 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 20, config); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("TIEMPO DE ENTREGA:", leftMargin, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("El equipo se entregará funcionando en seis (6) meses a partir de la firma de contrato y recepción del anticipo establecido en el mismo.", leftMargin, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 20, config); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GARANTÍA DE EQUIPO O FABRICACIÓN", leftMargin, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Los equipos están cubiertos con una garantía de cinco (5) años contra defectos de fabricación...", leftMargin, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 20, config); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GARANTÍA DE INSTALACIÓN Y MONTAJE", leftMargin, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Jalmeco Ltda., responsable de la instalación y montaje...", leftMargin, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 20, config); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("OBLIGACIONES DEL COMPRADOR", leftMargin, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Todas las obras civiles adecuadas para la instalación de los ascensores...", leftMargin, currentYPosition, { maxWidth: 170, align: "justify" });

  // Devolver la última posición Y actualizada para que `Final` comience justo después
  return currentYPosition + 60;
};

export default TableComponent;
