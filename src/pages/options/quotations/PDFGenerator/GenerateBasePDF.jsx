import Header from './Header';
import MainContent from './MainContent';
import TechnicalSpecifications from './TechnicalSpecifications';
import TechnicalDetails from './TechnicalDetails'; 
import TableComponent from './TableComponent';  
import { checkAddPage } from './utils'; // Utiliza checkAddPage desde un archivo de utilidades si lo necesitas
 
export const generateBasePDF = (doc, formData, values, config) => {
  let startY = 30; // Inicializa correctamente startY   
    
  // Página 1: Cabecera y contenido principal     
  startY = Header({ doc, config, startY , formData});  
  startY = MainContent({ doc, config, formData, startY });       
    
  // Especificaciones técnicas   
  startY = checkAddPage(doc, startY, config); // Verificar si se necesita una nueva página    
  startY = TechnicalSpecifications({ doc, formData, startY , config}); 
  startY = checkAddPage(doc, startY, config); // Verificar si se necesi ta una nueva página
  startY = TechnicalDetails({ doc, formData, startY , config}); 

  // Tabla de componentes finales 
  startY = checkAddPage(doc, startY, config); // Verificar si se necesita una nueva página
  startY = TableComponent({ doc, formData, values, startY, config });


  // Sección final 
   
};
