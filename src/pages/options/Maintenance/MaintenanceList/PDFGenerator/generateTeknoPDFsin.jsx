import MainContent from './MainContent';

export const generateTeknoPDFsin = (doc, recipe, config) => {
  const pageWidth = doc.internal.pageSize.getWidth(); 
  const pageHeight = doc.internal.pageSize.getHeight(); 
  const headerHeight = 40; 
  const footerHeight = 30; 
  const rightImageWidth = 40; // Ajusta el ancho de la imagen del lado derecho según sea necesario
  const { topMargin = 30, bottomMargin = 20, leftMargin = 20, rightMargin = 20 } = config; // Obtener márgenes de config


  // Función para añadir la imagen del encabezado
  const addHeaderImage = (doc, imageBase64, x = 0, y = 0, width, height) => {
    try {
      doc.addImage(imageBase64, 'JPEG', x, y, width, height);
    } catch (error) {
      console.error("Error al cargar la imagen de encabezado: ", error.message);
    }
  };

  // Función para añadir la imagen del lado derecho
  const addRightImage = (doc, imageBase64, x, y, height) => {
    try {
      doc.addImage(imageBase64, 'JPEG', x, y, rightImageWidth, height); // Usa el ancho fijo y ocupa toda la altura
    } catch (error) {
      console.error("Error al cargar la imagen del lado derecho: ", error.message);
    }
  };

  // Función para añadir la marca de agua detrás del contenido
  const addWatermark = (doc, imageBase64) => {
    try { 
      const watermarkWidth = pageWidth - leftMargin - rightMargin;
      const watermarkHeight = pageHeight;
      const watermarkX = (pageWidth - watermarkWidth) / 2; 
      const watermarkY = (pageHeight - watermarkHeight) / 2;

      doc.setGState(new doc.GState({ opacity: 0.05 })); 
      doc.addImage(imageBase64, 'JPEG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
      doc.setGState(new doc.GState({ opacity: 1 })); 
    } catch (error) {
      console.error("Error al añadir la marca de agua: ", error.message);
    }
  };

  // Función para añadir el footer detrás del número de página
  const addFooterImage = (doc, imageBase64, pageHeight, footerHeight) => {
    try {
      const footerY = pageHeight - footerHeight - 10; 
      doc.addImage(imageBase64, 'JPEG', 0, footerY, pageWidth, footerHeight);
    } catch (error) {
      console.error("Error al cargar la imagen del footer: ", error.message);
    }
  };

  let currentYPosition = topMargin;

  // Llamar a TableComponent para generar el contenido del contrato
  MainContent({ doc, config, startY: currentYPosition, recipe });


  // Añadir encabezado, footer, marca de agua e imagen lateral en todas las páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Añadir el número de página
    doc.setFontSize(10);
  }
};
