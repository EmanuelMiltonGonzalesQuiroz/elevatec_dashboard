import 'jspdf-autotable';

// Function to check if a page break is needed and add a new page if necessary
const checkAddPage = (doc, currentY, additionalSpace = 20) => {
  const pageHeight = doc.internal.pageSize.height;
  if (currentY + additionalSpace > pageHeight) {
    doc.addPage();
    return 30; // Reset Y position on new page
  }
  return currentY;
};

const Final = ({ doc, config, startY }) => {
  let currentY = startY || 30; // Default value if startY is not defined
  const lineSpacing = 10; // Line spacing

  // Check if enough space before adding each text block
  currentY = checkAddPage(doc, currentY);

  // Section "VALIDITY OF THE OFFER"
  doc.setFontSize(12).setFont("Helvetica", "bold").text("VALIDEZ DE LA OFERTA", config.leftMargin, currentY);
  currentY += lineSpacing;

  doc.setFontSize(12).setFont("Helvetica", "normal").text("Diez (10) días a partir de la fecha.", config.leftMargin, currentY, { maxWidth: 170, align: "justify" });
  currentY += lineSpacing * 2;

  // Check if enough space before adding signature section
  currentY = checkAddPage(doc, currentY);

  // Signature space
  const signatureSpaceY = currentY + 70; // Adjust based on previous content
  doc.setFontSize(12).setFont("Helvetica", "normal").text("__________________________", config.leftMargin + 90, signatureSpaceY, { align: "center" });
  doc.setFontSize(12).setFont("Helvetica", "bold").text("Ing. Frank Jaldin Navia", config.leftMargin + 90, signatureSpaceY + 10, { align: "center" });
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GERENTE REGIONAL", config.leftMargin + 90, signatureSpaceY + 15, { align: "center" });

  // Return the last updated Y position to ensure the document continues properly
  return signatureSpaceY + 25;
};

export default Final;