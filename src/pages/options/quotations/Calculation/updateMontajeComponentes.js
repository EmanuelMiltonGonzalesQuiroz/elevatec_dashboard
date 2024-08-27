// Archivo: Calculation/updateMontajeComponentes.js

const updateMontajeComponentes = (formData, valor3) => {
    const descriptions = [
      "Ramplus",
      "Brakets",
      "Pernos_brakets",
      "Pernos_empalme_braket",
      "Pernos_de_empalmes"
    ];
  
    descriptions.forEach((description) => {
      const key = Object.keys(formData).find(
        key => key.toLowerCase() === description.toLowerCase()
      );
  
      if (key && formData[key]) {
        const paradas = formData['01_PARADAS'] || 0;
        const unidades = (paradas + 2) * 8;
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
  
  export default updateMontajeComponentes;
  