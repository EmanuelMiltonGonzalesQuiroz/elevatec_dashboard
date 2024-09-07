const safeText = (doc, text, x, y, options = {}) => {
    // Validar que el texto no sea null o undefined
    const safeText = text || '';
  
    // Validar que las coordenadas x e y sean números válidos
    const safeX = typeof x === 'number' ? x : 20; // Valor por defecto si x no es válido
    const safeY = typeof y === 'number' ? y : 20; // Valor por defecto si y no es válido
  
    // Llamar a doc.text solo si el texto es válido
    try {
      doc.text(safeText.toString(), safeX, safeY, options);
    } catch (error) {
      console.error('Error al generar el texto en el PDF:', error);
    }
  };
  
  export default safeText;
  