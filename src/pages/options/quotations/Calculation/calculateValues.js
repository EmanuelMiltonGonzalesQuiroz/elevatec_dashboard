const calculateValues = (formData) => {
    const valor0 = 8500;
    const valor1 = 67.67;
    const valor2 = valor1 * 0.6;
    const valor3 = valor0 / valor2;
  
    const sumaCostoFinal = Object.keys(formData)
      .filter(field => typeof formData[field] === 'object')
      .reduce((sum, key) => sum + (formData[key].COSTO_FINAL || 0), 0);
  
    const valor4 = sumaCostoFinal;
    const valor5 = valor4 * 0.095;
    const valor6 = (valor4 * 2) + valor5;
    const valor7 = valor6 * 0.1;
    const valor8 = valor6 + valor7;
  
    return { valor0, valor1, valor2, valor3, valor4, valor5, valor6, valor7, valor8 };
  };
  
  export default calculateValues;
  