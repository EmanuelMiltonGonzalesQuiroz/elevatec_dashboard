const Footer = ({ doc, pageNumber }) => {
  const bottomMargin = 20;
  const footerText = `Página ${pageNumber}`;
  
  doc.setFontSize(10);
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(footerText);

  // Coloca el texto en la esquina inferior derecha, cerca del borde inferior
  doc.text(footerText, pageWidth - textWidth - 20, doc.internal.pageSize.height - bottomMargin);
};

export default Footer;
