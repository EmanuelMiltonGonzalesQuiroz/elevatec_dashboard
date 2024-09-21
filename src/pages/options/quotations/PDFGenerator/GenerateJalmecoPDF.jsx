import Header from './Header'; // Importar el componente del encabezado
import MainContent from './MainContent'; // Importar el contenido principal
import TechnicalSpecifications from './TechnicalSpecifications'; // Importar las especificaciones técnicas
import TechnicalDetails from './TechnicalDetails'; // Importar los detalles técnicos
import TableComponent from './TableComponent'; // Importar el componente de tabla
import Final from './Final'; // Importar la sección final

import jalmecoHeaderJPG from '../../../../assets/images/jalmecoHeader.jpg'; // Importar el encabezado
import jalmecoWaterMark from '../../../../assets/images/jalmecoWaterMark.jpg'; // Importar la marca de agua
import teknoliftFooterJPG from '../../../../assets/images/teknoliftFooter.jpg'; // Importar el footer

export const generateJalmecoPDF = (doc, formData, values, config) => {
  const pageWidth = doc.internal.pageSize.getWidth(); // Obtener el ancho de la página
  const pageHeight = doc.internal.pageSize.getHeight(); // Obtener la altura de la página
  const headerHeight = 40; // Aumentar la altura del encabezado
  const footerHeight = 30; // Altura del footer

  // Mueve el contenido 10 unidades más abajo en el eje Y
  let startY = headerHeight + 20; // Ajustar para que el contenido comience 10 unidades más abajo

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
    try {
      const watermarkWidth = pageWidth ; // Ajustar tamaño de la marca de agua
      const watermarkHeight = pageHeight ;
      const watermarkX = (pageWidth - watermarkWidth) / 2; // Centrar la marca de agua
      const watermarkY = (pageHeight - watermarkHeight) / 2;

      // Ajustar la opacidad y añadir la marca de agua
      doc.setGState(new doc.GState({ opacity: 0.4 })); // Aumentar la opacidad para mayor visibilidad
      doc.addImage(imageBase64, 'JPEG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
      doc.setGState(new doc.GState({ opacity: 1 })); // Restaurar opacidad
    } catch (error) {
      console.error("Error al añadir la marca de agua: ", error.message);
    }
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
  const checkAddPage = (doc, currentY) => {
    if (currentY + 20 > pageHeight) {
      doc.addPage();
      addHeaderImage(doc, jalmecoHeaderJPG, 0, 0, pageWidth, headerHeight); // Añadir el encabezado a la nueva página
      addWatermark(doc, jalmecoWaterMark); // Añadir la marca de agua a la nueva página
      addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); // Añadir el footer a la nueva página
      return headerHeight + 20; // Reiniciar la posición Y después del encabezado
    }
    return currentY;
  };

  // Añadir la imagen de encabezado y la marca de agua a la primera página
  addHeaderImage(doc, jalmecoHeaderJPG, 0, 0, pageWidth, headerHeight); // Colocar la imagen en (0, 0)
  addWatermark(doc, jalmecoWaterMark); // Añadir marca de agua centrada
  addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); // Añadir footer

  // Página 1: Cabecera y contenido principal
  startY = Header({ doc, config, startY });
  startY = MainContent({ doc, config, formData, startY });

  // Especificaciones técnicas
  startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
  startY = TechnicalSpecifications({ doc, formData, startY, config });

  // Detalles técnicos
  startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
  startY = TechnicalDetails({ doc, formData, startY , config});

  // Tabla de componentes finales
  startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
  startY = TableComponent({ doc, formData, values, startY , config});

  // Sección final
  startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
  Final({ doc, config, startY });

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
