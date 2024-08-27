// Archivo: Calculation/updateGrupo5.js

const updateGrupo5 = (formData, valor3) => {
    const descriptions = {
      "Puerta de cabina": 1,
      "Puertas en inoxidable": formData['Puertas en inoxidable'] || 1,
      "Puertas en epoxi": formData['Puertas en epoxi'] || 1,
      "Puertas en vidrio": formData['Puertas en vidrio'] || 1,
      "Regulador de velocidad": 1,
      "Freno": 1
    };
  
    Object.keys(descriptions).forEach(description => {
      const key = Object.keys(formData).find(
        key => key.toLowerCase() === description.toLowerCase()
      );
  
      if (key && formData[key]) {
        const unidades = descriptions[description];
        const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
        const transporte = (valor3 || 0) * volumenTotalM3;
        const aduana = ((unidades * (formData[key].PRECIO_UNITARIO || 0)) + transporte) * 0.3;
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
  
  export default updateGrupo5;
  