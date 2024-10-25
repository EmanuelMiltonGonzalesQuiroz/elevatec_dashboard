import Header from './Header'; // Importar el componente del encabezado
import MainContent from './MainContent'; // Importar el contenido principal
import TechnicalSpecifications from './TechnicalSpecifications'; // Importar las especificaciones técnicas
import TechnicalDetails from './TechnicalDetails'; // Importar los detalles técnicos
import TableComponent from './TableComponent'; // Importar el componente de tabla

export const generateJalmecoPDFSin = (doc, formData, values, config) => {
  const pageWidth = doc.internal.pageSize.getWidth(); // Obtener el ancho de la página
  const pageHeight = doc.internal.pageSize.getHeight(); // Obtener la altura de la página
  const headerHeight = 40; // Mantener la altura del encabezado
  const footerHeight = 30; // Altura del footer
  const { topMargin = 30, bottomMargin = 20 } = config;

  // Mueve el contenido 10 unidades más abajo en el eje Y
  let startY = headerHeight + 20; // Ajustar para que el contenido comience 10 unidades más abajo

  // Función interna para verificar si se necesita una nueva página
  const checkAddPage = (doc, currentY) => {
    if (currentY + 20 > pageHeight - bottomMargin) {
      doc.addPage();
      return headerHeight + 20; // Reiniciar la posición Y después del encabezado
    }
    return currentY;
  };

  // Añadir el contenido del PDF
  startY = Header({ doc, config, startY });
  startY = MainContent({ doc, config, formData, startY });

  // Especificaciones técnicas
  startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
  startY = TechnicalSpecifications({ doc, formData, startY, config });

  // Detalles técnicos
  startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
  startY = TechnicalDetails({ doc, formData, startY, config });

  // Tabla de componentes finales
  startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
  startY = TableComponent({ doc, formData, values, startY, config });

  // Añadir encabezado, footer y marca de agua en todas las páginas generadas
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
  }
};
