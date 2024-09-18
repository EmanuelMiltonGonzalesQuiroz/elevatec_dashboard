const Header = ({ doc, config, startY }) => {
  const { leftMargin, city, date, refNumber, recipient } = config;

  // Iniciar desde la posición pasada
  let currentY = startY;
  const lineSpacing = 10; // Espaciado entre líneas

  doc.setFontSize(12);
  
  // Ciudad y fecha
  if (city && city.toLowerCase().includes("transporte por el cliente")) {
    doc.text(`_____________ , ${date}`, leftMargin, currentY); // Espacio agregado antes de la coma
} else {
    doc.text(`${city}, ${date}`, leftMargin, currentY);
}


  currentY += lineSpacing;

  // Referencia
  doc.text(refNumber, leftMargin, currentY);
  currentY += lineSpacing;

  // Destinatario
  doc.text("Señor:", leftMargin, currentY);
  currentY += lineSpacing;

  // Nombre del destinatario
  doc.setFont("Helvetica", "bold");
  doc.text(recipient, leftMargin, currentY);
  currentY += lineSpacing;

  // Presente
  doc.setFont("Helvetica", "normal");
  doc.text("Presente.-", leftMargin, currentY);
  currentY += lineSpacing;

  // Retornar la nueva posición Y para continuar el contenido después del header
  return currentY;
};

export default Header;
