import 'jspdf-autotable';
import { convertNumberToWords } from '../../../../components/layout/convertNumberToWords';

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

  let totalVAR7 = 0;
  let rowsFromFormData = [];

  values.forEach((value, n) => {
    // Añadir un título para identificar la cotización
    startY += 10; // Incrementar la posición Y para la siguiente sección

    // Definir los datos principales
    const valorFormateado = parseFloat(value["VAR7"].toFixed(2)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const var7 = value["VAR7"].toFixed(2);
    const [entero, decimales] = var7.split('.');
    const valorFormateadoUnitario = parseFloat(value["VAR6"].toFixed(2)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Agregar la fila a la colección
    rowsFromFormData.push([
      `Ascensor de pasajeros Eléctrico ${formData[n].Tipo.nombre}`,
      formData[n]["08_Número de ascensores"],
      formData[n]?.Velocidad?.nombre || "0",
      formData[n]["03_PERSONAS"] * 75 + "Kg." || "0",
      formData[n]["01_PARADAS"] || "0",
      valorFormateadoUnitario,
      valorFormateado
    ]);

    // Añadir texto adicional "Opcionales Incluidos"
    let currentYPosition = startY + 10;
    const opcionales = [
      { nombre: "Aire acondicionado", key: "Aire_acondicionado" },
      { nombre: "Indicador de solo boton", key: "Indicador_de_solo_boton" },
      { nombre: "Pesacarga", key: "Pesacarga" },
      { nombre: "Pre Apertura de puertas", key: "Pre_Apertura_de_puertas" },
      { nombre: "Regenerador de energia", key: "Regenerador_de_energia" },
      { nombre: "Sistema de monitoreo", key: "Sistema_de_monitoreo" },
      { nombre: "Ventilación", key: "Ventiladores" }
    ];

    const opcionalesIncluidos = opcionales.filter(item => formData[n][item.key]?.valor !== 0 && formData[n][item.key]?.valor !== undefined);

    // Añadir el título
    currentYPosition = checkAddPage(doc, currentYPosition, 10, config);
    doc.setFontSize(12).setFont("Helvetica", "bold").text(`Opcionales Incluidos en la Cotización N° ${n + 1}:`, leftMargin, currentYPosition);

    // Crear la tabla con los opcionales incluidos
    const opcionalesRows = opcionalesIncluidos.length > 0
      ? opcionalesIncluidos.map(opcional => [`* ${opcional.nombre}`])
      : [["No se agregó ningún opcional"]];

    // Generar la tabla con 'plain' y evitar la división de filas
    doc.autoTable({
      startY: currentYPosition + 5,
      body: opcionalesRows,
      theme: 'plain',  // Tabla sin bordes
      margin: { left: leftMargin },
      pageBreak: 'auto',  // Saltos automáticos de página
      rowPageBreak: 'avoid',  // Evitar dividir celdas entre páginas
      styles: { fontSize: 12, font: "Helvetica", overflow: 'linebreak' }
    });

    // Actualizar la posición Y después de la tabla
    currentYPosition = doc.lastAutoTable.finalY + 10;
    startY = currentYPosition;

    totalVAR7 += parseFloat(value["VAR7"]);
  });

  const metodoDePago = formData[0]["MetodoDePago"];

  // Check if there's a discount
  let totalBeforeDiscount = totalVAR7;
  let totalAfterDiscount = totalVAR7;
  let hasDiscount = false;

  metodoDePago.forEach((cuota) => {
    if (cuota.nombre.toLowerCase() === 'descuento') {
      hasDiscount = true;
      const descuento = totalVAR7 * (cuota.porcentaje / 100);
      totalAfterDiscount -= descuento;
    }
  });

  const totalFormatted = totalAfterDiscount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const totalInWords = convertNumberToWords(Math.floor(totalAfterDiscount));
  const decimals = ((totalAfterDiscount % 1) * 100).toFixed(0);

  // Generar la tabla PRECIO con todos los items
  let tableData = [
    ["ITEM", "DESCRIPCIÓN", "CANT.", "VEL.", "CAP.", "PARADAS", "UNITARIO $us", "TOTAL $us"],
    ...rowsFromFormData.map((row, index) => [
      index + 1,
      row[0],
      row[1],
      row[2],
      row[3],
      row[4],
      row[5],
      row[6]
    ]),
    [{ content: "Valor Total del Equipo Instalado y Funcionando", colSpan: 7, styles: { halign: 'center', fontStyle: 'bold' } }, totalFormatted],
    [{
      content: `Son: ${totalInWords} ${decimals}/100 Dólares Americanos`,
      colSpan: 7,
      styles: { halign: 'center', fontStyle: 'bold' }
    }, " "],
    [{ content: "TIPO DE PAGO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }, " "],
    [
      { content: "Efectivo", styles: { halign: 'center', fontStyle: 'bold' } },
      { content: "Depósito", styles: { halign: 'center', fontStyle: 'bold' } },
      { content: "Dólar", styles: { halign: 'center', fontStyle: 'bold' } },
      { content: "Bolivianos", styles: { halign: 'center', fontStyle: 'bold' } },
    ]
  ];

  doc.autoTable({
    startY: startY + 10, // Añadir un poco de espacio desde el punto inicial
    head: [[{ content: "PRECIO", colSpan: 8, styles: { halign: 'left', fontStyle: 'boldunderline', fillColor: [255,255, 255], textColor: [0, 0, 0] } }]],
    body: tableData,
    theme: 'grid',
    tableWidth: tableWidth, // Asegurar que respete los márgenes
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin }, // Márgenes verticales y horizontales
    styles: { overflow: 'linebreak' }, // Hacer que el texto largo haga saltos de línea
    pageBreak: 'avoid', // Romper la tabla si no cabe en la página
  });

  let currentYPosition = doc.lastAutoTable.finalY + 10;

  currentYPosition = checkAddPage(doc, currentYPosition, 60, config); // Verificar si se necesita nueva página

  const paymentPlanData = [
    [
      { content: "CUOTA", styles: { halign: 'center', fontStyle: 'bold' } },
      { content: "%", styles: { halign: 'center', fontStyle: 'bold' } },
      { content: "DESCRIPCIÓN", colSpan: 5, styles: { halign: 'center', fontStyle: 'bold' } },
      { content: "Monto $us", styles: { halign: 'center', fontStyle: 'bold' } }
    ],
  ];

  metodoDePago.forEach((cuota, index) => {
    const porcentaje = cuota.porcentaje;
    const monto = (totalBeforeDiscount * (porcentaje / 100)).toFixed(2);
    const montoFormatted = parseFloat(monto).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    paymentPlanData.push([
      (index + 1).toString(),
      `${porcentaje}%`,
      { content: cuota.nombre, colSpan: 5 },
      montoFormatted,
    ]);
  });

  if (hasDiscount) {
    paymentPlanData.push([
      { content: "TOTAL ANTES DEL DESCUENTO", colSpan: 7, styles: { fontStyle: 'bold' } },
      { content: totalBeforeDiscount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { fontStyle: 'bold' } }
    ]);
    paymentPlanData.push([
      { content: "TOTAL DESPUÉS DEL DESCUENTO", colSpan: 7, styles: { fontStyle: 'bold' } },
      { content: totalFormatted, styles: { fontStyle: 'bold' } }
    ]);
  } else {
    paymentPlanData.push([
      { content: "TOTAL", colSpan: 7, styles: { fontStyle: 'bold' } },
      { content: totalFormatted, styles: { fontStyle: 'bold' } }
    ]);
  }

  doc.autoTable({
    startY: currentYPosition+10,
    head: [[{ content: "FORMA DE PAGO", colSpan: 8, styles: { halign: 'left', fontStyle: 'boldunderline', fillColor: [255,255, 255], textColor: [0, 0, 0] } }]],
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
    pageBreak: 'avoid', // Romper la tabla si no cabe en la página
  });
  currentYPosition = doc.lastAutoTable.finalY + 5;

  const termsData = [
    [
      { content: "TIEMPO DE ENTREGA:", styles: { fontStyle: 'bold', fontSize: 12 } }
    ],
    [
      { content: "El equipo se entregará funcionando en Siete (7) meses a partir de la firma de contrato y recepción del anticipo establecido en el mismo.", styles: { fontSize: 12 } }
    ],
    [
      { content: "GARANTÍA DE EQUIPO O FABRICACIÓN", styles: { fontStyle: 'bold', fontSize: 12 } }
    ],
    [
      { content: "Los equipos están cubiertos con una garantía de cinco (5) años contra defectos de fabricación, a partir de la puesta en funcionamiento de los ascensores. Quedan excluidos de la garantía los daños ocasionados por uso indebido, daños maliciosos ocasionados por terceros, daños por incidencias de agua, rayos o tormentas y otros no relacionados con defectos de fabricación.", styles: { fontSize: 12 } }
    ],
    [
      { content: "GARANTÍA DE INSTALACIÓN Y MONTAJE", styles: { fontStyle: 'bold', fontSize: 12 } }
    ],
    [
      { content: "Jalmeco Ltda., responsable de la instalación y Montaje, realizará el mantenimiento preventivo y correctivo de forma gratuita por Dieciocho (18) meses calendario, tiempo en el cual subsanará cualquier defecto en forma gratuita por el tiempo indicado.", styles: { fontSize: 12 } }
    ],
    [
      { content: "OBLIGACIONES DEL COMPRADOR", styles: { fontStyle: 'bold', fontSize: 12 } }
    ],
    [
      { content: "Todas las obras civiles adecuadas para la instalación de los ascensores, así como la instalación eléctrica hasta el cuadro de maniobra del Ascensor, serán realizadas por cuenta del comprador.", styles: { fontSize: 12 } }
    ],
    [
      { content: "VALIDEZ DE LA OFERTA", styles: { fontStyle: 'bold', textDecoration: 'underline', fontSize: 12 } }
    ],
    [
      { content: "La oferta tiene una validez de siete (7) días a partir de la fecha, concluido este periodo, se tendrá que realizar una actualización de la presente cotización.", styles: { fontSize: 12 } }
    ],
    [{ content: " ", styles: { minCellHeight: 25 } }],
    [{ content: "Ing. Frank Jaldin Navia", styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 } }],
    [{ content: "GERENTE REGIONAL", styles: { halign: 'center', fontSize: 12 } }]
  ];

  doc.autoTable({
    startY: currentYPosition,
    body: termsData,
    theme: 'plain',
    tableWidth: tableWidth,
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
    styles: { overflow: 'linebreak', fontSize: 12 },
    pageBreak: 'auto',
    rowPageBreak: 'avoid',
  });

  currentYPosition = doc.lastAutoTable.finalY;

  return doc.lastAutoTable.finalY + 10;
};

export default TableComponent;
