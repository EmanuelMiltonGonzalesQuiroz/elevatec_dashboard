import areStringsSimilar from './areStringsSimilar.js';

const updateGrupo7 = (formData, valor3, allData) => {
  // Accediendo a los items dentro de "elements"
  const elements = allData.elements && allData.elements["elements"] ? allData.elements["elements"].items : [];

  const formDataKeys = Object.keys(formData);

  const findElementValue = (name) => {
    const element = elements.find(el => areStringsSimilar(el.name, name));
    return element ? element.value : 0;
  };

  const descriptions = {
    "Llavines_con_llave": formData['Llavines_con_llave']?.UNIDADES || 0,
    "PasamanosAdicional": formData['PasamanosAdicional']?.UNIDADES || 0,
    "EspejoAdicional": formData['EspejoAdicional']?.UNIDADES || 0,
    "Sistema_de_monitoreo": formData['Sistema_de_monitoreo']?.UNIDADES || 0,
    "Pre_Apertura_de_puertas": formData['Pre_Apertura_de_puertas']?.UNIDADES || 0,
    "Aire_acondicionado": formData['Aire_acondicionado']?.UNIDADES || 0,
    "Ventiladores": formData['Ventiladores']?.UNIDADES || 0,
    "AutoTransformador": formData['AutoTransformador']?.UNIDADES || 0,
    "ARD": formData['ARD']?.UNIDADES || 0,
    "LectorTarjetas": formData['LectorTarjetas']?.UNIDADES || 0
  };

  Object.keys(descriptions).forEach(description => {
    const key = formDataKeys.find(key => areStringsSimilar(key, description));
    
    if (key && formData[key]) {
      const unidades = descriptions[description];
      const precioUnitario = findElementValue(description) || formData[key].PRECIO_UNITUARIO || formData[key].valor || 0;
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

export default updateGrupo7;
