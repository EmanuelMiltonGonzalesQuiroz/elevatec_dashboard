// Archivo: Calculation/updateGrupo4.js

const updateGrupo4 = (formData, valor3) => {
    const descriptions = {
      "Cable de tracción": formData['Traccion'] || 1,
      "Chumbadores": 10,
      "Poleas": null, // Depende de la descripción (1 A 1 = 1 o 2 A 1 = 3)
      "Cable de 8mm": (formData['03_RECORRIDO'] || 0) * 2,
      "Cadena de compensación": 2
    };
  
    Object.keys(descriptions).forEach(description => {
      const key = Object.keys(formData).find(
        key => key.toLowerCase() === description.toLowerCase()
      );
  
      if (key && formData[key]) {
        let unidades = descriptions[description];
        if (description === "Poleas") {
          // Comentario: Depende de la descripción (1 A 1 = 1 o 2 A 1 = 3)
          unidades = null; // Placeholder para lógica futura
        }
  
        if (unidades !== null) {
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
      }
    });
  
    return formData;
  };
  
  export default updateGrupo4;
  