// utils.js
export const checkAddPage = (doc, currentY, imageBase64) => {
    const pageHeight = doc.internal.pageSize.height; // Altura de la página
    if (currentY + 20 > pageHeight) {
      doc.addPage();
      addHeaderImage(doc, imageBase64); // Añadir la imagen cada vez que se agrega una página nueva
      return 30; // Reinicia la posición Y en la nueva página
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
  