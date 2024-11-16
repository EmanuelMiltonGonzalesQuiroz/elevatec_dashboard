import Header from './Header'; // Importar el componente del encabezado
import MainContent from './MainContent'; // Importar el contenido principal
import TechnicalSpecifications from './TechnicalSpecifications'; // Importar las especificaciones técnicas
import TechnicalDetails from './TechnicalDetails'; // Importar los detalles técnicos
import TableComponent from './TableComponent'; // Importar el componente de tabla

import jalmecoHeaderJPG from '../../../../assets/images/jalmecoHeader.jpg'; // Importar el encabezado
import jalmecoWaterMark from '../../../../assets/images/jalmecoWaterMark.jpg'; // Importar la marca de agua
import teknoliftFooterJPG from '../../../../assets/images/teknoliftFooter.jpg'; // Importar el footer

export const generateJalmecoPDF = (doc, formData, values, config) => {
  const pageWidth = doc.internal.pageSize.getWidth(); // Obtener el ancho de la página
  const pageHeight = doc.internal.pageSize.getHeight(); // Obtener la altura de la página
  const headerHeight = 40; // Aumentar la altura del encabezado
  const footerHeight = 30; // Altura del footer

  let startY = headerHeight + 20; // Ajustar para que el contenido comience 10 unidades más abajo

  // Función interna para añadir la imagen de encabezado
  const addHeaderImage = (doc, imageBase64, x = 0, y = 0, width, height) => {
    try {
      doc.addImage(imageBase64, 'JPEG', x, y, width, height); 
    } catch (error) {
      console.error("Error al cargar la imagen de encabezado: ", error.message);
    }
  };

  const addWatermark = (doc, imageBase64) => {
      const watermarkWidth = pageWidth ; // Ajustar tamaño de la marca de agua
      const watermarkHeight = pageHeight ;
      const watermarkX = (pageWidth - watermarkWidth) / 2; // Centrar la marca de agua
      const watermarkY = (pageHeight - watermarkHeight) / 2;

      doc.setGState(new doc.GState({ opacity: 0.2 })); // Aumentar la opacidad para mayor visibilidad
      doc.addImage(imageBase64, 'JPEG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
      doc.setGState(new doc.GState({ opacity: 1 })); // Restaurar opacidad
    
  };

  const addFooterImage = (doc, imageBase64, pageHeight, footerHeight) => {
    try {
      const footerY = pageHeight - footerHeight - 10; // Ajustar la posición Y para el footer
      doc.addImage(imageBase64, 'JPEG', 0, footerY, pageWidth, footerHeight);  
    } catch (error) {
      console.error("Error al cargar la imagen del footer: ", error.message); 
    }
  };
 
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
  
  addHeaderImage(doc, jalmecoHeaderJPG, 0, 0, pageWidth, headerHeight); // Colocar la imagen en (0, 0) 
  addWatermark(doc, jalmecoWaterMark); // Añadir marca de agua centrada
  addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); // Añadir footer 

  startY = Header({ doc, config, startY , formData});   
 
  startY = MainContent({ doc, config, formData, startY });  
   
  startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
  startY = TechnicalSpecifications({ doc, formData, startY, config }); 

  startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página 
  startY = TechnicalDetails({ doc, formData, startY , config});

  startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
  startY = TableComponent({ doc, formData, values, startY , config});

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderImage(doc, jalmecoHeaderJPG, 0, 0, pageWidth, headerHeight); // Añadir encabezado
    addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); // Añadir footer
    addWatermark(doc, jalmecoWaterMark); // Añadir marca de agua
  }
};
