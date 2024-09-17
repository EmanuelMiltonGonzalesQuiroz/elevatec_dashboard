// Archivo: Calculation/updateGrupo2.js

import SearchValue from "./SearchValue.js";

const updateGrupo2 = (formData, valor3, allData) => {
  const descriptions = [
    "Ramplus",
    "Brakets",
    "Pernos_brakets",
    "Pernos_empalme_braket"
  ];
 
  // Actualiza el PRECIO_UNITARIO de "Pernos_brakets"
  formData["Pernos_brakets"].PRECIO_UNITARIO = SearchValue(allData.price_table, "Pernos brakets (sapos)", "precio_unitario");
  formData["Pernos_brakets"].VOLUMEN_EN_M3_X_PIEZA = SearchValue(allData.price_table, "Pernos brakets (sapos)", "volumen_x_pieza_m3");

  descriptions.forEach((description) => {
    const key = Object.keys(formData).find(
      key => key.toLowerCase() === description.toLowerCase()
    );

    // Verificar si encontramos una clave correspondiente en formData
    if (key && formData[key]) {
      const paradas = formData['01_PARADAS'] || 0;
      const unidades = (paradas + 2) * 8; // Cálculo de unidades basado en número de paradas

      // Inicializar variables para usar en los cálculos
      let volumenTotalM3, transporte, aduana, costoFinal;

      // Comprobar si estamos tratando con "Brakets"
      if (description === "Brakets") {
        // Considerar el volumen como 0 para los cálculos
        volumenTotalM3 = 0; // Establece volumen total como 0
        transporte = (valor3 || 0) * volumenTotalM3; // Transporte basado en valor3 y volumen total
        aduana = 0; // Cálculo de aduana considerando 0 en volumen
        costoFinal = aduana + transporte + ((formData[key].PRECIO_UNITARIO || 0) * unidades); // Cálculo del costo final
      } else {
        // Realiza los cálculos normalmente para descripciones que no son "Brakets"
        const precioUnitario = formData[key].PRECIO_UNITARIO || 0; // Utilizar el PRECIO_UNITARIO obtenido
        volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
        transporte = (valor3 || 0) * volumenTotalM3;
        aduana = ((unidades * precioUnitario) + transporte) * 0.3 * 0.5;
        costoFinal = aduana + transporte + (precioUnitario * unidades);
      }

      // Asignar valores calculados a formData
      formData[key].VOLUMEN_TOTAL_M3 = volumenTotalM3;
      formData[key].TRANSPORTE = transporte;
      formData[key].ADUANA = aduana;
      formData[key].COSTO_FINAL = costoFinal;
      formData[key].UNIDADES = unidades; // Se aplica para todos los casos
    }
  });

  return formData;
};

export default updateGrupo2;
