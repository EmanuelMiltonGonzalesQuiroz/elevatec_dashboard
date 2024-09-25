import jalmecoHeaderJPG from '../../../../../assets/images/jalmecoHeader.jpg'; // Importar el encabezado
import jalmecoWaterMark from '../../../../../assets/images/jalmecoWaterMark.jpg'; // Importar la marca de agua
import teknoliftFooterJPG from '../../../../../assets/images/teknoliftFooter.jpg'; // Importar el footer
import MainContent from './MainContent';

export const generateJalmecoPDF = (doc, recipe, config) => {
  const pageWidth = doc.internal.pageSize.getWidth(); // Obtener el ancho de la página
  const pageHeight = doc.internal.pageSize.getHeight(); // Obtener la altura de la página
  const headerHeight = 40; // Aumentar la altura del encabezado
  const footerHeight = 30; // Altura del footer


  // Función interna para añadir la imagen de encabezado
  const addHeaderImage = (doc, imageBase64, x = 0, y = 0, width, height) => {
    try {
      doc.addImage(imageBase64, 'JPEG', x, y, width, height); 
    } catch (error) {
      console.error("Error al cargar la imagen de encabezado: ", error.message);
    }
  };

  // Función interna para añadir la marca de agua detrás del contenido
  const addWatermark = (doc, imageBase64) => {
      const watermarkWidth = pageWidth ; // Ajustar tamaño de la marca de agua
      const watermarkHeight = pageHeight ;
      const watermarkX = (pageWidth - watermarkWidth) / 2; // Centrar la marca de agua
      const watermarkY = (pageHeight - watermarkHeight) / 2;

      // Ajustar la opacidad y añadir la marca de agua
      doc.setGState(new doc.GState({ opacity: 0.2 })); // Aumentar la opacidad para mayor visibilidad
      doc.addImage(imageBase64, 'JPEG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
      doc.setGState(new doc.GState({ opacity: 1 })); // Restaurar opacidad
    
  };

  // Función interna para añadir el footer detrás del número de página
  const addFooterImage = (doc, imageBase64, pageHeight, footerHeight) => {
    try {
      const footerY = pageHeight - footerHeight - 10; // Ajustar la posición Y para el footer
      doc.addImage(imageBase64, 'JPEG', 0, footerY, pageWidth, footerHeight); 
    } catch (error) {
      console.error("Error al cargar la imagen del footer: ", error.message);
    }
  };

  // Función interna para verificar si se necesita una nueva página


  // Añadir la imagen de encabezado y la marca de agua a la primera página
  addHeaderImage(doc, jalmecoHeaderJPG, 0, 0, pageWidth, headerHeight); // Colocar la imagen en (0, 0)
  addWatermark(doc, jalmecoWaterMark); // Añadir marca de agua centrada
  addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); // Añadir footer

  // Página 1: Cabecera y contenido principal
  let currentYPosition = 40;

  // Llamar a TableComponent para generar el contenido del contrato
 MainContent({ doc, config, startY: currentYPosition, recipe });
  // Añadir encabezado, footer y marca de agua en todas las páginas generadas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderImage(doc, jalmecoHeaderJPG, 0, 0, pageWidth, headerHeight); // Añadir encabezado
    addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); // Añadir footer
    addWatermark(doc, jalmecoWaterMark); // Añadir marca de agua
    // Añadir el número de página // Ajustar para que el número de página esté por encima del footer
  }
};
