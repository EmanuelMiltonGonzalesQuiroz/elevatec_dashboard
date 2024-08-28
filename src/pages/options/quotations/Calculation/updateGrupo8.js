import areStringsSimilar from './areStringsSimilar.js';

const updateGrupo8 = (formData, valor3) => {
  const descriptions = {
    "Embarque": () => {
      const nombreEmbarque = formData['Embarque']?.nombre?.toLowerCase() || '';
      if (nombreEmbarque.includes('simple')) return 0;
      if (nombreEmbarque.includes('doble 90')) return 1;
      if (nombreEmbarque.includes('doble 180')) return 1;
      if (nombreEmbarque.includes('triple')) return 2;
      return 0; // Valor por defecto si no coincide
    },
    "Tipo": formData['Tipo']?.UNIDADES || 0,
    "Pesacarga": formData['Pesacarga']?.UNIDADES || 0,
    "Regenerador_de_energia": formData['Regenerador_de_energia']?.UNIDADES || 1
  };

  Object.keys(descriptions).forEach(description => {
    const key = Object.keys(formData).find(
      key => areStringsSimilar(key, description)
    );

    if (key && formData[key]) {
      const unidades = typeof descriptions[description] === 'function' ? descriptions[description]() : descriptions[description];
      const precioUnitario = formData[key].PRECIO_UNITUARIO || formData[key].valor || 0;
      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3;
      const costoFinal = aduana + transporte + (precioUnitario * unidades);

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
