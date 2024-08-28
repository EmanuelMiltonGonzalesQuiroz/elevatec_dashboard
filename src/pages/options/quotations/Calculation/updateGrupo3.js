// Archivo: Calculation/updateGrupo3.js

const updateGrupo3 = (formData, valor3) => {
  const descriptions = [
    "Riel_de_cabina",
    "Riel_de_contrapeso"
  ];

  descriptions.forEach((description) => {
    const key = Object.keys(formData).find(
      key => key.toLowerCase() === description.toLowerCase()
    );

    if (key && formData[key]) {
      const recorrido = formData['03_RECORRIDO'] || 0;
      const unidades = Math.ceil(recorrido / 5) * 2;
      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * (formData[key].PRECIO_UNITUARIO || 0)) + transporte) * 0.3;
      const costoFinal = aduana + transporte + ((formData[key].PRECIO_UNITUARIO || 0) * unidades);

      formData[key].UNIDADES = unidades;
      formData[key].VOLUMEN_TOTAL_M3 = volumenTotalM3;
      formData[key].TRANSPORTE = transporte;
      formData[key].ADUANA = aduana;
      formData[key].COSTO_FINAL = costoFinal;
    }
  });

  return formData;
};

export default updateGrupo3;
