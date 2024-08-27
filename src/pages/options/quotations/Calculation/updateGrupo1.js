// Archivo: Calculation/updateGrupo1.js

const updateGrupo1 = (formData, valor3) => {
    const descriptions = [
      "Estructura de cabina",
      "Estructura de contrapeso",
      "Estructura de foso",
      "Subtecho",
      "Cabina",
      "Hormigones",
      "Estructura de motor",
      "Piso",
      "Transporte interno",
      "Comisión INTERNA EMPRESA",
      "Mano de obra producción",
      "Mano de obra instalaciones",
      "Costo de seguridad (agencias transportes internos)",
      "Comisión del banco intermediario"
    ];
  
    descriptions.forEach((description) => {
      const key = Object.keys(formData).find(
        key => key.toLowerCase() === description.toLowerCase()
      );
  
      if (key && formData[key]) {
        const unidades = formData[key].UNIDADES || 1;
        const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
        const transporte = (valor3 || 0) * volumenTotalM3;
        const aduana = 0; // No se calcula aduana para este grupo
        const costoFinal = aduana + transporte + ((formData[key].PRECIO_UNITARIO || 0) * unidades);
  
        formData[key].UNIDADES = unidades;
        formData[key].VOLUMEN_TOTAL_M3 = volumenTotalM3;
        formData[key].TRANSPORTE = transporte;
        formData[key].ADUANA = aduana;
        formData[key].COSTO_FINAL = costoFinal;
      }
    });
  
    return formData;
  };
  
  export default updateGrupo1;
  