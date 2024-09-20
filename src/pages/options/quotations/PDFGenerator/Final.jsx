import 'jspdf-autotable';

// Function to check if a page break is needed and add a new page if necessary
const checkAddPage = (doc, currentY, additionalSpace = 20, config) => {
  const { bottomMargin = 20 } = config; // Use bottom margin from config
  const pageHeight = doc.internal.pageSize.height;
  if (currentY + additionalSpace > pageHeight - bottomMargin) {
    doc.addPage();
    return 30; // Reset Y position on new page
  }
  return currentY;
};

const Final = ({ doc, config, startY }) => {
  const { leftMargin = 20, bottomMargin = 20 } = config; // Get left and bottom margins from config
  let currentY = startY || 30; // Default value if startY is not defined
  const lineSpacing = 10; // Line spacing

  // Check if enough space before adding each text block
  currentY = checkAddPage(doc, currentY, lineSpacing, config);

  // Section "VALIDITY OF THE OFFER"
  doc.setFontSize(12).setFont("Helvetica", "bold").text("VALIDEZ DE LA OFERTA", leftMargin, currentY);
  currentY += lineSpacing;

  doc.setFontSize(12).setFont("Helvetica", "normal").text("Diez (10) días a partir de la fecha.", leftMargin, currentY, { maxWidth: 170, align: "justify" });
  currentY += lineSpacing * 2;

  // Check if enough space before adding signature section
  currentY = checkAddPage(doc, currentY, 70, config); // Make sure there's space for the signature

  // Signature space
  const signatureSpaceY = currentY + 70; // Adjust based on previous content
  doc.setFontSize(12).setFont("Helvetica", "normal").text("__________________________", leftMargin + 90, signatureSpaceY, { align: "center" });
  doc.setFontSize(12).setFont("Helvetica", "bold").text("Ing. Frank Jaldin Navia", leftMargin + 90, signatureSpaceY + 10, { align: "center" });
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GERENTE REGIONAL", leftMargin + 90, signatureSpaceY + 15, { align: "center" });

  // Ensure that there's enough space for any additional content after the signature
  currentY = signatureSpaceY + 25;

  // Return the last updated Y position to ensure the document continues properly
  return currentY > (doc.internal.pageSize.height - bottomMargin) ? checkAddPage(doc, currentY, 20, config) : currentY;
};

export default Final;
