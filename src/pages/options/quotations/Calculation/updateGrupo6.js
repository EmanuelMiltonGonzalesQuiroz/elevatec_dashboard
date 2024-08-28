// Archivo: Calculation/updateGrupo6.js

const updateGrupo6 = (formData, valor3) => {
  const descriptions = {
    "IndicadorCabinaPiso": 1,
    "IndicadorPisoBoton": formData['01_PARADAS'] || 1,
    "Cableado_de_pisos": formData['03_RECORRIDO'] || 1, // Cambiado a RECORRIDO
    "LOP": formData['01_PARADAS'] || 1,
    "TipoBotonera": 1,
    "BotonesCabina": formData['01_PARADAS'] || 1,
    "BotonesPiso": formData['01_PARADAS'] || 1
  };

  Object.keys(descriptions).forEach(description => {
    const key = Object.keys(formData).find(
      key => key.toLowerCase() === description.toLowerCase()
    );

    if (key && formData[key]) {
      // Crear una copia del objeto para evitar referencias circulares
      const fieldData = { ...formData[key] };

      const unidades = descriptions[description];
      const precioUnitario = fieldData.PRECIO_UNITARIO || fieldData.valor || 0;
      const volumenTotalM3 = unidades * (fieldData.VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3;
      const costoFinal = aduana + transporte + (precioUnitario * unidades);

      // Actualizar la copia y no el objeto original directamente
      formData[key] = {
        ...fieldData,
        UNIDADES: unidades,
        VOLUMEN_TOTAL_M3: volumenTotalM3,
        TRANSPORTE: transporte,
        ADUANA: aduana,
        COSTO_FINAL: costoFinal
      };;
    }
  });

  return formData;
};

export default updateGrupo6;
