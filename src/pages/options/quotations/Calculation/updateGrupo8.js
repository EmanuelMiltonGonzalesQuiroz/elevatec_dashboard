import areStringsSimilar from './areStringsSimilar.js';
import SearchValue from './SearchValue.js';

const updateGrupo8 = (formData, valor3, allData) => {
  
  const descriptions = {
    "Embarque_Simple_Doble_Triple": formData['Embarque']?.UNIDADES || 0,
    "MRL_MR": formData['Tipo']?.UNIDADES || 0,
    "Pesacarga": formData['Pesacarga']?.valor === 0 || formData['Pesacarga']?.valor === undefined ? 0 : 1,
    "Regenerador_de_energia": formData['Regenerador_de_energia']?.valor === 0 || formData['Regenerador_de_energia']?.valor === undefined ? 0 : 1,
    "Indicador_de_solo_boton": formData['Indicador_de_solo_boton']?.UNIDADES || 0 // Nueva adición
  };

  Object.keys(descriptions).forEach(description => {
    const key = Object.keys(formData).find(
      key => areStringsSimilar(key, description)
    );

    if (key && formData[key]) {
      let unidades = descriptions[description];  // No buscar si ya tienen unidades

      // Solo realizar la búsqueda y los cálculos si `unidades` es 0
      if (unidades === 0 && description !== "Pesacarga" && description !== "Regenerador_de_energia") {
        unidades = typeof descriptions[description] === 'function' ? descriptions[description]() : descriptions[description];
    }
    

      // Para Embarque_Simple_Doble_Triple, se asegura que se usa formData['Embarque'].valor como precio unitario
      let precioUnitario;
      if (description === "Embarque_Simple_Doble_Triple") {
        precioUnitario = formData['Embarque']?.valor || 0;
      } else {
        precioUnitario = formData[key].PRECIO_UNITARIO || formData[key].valor || 0;
      }

      // Ajustar precio unitario para MRL_MR desde 'Tipo'
      if (description === "MRL_MR") {
        precioUnitario = formData['Tipo']?.valor || 0;
      }

      // Para Indicador_de_solo_boton, asegurar que el precio unitario se toma de 'valor'
      if (description === "Indicador_de_solo_boton") {
        precioUnitario = formData['Indicador_de_solo_boton']?.valor || 0;
        formData["Indicador_de_solo_boton"].VOLUMEN_EN_M3_X_PIEZA = SearchValue(allData.price_table, "Indicador_de_solo_botón", "volumen_x_pieza_m3");
      }

      // Actualizar el precio unitario para Regenerador_de_energia
      if (description === "Regenerador_de_energia") {
        precioUnitario = formData['Regenerador_de_energia']?.valor || 0;
      }

      // Para Pesacarga, establecer unidades temporalmente en 1 si son 0
      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3 * 0.5;
      const costoFinal = aduana + transporte + (precioUnitario * unidades);

      // Guardar los valores calculados en formData[key]
      formData[key].UNIDADES = unidades;
      formData[key].PRECIO_UNITARIO = precioUnitario;
      formData[key].VOLUMEN_TOTAL_M3 = volumenTotalM3;
      formData[key].TRANSPORTE = transporte;
      formData[key].ADUANA = aduana;
      formData[key].COSTO_FINAL = costoFinal;
    }
  });

  return formData;
};

export default updateGrupo8;
