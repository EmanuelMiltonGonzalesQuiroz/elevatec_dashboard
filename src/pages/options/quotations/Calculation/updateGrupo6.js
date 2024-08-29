const updateGrupo6 = (formData, valor3) => {
  const descriptions = {
    "Indicador_de_Cabina": 1,
    "Indicador_de_piso": formData['01_PARADAS'] || 1,
    "Cableado_de_pisos": formData['03_RECORRIDO'] || 1, // Cambiado a RECORRIDO
    "LOP": formData['01_PARADAS'] || 1,
    "TipoBotonera": 1,
    "BotonesCabina": formData['01_PARADAS'] || 1,
    "BotonesPiso": formData['01_PARADAS'] || 1,
    "Tipo_de_Botonera_COP": 1,
    "Botones_de_cabina": formData['01_PARADAS'] || 1,
    "Botones_de_piso": formData['01_PARADAS'] || 1
  };

  Object.keys(descriptions).forEach(description => {
    const key = Object.keys(formData).find(
      key => key.toLowerCase() === description.toLowerCase()
    ); 

    if (key && formData[key]) {
      // Crear una copia del objeto para evitar referencias circulares
      const fieldData = { ...formData[key] };

      const unidades = descriptions[description];
      let precioUnitario = fieldData.PRECIO_UNITARIO || fieldData.valor || 0;

      // Ajustar precio unitario según el tipo
      if (description === "Indicador_de_Cabina") {
        precioUnitario = formData['IndicadorCabinaPiso']?.valor || precioUnitario;
      } else if (description === "Indicador_de_piso") {
        precioUnitario = formData['IndicadorPisoBoton']?.valor || precioUnitario;
      } else if (description === "Tipo_de_Botonera_COP") {
        precioUnitario = formData['TipoBotonera']?.valor || precioUnitario;
      } else if (description === "Botones_de_cabina") {
        precioUnitario = formData['BotonesCabina']?.valor || precioUnitario;
      } else if (description === "Botones_de_piso") {
        precioUnitario = formData['BotonesPiso']?.valor || precioUnitario;
      }

      const volumenTotalM3 = unidades * (fieldData.VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3;
      const costoFinal = aduana + transporte + (precioUnitario * unidades);

      // Actualizar la copia y no el objeto original directamente
      formData[key] = {
        ...fieldData,
        UNIDADES: unidades,
        PRECIO_UNITARIO: precioUnitario,
        VOLUMEN_TOTAL_M3: volumenTotalM3,
        TRANSPORTE: transporte,
        ADUANA: aduana,
        COSTO_FINAL: costoFinal
      };
    }
  });

  return formData;
};

export default updateGrupo6;
