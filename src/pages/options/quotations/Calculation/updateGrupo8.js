// Archivo: Calculation/updateGrupo8.js

const updateGrupo8 = (formData, valor3) => {
    const descriptions = {
      "Embarque": formData['Embarque'] || 1,
      "MRL/MR": formData['MRL/MR'] || 1,
      "Pesacarga": formData['Pesacarga'] || 1,
      "Regenerador de energía": formData['Regenerador de energía'] || 1
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
  
  export default updateGrupo8;
  