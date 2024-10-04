import MainContent from './MainContent';

export const generateBasePDF = (doc, recipe, config) => {
  // Iniciar el contenido desde la parte superior de la página
  let currentYPosition = 20;

  // Llamar a MainContent para generar el contenido del contrato
  // eslint-disable-next-line no-unused-vars
  currentYPosition = MainContent({ doc, config, startY: currentYPosition, recipe });

  // Aquí puedes añadir contenido adicional si es necesario después de las tablas...
  return doc; // Aseguramos que el documento sea retornado para su manipulación
};
