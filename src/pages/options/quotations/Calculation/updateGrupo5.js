// Archivo: Calculation/updateGrupo5.js

const updateGrupo5 = (formData, valor3) => {
  const descriptions = {
    "Puerta_de_cabina": 1,
    "Puertas_en_inoxidable": formData['Puertas_en_inoxidable'].UNIDADES || 0,
    "Puertas_En_Epoxi": formData['Puertas_En_Epoxi'].UNIDADES || 0,
    "Puertas_En_Vidrio": formData['Puertas_En_Vidrio'].UNIDADES || 0,
    "Regulador_de_velocidad": 1,
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
