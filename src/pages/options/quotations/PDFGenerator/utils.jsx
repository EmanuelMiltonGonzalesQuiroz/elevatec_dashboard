// utils.js
export const checkAddPage = (doc, currentY, config, imageBase64) => {
  const { bottomMargin = 20, topMargin = 30 } = config; // Obtener los márgenes superior e inferior de la configuración
  const pageHeight = doc.internal.pageSize.height; // Altura de la página

  // Verificar si la posición actual más el espacio adicional supera el tamaño de la página restando el margen inferior
  if (currentY + 20 > pageHeight - bottomMargin) {
    doc.addPage();
    addHeaderImage(doc, imageBase64); // Añadir la imagen de cabecera cada vez que se agrega una página nueva
    return topMargin; // Reinicia la posición Y con el margen superior en la nueva página
  }
  return currentY;
};

  
  // Función para añadir la imagen como encabezado
  export const addHeaderImage = (doc, imageBase64) => {
    try {
      
      // Añadir la imagen base64 como encabezado en cada página
      doc.addImage(imageBase64, 'JPEG', 10, 10, 190, 30); // Ajusta las coordenadas y el tamaño según sea necesario
    } catch (error) {
    }
  };
  