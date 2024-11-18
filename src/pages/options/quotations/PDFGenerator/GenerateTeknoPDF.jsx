import Header from './Header'; 
import MainContent from './MainContent'; 
import TechnicalSpecifications from './TechnicalSpecifications'; 
import TechnicalDetails from './TechnicalDetails'; 
import TableComponent from './TableComponent'; 

import teknoliftHeader from '../../../../assets/images/teknoliftHeader.jpg';  
import teknoliftRight from '../../../../assets/images/teknoliftRight.jpg';     
import teknoliftWaterMark from '../../../../assets/images/teknoliftWaterMark.jpg'; 
import teknoliftFooterJPG from '../../../../assets/images/teknoliftFooter.jpg';  
   
export const generateTeknoPDF = (doc, formData, values, config) => {  
  const pageWidth = doc.internal.pageSize.getWidth();   
  const pageHeight = doc.internal.pageSize.getHeight();  
  const headerHeight = 40;   
  const footerHeight = 30;   
  const rightImageWidth = 40; 
  const { topMargin = 30, bottomMargin = 20, leftMargin = 20, rightMargin = 20 } = config; // Obtener márgenes de config

  let startY = topMargin + 20; 

  const addHeaderImage = (doc, imageBase64, x = 0, y = 0, width, height) => {
    try {
      doc.addImage(imageBase64, 'JPEG', x, y, width, height);
    } catch (error) {
      console.error("Error al cargar la imagen de encabezado: ", error.message);
    }
  };

  const addRightImage = (doc, imageBase64, x, y, height) => {
    try {
      doc.addImage(imageBase64, 'JPEG', x, y, rightImageWidth, height); 
    } catch (error) {
      console.error("Error al cargar la imagen del lado derecho: ", error.message);
    }
  }; 

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

  const addFooterImage = (doc, imageBase64, pageHeight, footerHeight) => {
    try {
      const footerY = pageHeight - footerHeight - 10; 
      doc.addImage(imageBase64, 'JPEG', 0, footerY, pageWidth, footerHeight);
    } catch (error) { 
      console.error("Error al cargar la imagen del footer: ", error.message);
    }
  };
 
  const checkAddPage = (doc, currentY) => {
    if (currentY + 20 > pageHeight - bottomMargin) { 
      doc.addPage();
      addHeaderImage(doc, teknoliftHeader, 0, 0, pageWidth, headerHeight); 
      addRightImage(doc, teknoliftRight, pageWidth - rightImageWidth, headerHeight, pageHeight - headerHeight - footerHeight); // Ajusta la imagen del lado derecho para ocupar toda la altura disponible
      addWatermark(doc, teknoliftWaterMark); 
      addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); 
      return topMargin + 20; 
    }
    return currentY;
  }; 

  addHeaderImage(doc, teknoliftHeader, 0, 0, pageWidth, headerHeight);   
  addRightImage(doc, teknoliftRight, pageWidth - rightImageWidth, headerHeight, pageHeight - headerHeight - footerHeight); 
  addWatermark(doc, teknoliftWaterMark);   
  addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight);  
  
  startY = Header({ doc, config, startY , formData});   
  startY = MainContent({ doc, config, formData, startY });   
     
  startY = checkAddPage(doc, startY);   
  startY = TechnicalSpecifications({ doc, formData, startY, config });

  startY = checkAddPage(doc, startY); 
  startY = TechnicalDetails({ doc, formData, startY , config}); 

  startY = checkAddPage(doc, startY); 
  startY = TableComponent({ doc, formData, values, startY , config});

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderImage(doc, teknoliftHeader, 0, 0, pageWidth, headerHeight); 
    addRightImage(doc, teknoliftRight, pageWidth - rightImageWidth, headerHeight, pageHeight - headerHeight - footerHeight); 
    addFooterImage(doc, teknoliftFooterJPG, pageHeight, footerHeight); 
    addWatermark(doc, teknoliftWaterMark); 

    doc.setFontSize(10);
  }
};
  