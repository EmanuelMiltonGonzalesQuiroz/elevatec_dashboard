import Header from './Header.jsx';
import MainContent from './MainContent.jsx';
import TechnicalSpecifications from './TechnicalSpecifications.jsx';
import TechnicalDetails from './TechnicalDetails.jsx';
import TableComponent from './TableComponent.jsx';
import Final from './Final.jsx';
import { checkAddPage } from './utils.jsx';
export const generatePDFContent = (doc, formData, values, config) => {
    let startY = config.topMargin || 20; // Asegurarse de que el margen superior esté establecido
  
    // Cabecera
    startY = Header({ doc, config, startY });
  
    // Contenido principal
    startY = MainContent({ doc, config, formData, startY });
  
    // Especificaciones técnicas
    startY = checkAddPage(doc, startY, config); // Verificar si se necesita una nueva página
    startY = TechnicalSpecifications({ doc, formData, startY, config });
  
    // Detalles técnicos
    startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
    startY = TechnicalDetails({ doc, formData, startY, config });
  
    // Tabla de componentes finales
    startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
    startY = TableComponent({ doc, formData, values, startY, config });
  
    // Sección final (aquí se pone un espacio en lugar de "Final")
    startY = checkAddPage(doc, startY); // Verificar si se necesita una nueva página
    startY = Final({ doc, config, startY });
    doc.text(" ", config.leftMargin, startY); // Insertar un espacio
  
    return doc; // Retornar el documento modificado
  };
  