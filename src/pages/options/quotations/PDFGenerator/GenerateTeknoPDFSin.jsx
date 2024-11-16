import Header from './Header'; 
import MainContent from './MainContent'; 
import TechnicalSpecifications from './TechnicalSpecifications'; 
import TechnicalDetails from './TechnicalDetails'; 
import TableComponent from './TableComponent'; 

export const generateTeknoPDFSin = (doc, formData, values, config) => { 
  const pageWidth = doc.internal.pageSize.getWidth(); 
  const pageHeight = doc.internal.pageSize.getHeight(); 
  const headerHeight = 40;  
  const footerHeight = 30; 
  const rightImageWidth = 40; // Mantener el ancho como si la imagen aún estuviera ahí
  const { topMargin = 30, bottomMargin = 20, leftMargin = 20, rightMargin = 20 } = config; 

  let startY = topMargin + 20; 

  // Función para verificar si se necesita una nueva página
  const checkAddPage = (doc, currentY) => {
    if (currentY + 20 > pageHeight - bottomMargin) {
      doc.addPage();
      return topMargin + 20; 
    }
    return currentY;
  };

  // Añadir el contenido del PDF
  startY = Header({ doc, config, startY , formData});  

  startY = MainContent({ doc, config, formData, startY });

  // Especificaciones técnicas
  startY = checkAddPage(doc, startY); 
  startY = TechnicalSpecifications({ doc, formData, startY, config });

  // Detalles técnicos
  startY = checkAddPage(doc, startY); 
  startY = TechnicalDetails({ doc, formData, startY, config });

  // Tabla de componentes finales
  startY = checkAddPage(doc, startY); 
  startY = TableComponent({ doc, formData, values, startY, config });

  // Añadir el número de página
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
  }
};
