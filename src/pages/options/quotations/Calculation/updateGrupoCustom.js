import areStringsSimilar from './areStringsSimilar.js';

const updateGrupoCustom = (formData, valor3, allData) => {
  const elements = allData.elements?.items || [];

  const findElementValue = (name) => {
    const element = elements.find(el => areStringsSimilar(el.name, name));
    return element ? element.value : 0;
  };

  const descriptions = {
    "Pernos_de_empalmes": (formData['01_PARADAS'] || 0) + 2,
    "Pernos_de_motor": 4,
    "Corredizas_de_cabina": 4,
    "Corredizas_de_contrapeso": 4,
    "Motor": 1,
    "Maniobra": 1,
    "Regla": 1
  };

  Object.keys(descriptions).forEach(description => {
    const key = Object.keys(formData).find(
      key => areStringsSimilar(key, description)
    );

    if (key && formData[key]) {
      const unidades = descriptions[description];
      const precioUnitario = findElementValue(description) || formData[key].PRECIO_UNITARIO || 0;
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

export default updateGrupoCustom;
