const Header = ({ doc, config, startY, formData }) => {
  const { leftMargin, city, date, refNumber, recipient } = config;
  const pageWidth = doc.internal.pageSize.getWidth(); 
  const rightMargin = 20; 
  const maxTextWidth = pageWidth - leftMargin - rightMargin; 

  let currentY = startY-10;
  const lineSpacing = 10; 
 
  doc.setFontSize(12);

  const cityText = city && city.toLowerCase().includes("transporte por el cliente") 
    ? `_____________ , ${date}` 
    : `${city}, ${date}`;
  doc.text(cityText, leftMargin, currentY, { maxWidth: maxTextWidth });
  currentY += lineSpacing;

  doc.text(refNumber, leftMargin, currentY, { maxWidth: maxTextWidth });
  currentY += lineSpacing;
  if(formData[0]["NombreEdificio"]){
    doc.text("Proyecto:", leftMargin, currentY, { maxWidth: maxTextWidth });
  currentY += lineSpacing;
  doc.text(formData[0]["NombreEdificio"], leftMargin, currentY, { maxWidth: maxTextWidth });
  currentY += lineSpacing;
  }

  doc.text("Señor:", leftMargin, currentY, { maxWidth: maxTextWidth });
  currentY += lineSpacing;

  doc.setFont("Helvetica", "bold");
  doc.text(recipient, leftMargin, currentY, { maxWidth: maxTextWidth });
  currentY += lineSpacing;

  doc.setFont("Helvetica", "normal");
  doc.text("Presente.-", leftMargin, currentY, { maxWidth: maxTextWidth });
  doc.setLineWidth(0.5); 
  currentY += lineSpacing;

  return currentY;
};

export default Header;
