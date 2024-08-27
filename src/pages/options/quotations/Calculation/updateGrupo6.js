// Archivo: Calculation/updateGrupo6.js

const updateGrupo6 = (formData, valor3) => {
    const descriptions = {
      "Indicador de Cabina": 1,
      "Indicador de piso": formData['01_PARADAS'] || 1,
      "Cableado de pisos": formData['01_PARADAS'] || 1,
      "LOP": formData['01_PARADAS'] || 1,
      "Tipo de Botonera COP": 1,
      "Botones de cabina": formData['01_PARADAS'] || 1,
      "Botones de piso": formData['01_PARADAS'] || 1
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
  
  export default updateGrupo6;
  