import areStringsSimilar from './areStringsSimilar.js';

const updateGrupo7 = (formData, valor3, allData) => {
  // Acceder a los items dentro de la tabla de precios y los grupos
  const priceTableItems = allData.price_table && allData.price_table["price table"] ? allData.price_table["price table"].items : [];
  const pasamanosGroup = allData.groups["Pasamanos adicional"]?.items || [];
  const espejoGroup = allData.groups["Espejo Adicional"]?.items || [];

  const formDataKeys = Object.keys(formData);

  const findPriceTableItem = (name) => {
    return priceTableItems.find(item => areStringsSimilar(item.name, name));
  };

  const findGroupItemByName = (groupItems, name) => {
    return groupItems.find(item => item.nombre === name);
  };

  const descriptions = {
    "Llavines_con_llave": formData['Llavines_con_llave']?.UNIDADES || 0,
    "Pasamanos_adicional": parseInt(formData['PasamanosAdicional']?.nombre || 0, 10),  // Cargar unidades desde nombre
    "Espejo_adicional": parseInt(formData['EspejoAdicional']?.nombre || 0, 10),  // Cargar unidades desde nombre
    "Sistema_de_monitoreo": formData['Sistema_de_monitoreo']?.UNIDADES || 0,
    "Pre_Apertura_de_puertas": formData['Pre_Apertura_de_puertas']?.UNIDADES || 0,
    "Aire_acondicionado": formData['Aire_acondicionado']?.UNIDADES || 0,
    "Ventiladores": () => {
      // Si EnergiaElectrica tiene 220 en su nombre, asigna 1 unidad a Ventiladores, de lo contrario 0
      return formData['EnergiaElectrica']?.nombre?.includes('220') ? 1 : 0;
    },
    "AutoTransformador": formData['AutoTransformador']?.UNIDADES || 0,
    "ARD": formData['ARD']?.UNIDADES || 0,
    "LectorTarjetas": formData['LectorTarjetas']?.UNIDADES || 0
  };

  Object.keys(descriptions).forEach(description => {
    const key = formDataKeys.find(key => areStringsSimilar(key, description));

    if (key && formData[key]) {
      let unidades = typeof descriptions[description] === 'function' ? descriptions[description]() : descriptions[description];
      let precioUnitario = 0;
      let volumenPorPieza = 0;

      // Condiciones especiales para ARD
      if (description === "ARD") {
        if (formData['ARD']?.nombre?.includes("No requiere!")) {
          unidades = 0;
        }
      }

      // Condiciones especiales para AutoTransformador
      if (description === "AutoTransformador") {
        if (formData['EnergiaElectrica']?.nombre?.includes("220")) {
          unidades = 1;
        } else {
          unidades = 0;
        }
      }

      // Para Pasamanos_adicional y Espejo_adicional, obtener precio_unitario desde los grupos y volumen desde la tabla de precios
      if (description === "Pasamanos_adicional") {
        const itemData = findPriceTableItem("Pasamanos adional");
        volumenPorPieza = itemData ? itemData.volumen_x_pieza_m3 : 0;

        const groupItem = findGroupItemByName(pasamanosGroup, formData['PasamanosAdicional']?.nombre);
        precioUnitario = groupItem ? groupItem.valor : 0;

        // Actualización en formData de las unidades y precio unitario
        formData['PasamanosAdicional'].UNIDADES = unidades;
        formData['PasamanosAdicional'].PRECIO_UNITARIO = precioUnitario;

      } else if (description === "Espejo_adicional") {
        const itemData = findPriceTableItem("espejo adicional");
        volumenPorPieza = itemData ? itemData.volumen_x_pieza_m3 : 0;

        const groupItem = findGroupItemByName(espejoGroup, formData['EspejoAdicional']?.nombre);
        precioUnitario = groupItem ? groupItem.valor : 0;

        // Actualización en formData de las unidades y precio unitario
        formData['EspejoAdicional'].UNIDADES = unidades;
        formData['EspejoAdicional'].PRECIO_UNITARIO = precioUnitario;
      } else if (description === "Ventiladores") {
        // Usar el valor de formData['Ventilación'].valor como precio unitario para Ventiladores
        precioUnitario = formData['Ventilación']?.valor || 0;
        volumenPorPieza = formData[key].VOLUMEN_EN_M3_X_PIEZA || 0;
      } else {
        // Otros elementos, usar lógica de búsqueda normal
        precioUnitario = formData[key].PRECIO_UNITARIO || formData[key].valor || 0;
        volumenPorPieza = formData[key].VOLUMEN_EN_M3_X_PIEZA || 0;
      }

      // Calcular los valores basados en unidades y volúmenes
      const volumenTotalM3 = unidades * volumenPorPieza;
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3;
      const costoFinal = aduana + transporte + (precioUnitario * unidades);

      // Actualizar los valores en formData
      formData[key].UNIDADES = unidades;
      formData[key].VOLUMEN_TOTAL_M3 = volumenTotalM3;
      formData[key].TRANSPORTE = transporte;
      formData[key].ADUANA = aduana;
      formData[key].COSTO_FINAL = costoFinal;

      // Actualizar también las unidades y precio unitario en PasamanosAdicional y EspejoAdicional si corresponde
      if (description === "Pasamanos_adicional") {
        formData['PasamanosAdicional'].UNIDADES = unidades;
        formData['PasamanosAdicional'].PRECIO_UNITARIO = precioUnitario;
      } else if (description === "Espejo_adicional") {
        formData['EspejoAdicional'].UNIDADES = unidades;
        formData['EspejoAdicional'].PRECIO_UNITARIO = precioUnitario;
      } else if (description === "Ventiladores") {
        formData['Ventiladores'].UNIDADES = unidades;
        formData['Ventiladores'].PRECIO_UNITARIO = precioUnitario;
      }
    }
  });

  return formData;
};

export default updateGrupo7;
