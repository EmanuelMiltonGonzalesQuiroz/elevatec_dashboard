const Footer = ({ doc, pageNumber, startY }) => {
  const bottomMargin = 20;
  const footerText = `Página ${pageNumber}`;

  // Mantén un espacio adecuado para el pie de página y asegúrate de que no sobrescriba otro contenido
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(footerText);

  // Comprueba si el contenido se acerca al margen inferior y si es así, mueve el pie de página a la siguiente posición válida
  const footerYPosition = pageHeight - bottomMargin;

  // Asegurarse de que el pie de página no se sobreponga al contenido
  if (startY > footerYPosition - 10) {
    startY = footerYPosition - 10; // Ajusta startY si el contenido está cerca del pie
  }

  // Coloca el texto del pie de página en la esquina inferior derecha
  doc.setFontSize(10).text(footerText, pageWidth - textWidth - 20, footerYPosition);
};

export default Footer;
