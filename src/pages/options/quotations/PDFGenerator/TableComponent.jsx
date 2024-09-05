import 'jspdf-autotable';

const TableComponent = ({ doc, formData, values  }) => {
  // Definir los datos principales
  const valorFormateado = parseFloat(values["VAR7"].toFixed(2)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });



  const tableData = [
    ["ITEM", "DESCRIPCIÓN", "CANT.", "VEL.", "CAP.", "PARADAS", "UNITARIO $us", "TOTAL $us"],
    ["10", "10", "10", "10", "10", "10", "10", "10"],
    [{ content: "Valor Total del Equipo Instalado y Funcionando", colSpan: 7, styles: { halign: 'center', fontStyle: 'bold' } }, valorFormateado || " "],
    [{ content: "TIPO DE PAGO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }, ""],
    [{ content: "Efectivo", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },"",{ content: "Depósito", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },"",{ content: "Dólar", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },"",{ content: "Bolivianos", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } },""],
        
  ];

  // Añadir la tabla principal
  doc.autoTable({ 

    startY: 20,
    head: [[{ content: "PRECIO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }]],
    body: tableData,
    theme: 'grid',
  });

  // Añadir texto adicional "Opcionales Incluidos"
  const currentYPosition = doc.lastAutoTable.finalY + 10;
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
  doc.autoTable({
    startY: currentYPosition + 40, // Debajo del texto "Opcionales Incluidos"
    head: [[{ content: "FORMA DE PAGO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }]],
    body: paymentPlanData,
    theme: 'grid',
  });

  // Añadir más textos después de la tabla
  const finalYPosition = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(12).setFont("Helvetica", "bold").text("TIEMPO DE ENTREGA:", 20, finalYPosition);
  doc.setFontSize(12).setFont("Helvetica", "normal").text("El equipo se entregará funcionando en seis (6) meses a partir de la firma de contrato y recepción del anticipo establecido en el mismo.", 20, finalYPosition + 10, { maxWidth: 170, align: "justify" });

  const warrantyYPosition = doc.lastAutoTable.finalY + 40;
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GARANTÍA DE EQUIPO O FABRICACIÓN", 20, warrantyYPosition);
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Los equipos están cubiertos con una garantía de cinco (5) años contra defectos de fabricación, a partir de la puesta en funcionamiento de los ascensores. Quedan excluidos de la garantía los daños ocasionados por uso indebido, daños maliciosos ocasionados por terceros, daños por incidencias de agua, suministro de energía eléctrica deficiente, rayos o tormentas y otros no relacionados con defectos de fabricación.", 20, warrantyYPosition + 10, { maxWidth: 170, align: "justify" });

  const installationWarrantyYPosition = warrantyYPosition + 40;
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GARANTÍA DE INSTALACIÓN Y MONTAJE", 20, installationWarrantyYPosition);
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Jalmeco Ltda., responsable de la instalación y montaje, realizará el mantenimiento preventivo y correctivo de forma gratuita por seis (6) meses calendario, tiempo en el cual subsanará cualquier defecto en forma gratuita por el tiempo indicado.", 20, installationWarrantyYPosition + 10, { maxWidth: 170, align: "justify" });

  const obligationsYPosition = installationWarrantyYPosition + 40;
  doc.setFontSize(12).setFont("Helvetica", "bold").text("OBLIGACIONES DEL COMPRADOR", 20, obligationsYPosition);
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Todas las obras civiles adecuadas para la instalación de los ascensores, así como la instalación eléctrica hasta el cuadro de maniobra del Ascensor, serán realizadas por cuenta del comprador.", 20, obligationsYPosition + 10, { maxWidth: 170, align: "justify" });

};

export default TableComponent;
