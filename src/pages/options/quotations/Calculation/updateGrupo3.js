// Archivo: Calculation/updateGrupo3.js

import SearchValue from "./SearchValue.js";

const updateGrupo3 = (formData, valor3, allData) => {
  const descriptions = [
    "Riel_de_cabina",
    "Riel_de_contrapeso"
  ];

  // Definir precios basados en las condiciones
  const personas = formData["03_PERSONAS"] || 0;
  const velocidad = formData["Velocidad"]?.nombre || "";

  // Condición para el precio de Riel de Cabina
  const precioRielCabina = (personas > 9 || velocidad === "2m/s" || velocidad === "1.75m/s") 
    ? 54.67 
    : 35.72;

  // Condición para el precio de Riel de Contrapeso
  const precioRielContrapeso = (velocidad === "2m/s" || velocidad === "1.75m/s") 
    ? 21.65 
    : 17.99;

  // Asignar los precios calculados a los objetos correspondientes en formData
  formData["Riel_de_cabina"].PRECIO_UNITARIO = precioRielCabina;
  formData["Riel_de_contrapeso"].PRECIO_UNITARIO = precioRielContrapeso;

  // Asignar los volúmenes correspondientes desde la tabla de precios
  formData["Riel_de_cabina"].VOLUMEN_EN_M3_X_PIEZA = SearchValue(allData.price_table, "Riel de cabina + Pernos", "volumen_x_pieza_m3");
  formData["Riel_de_contrapeso"].VOLUMEN_EN_M3_X_PIEZA = SearchValue(allData.price_table, "Riel de contrapeso +Pernos", "volumen_x_pieza_m3");

  descriptions.forEach((description) => {
    const key = Object.keys(formData).find(
      key => key.toLowerCase() === description.toLowerCase()
    );

    if (key && formData[key]) {
      const recorrido = formData['03_RECORRIDO'] || 0;
      const unidades = Math.ceil((recorrido / 5) * 2 + Number.EPSILON);
      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * (formData[key].PRECIO_UNITARIO || 0)) + transporte) * 0.3 * 0.5;
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

export default updateGrupo3;
