import 'jspdf-autotable';

// Función para verificar si se necesita un salto de página
const checkAddPage = (doc, currentY) => {
  const pageHeight = doc.internal.pageSize.height;
  if (currentY + 20 > pageHeight) {
    doc.addPage();
    return 30; // Reinicia la posición Y en la nueva página
  }
  return currentY;
};

const Final = ({ doc, config, startY }) => {
  let currentY = startY || 30; // Valor por defecto si startY no está definido
  const lineSpacing = 10; // Espaciado entre líneas

  // Verificar si hay espacio suficiente antes de agregar cada bloque de texto
  currentY = checkAddPage(doc, currentY);

  // Sección "VALIDEZ DE LA OFERTA"
  doc.setFontSize(12).setFont("Helvetica", "bold").text("VALIDEZ DE LA OFERTA", config.leftMargin, currentY);
  currentY += lineSpacing;

  doc.setFontSize(12).setFont("Helvetica", "normal").text("Diez (10) días a partir de la fecha.", config.leftMargin, currentY, { maxWidth: 170, align: "justify" });
  currentY += lineSpacing * 2;

  // Verificar si hay espacio antes de añadir la firma
  currentY = checkAddPage(doc, currentY);

  // Espacio para la firma
  const signatureSpaceY = currentY + 70; // Ajusta según el contenido previo
  doc.setFontSize(12).setFont("Helvetica", "normal").text("__________________________", config.leftMargin + 90, signatureSpaceY, { align: "center" });
  doc.setFontSize(12).setFont("Helvetica", "bold").text("Ing. Frank Jaldin Navia", config.leftMargin + 90, signatureSpaceY + 10, { align: "center" });
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GERENTE REGIONAL", config.leftMargin + 90, signatureSpaceY + 15, { align: "center" });

  // Devuelve la última posición Y actualizada
  return signatureSpaceY + 25;
};

export default Final;
