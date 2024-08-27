// Archivo: Calculation/updateGrupo7.js

const updateGrupo7 = (formData, valor3) => {
    const descriptions = {
      "Llavines con llave": 1,
      "Pasamanos adicional": formData['Pasamanos adicional'] || 1,
      "Espejo adicional": formData['Espejo adicional'] || 1,
      "Sistema de monitoreo": formData['Sistema de monitoreo'] || 1,
      "Pre Apertura de puertas": formData['Pre Apertura de puertas'] || 1,
      "Aire acondicionado": formData['Aire acondicionado'] || 1,
      "Ventiladores": formData['Ventiladores'] || 1,
      "Auto Transformador": formData['Auto Transformador'] || 1,
      "ARD": formData['ARD'] || 1,
      "Lector de Tarjetas": formData['Lector de Tarjetas'] || 1
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
  
  export default updateGrupo7;
  