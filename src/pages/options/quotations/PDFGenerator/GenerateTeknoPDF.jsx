import Header from './Header'; 
import MainContent from './MainContent'; 
import TechnicalSpecifications from './TechnicalSpecifications'; 
import TechnicalDetails from './TechnicalDetails'; 
import TableComponent from './TableComponent'; 
import Final from './Final'; 

import teknoliftHeader from '../../../../assets/images/teknoliftHeader.jpg'; 
import teknoliftRight from '../../../../assets/images/teknoliftRight.jpg'; 
import teknoliftWaterMark from '../../../../assets/images/teknoliftWaterMark.jpg'; 
import teknoliftFooterJPG from '../../../../assets/images/teknoliftFooter.jpg'; 

export const generateTeknoPDF = (doc, formData, values, config) => {
  const pageWidth = doc.internal.pageSize.getWidth(); 
  const pageHeight = doc.internal.pageSize.getHeight(); 
  const headerHeight = 40; 
  const footerHeight = 30; 
  const rightImageWidth = 40; // Ajusta el ancho de la imagen del lado derecho según sea necesario
  const { topMargin = 30, bottomMargin = 20, leftMargin = 20, rightMargin = 20 } = config; // Obtener márgenes de config

  let startY = topMargin + 20; 

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

  // Función para verificar si se necesita una nueva página
  const checkAddPage = (doc, currentY) => {
    if (currentY + 20 > pageHeight - bottomMargin) { // Usar el margen inferior de config
      doc.addPage();
      addHeaderImage(doc, teknoliftHeader, 0, 0, pageWidth, headerHeight); 
      addRightImage(doc, teknoliftRight, pageWidth - rightImageWidth, headerHeight, pageHeight - headerHeight - footerHeight); // Ajusta la imagen del lado derecho para ocupar toda la altura disponible
      addWatermark(doc, teknoliftWaterMark); 
      addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); 
      return topMargin + 20; // Usar el margen superior de config al reiniciar la posición Y
    }
    return currentY;
  };

  // Añadir el encabezado, la imagen del lado derecho y la marca de agua en la primera página
  addHeaderImage(doc, teknoliftHeader, 0, 0, pageWidth, headerHeight); 
  addRightImage(doc, teknoliftRight, pageWidth - rightImageWidth, headerHeight, pageHeight - headerHeight - footerHeight); 
  addWatermark(doc, teknoliftWaterMark); 
  addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); 

  // Generar el contenido del PDF
  startY = Header({ doc, config, startY });
  startY = MainContent({ doc, config, formData, startY });

  // Especificaciones técnicas
  startY = checkAddPage(doc, startY); 
  startY = TechnicalSpecifications({ doc, formData, startY, config });

  // Detalles técnicos
  startY = checkAddPage(doc, startY); 
  startY = TechnicalDetails({ doc, formData, startY , config});

  // Tabla de componentes finales
  startY = checkAddPage(doc, startY); 
  startY = TableComponent({ doc, formData, values, startY , config});

  // Sección final
  startY = checkAddPage(doc, startY); 
  Final({ doc, config, startY });

  // Añadir encabezado, footer, marca de agua e imagen lateral en todas las páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderImage(doc, teknoliftHeader, 0, 0, pageWidth, headerHeight); 
    addRightImage(doc, teknoliftRight, pageWidth - rightImageWidth, headerHeight, pageHeight - headerHeight - footerHeight); 
    addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); 
    addWatermark(doc, teknoliftWaterMark); 

    // Añadir el número de página
    doc.setFontSize(10);
  }
};
