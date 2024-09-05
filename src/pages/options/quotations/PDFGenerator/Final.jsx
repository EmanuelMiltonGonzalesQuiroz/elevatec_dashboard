const Final = ({ doc, config }) => {
  const finalStartY = 40; // Ajustar según sea necesario
  
  // Sección "VALIDEZ DE LA OFERTA"
  doc.setFontSize(12).setFont("Helvetica", "bold").text("VALIDEZ DE LA OFERTA", config.leftMargin, finalStartY);
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Diez (10) días a partir de la fecha.", config.leftMargin, finalStartY + 10, { maxWidth: 170, align: "justify" });

  // Espacio para la firma
  const signatureSpaceY = finalStartY + 70; // Ajustar espacio para la firma
  doc.setFontSize(12).setFont("Helvetica", "normal").text("__________________________", config.leftMargin + 90, signatureSpaceY, { align: "center" });
  doc.setFontSize(12).setFont("Helvetica", "bold").text("Ing. Frank Jaldin Navia", config.leftMargin + 90, signatureSpaceY + 10, { align: "center" });
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GERENTE REGIONAL", config.leftMargin + 90, signatureSpaceY + 15, { align: "center" });

  // Devuelve el documento modificado
  return doc;
};

export default Final;
