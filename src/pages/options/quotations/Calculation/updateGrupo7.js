import areStringsSimilar from './areStringsSimilar.js';

const updateGrupo7 = (formData, valor3, allData) => {
  // Accediendo a los items dentro de la tabla de precios
  const priceTableItems = allData.price_table && allData.price_table["price table"] ? allData.price_table["price table"].items : [];

  const formDataKeys = Object.keys(formData);

  const findPriceTableItem = (name) => {
    return priceTableItems.find(item => areStringsSimilar(item.name, name));
  };

  const descriptions = {
    "Llavines_con_llave": formData['Llavines_con_llave']?.UNIDADES || 0,
    "Pasamanos_adicional": parseInt(formData['PasamanosAdicional']?.nombre || 0, 10),  // Cargar unidades desde nombre
    "Espejo_adicional": parseInt(formData['EspejoAdicional']?.nombre || 0, 10),  // Cargar unidades desde nombre
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
      let unidades = descriptions[description];
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

      // Para Pasamanos_adicional y Espejo_adicional, obtener precio_unitario y volumen_x_pieza_m3 desde la tabla de precios
      if (description === "Pasamanos_adicional" || description === "Espejo_adicional") {
        const itemData = findPriceTableItem(description === "Pasamanos_adicional" ? "Pasamanos adional" : "espejo adicional");
        precioUnitario = itemData ? itemData.precio_unitario : 0;
        volumenPorPieza = itemData ? itemData.volumen_x_pieza_m3 : 0;

        // Mostrar en consola los valores obtenidos para Pasamanos_adicional y Espejo_adicional
      } else {
        // Otros elementos, usar lógica de búsqueda normal
        precioUnitario = formData[key].PRECIO_UNITARIO || formData[key].valor || 0;
        volumenPorPieza = formData[key].VOLUMEN_EN_M3_X_PIEZA || 0;
      }

      const volumenTotalM3 = unidades * volumenPorPieza;
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3;
      const costoFinal = aduana + transporte + (precioUnitario * unidades);

      formData[key].UNIDADES = unidades;
      formData[key].VOLUMEN_TOTAL_M3 = volumenTotalM3;
      formData[key].TRANSPORTE = transporte;
      formData[key].ADUANA = aduana;
      formData[key].COSTO_FINAL = costoFinal;

      // Actualizar también las unidades y precio unitario en PasamanosAdicional y EspejoAdicional
      if (description === "Pasamanos_adicional") {
        formData['PasamanosAdicional'].UNIDADES = unidades;
        formData['PasamanosAdicional'].PRECIO_UNITARIO = precioUnitario;
      } else if (description === "Espejo_adicional") {
        formData['EspejoAdicional'].UNIDADES = unidades;
        formData['EspejoAdicional'].PRECIO_UNITARIO = precioUnitario;
      }
    }
  });

  // Mostrar resultados finales en consola

  return formData;
};

export default updateGrupo7;
