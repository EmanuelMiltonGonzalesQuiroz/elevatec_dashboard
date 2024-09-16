const updateGrupo4 = (formData, valor3) => {

  const descriptions = {
    "Cable_de_traccion": () => {
      const traccion = formData['Traccion'] && formData['Traccion'].nombre.toLowerCase();
      const recorrido = formData['03_RECORRIDO'] || 0;
      let unidades;

      if (traccion.includes('1 a 1')) { 
        unidades = recorrido * 5;
      } else if (traccion.includes('2 a 1')) {
        unidades = recorrido * 2 * 5;
      } else {
        unidades = 1; // Valor predeterminado si no se encuentra tracción específica
      }

      const volumenEnM3XPieza = formData['Cable_de_traccion'].VOLUMEN_EN_M3_X_PIEZA;
      const volumenTotalM3 = volumenEnM3XPieza;
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * (formData['Cable_de_traccion'].PRECIO_UNITARIO || 0)) + transporte) * 0.3 *0.5;
      const costoFinal = aduana + transporte + ((formData['Cable_de_traccion'].PRECIO_UNITARIO || 0) * unidades);

      formData['Cable_de_traccion'] = {
        ...formData['Cable_de_traccion'],
        UNIDADES: unidades,
        VOLUMEN_EN_M3_X_PIEZA: volumenEnM3XPieza,
        VOLUMEN_TOTAL_M3: volumenTotalM3,
        TRANSPORTE: transporte,
        ADUANA: aduana,
        COSTO_FINAL: costoFinal
      };

      return unidades;
    },
    "Chumbadores": () => 10,
    "Poleas": () => {
      const traccion = formData['Traccion'] && formData['Traccion'].nombre.toLowerCase();

      let unidades;
      if (traccion.includes('1 a 1')) {
        unidades = 1;
      } else if (traccion.includes('2 a 1')) {
        unidades = 3;
      } else {
        unidades = 1; // Valor predeterminado
      }

      const volumenEnM3XPieza = formData['Poleas']?.VOLUMEN_EN_M3_X_PIEZA || 0;
      const volumenTotalM3 = unidades * volumenEnM3XPieza;
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * (formData['Poleas']?.PRECIO_UNITARIO || 0)) + transporte) * 0.3 *0.5;
      const costoFinal = aduana + transporte + ((formData['Poleas']?.PRECIO_UNITARIO || 0) * unidades);

      formData['Poleas'] = {
        ...formData['Poleas'],
        UNIDADES: unidades,
        VOLUMEN_TOTAL_M3: volumenTotalM3,
        TRANSPORTE: transporte,
        ADUANA: aduana,
        COSTO_FINAL: costoFinal,
      };

      return unidades;
    },
    "Cable_de_8mm": () => {
      const recorrido = formData['03_RECORRIDO'] || 0;
      const unidades = recorrido * 2;

      // Calcular el precio unitario específico para el Cable de 8mm
      const precioUnitario = 0.01 * (recorrido * 2) * 0.01;
      const volumenEnM3XPieza = formData['Cable_de_8mm'].VOLUMEN_EN_M3_X_PIEZA ; // Usar el precio unitario como volumen por pieza
      const volumenTotalM3 = unidades * volumenEnM3XPieza;
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3 *0.5;
      const costoFinal = aduana + transporte + (precioUnitario * unidades);

      // Actualizar formData para Cable_de_8mm
      formData['Cable_de_8mm'] = {
        ...formData['Cable_de_8mm'],
        UNIDADES: unidades,
        VOLUMEN_EN_M3_X_PIEZA: volumenEnM3XPieza,
        VOLUMEN_TOTAL_M3: volumenTotalM3,
        PRECIO_UNITARIO: precioUnitario,
        TRANSPORTE: transporte,
        ADUANA: aduana,
        COSTO_FINAL: costoFinal
      };

      return unidades;
    },
    "Cadena_de_compensacion": () => formData['01_PARADAS'] >= 10 ? 2 : 0,
    "ACCESORIOS_DE_CADENA_DE_COMPENSACION": () => formData['01_PARADAS'] >= 10 ? 2 : 0,

  };

  Object.keys(descriptions).forEach(description => {
    const key = Object.keys(formData).find(
      key => key.toLowerCase() === description.toLowerCase()
    );

    if (key && formData[key]) {
      const unidades = descriptions[description]();

      // Recalcular VOLUMEN_TOTAL_M3, TRANSPORTE, ADUANA y COSTO_FINAL si no es Cable_de_traccion o Poleas
      if (description !== 'Cable_de_traccion' && description !== 'Poleas') {
        const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
        const transporte = (valor3 || 0) * volumenTotalM3;
        const aduana = ((unidades * (formData[key].PRECIO_UNITARIO || 0)) + transporte) * 0.3 *0.5;
        const costoFinal = aduana + transporte + ((formData[key].PRECIO_UNITARIO || 0) * unidades);

        formData[key] = {
          ...formData[key], // Mantener los valores existentes
          UNIDADES: unidades,
          VOLUMEN_TOTAL_M3: volumenTotalM3,
          TRANSPORTE: transporte,
          ADUANA: aduana,
          COSTO_FINAL: costoFinal
        };
      }
    }
  });

  return formData;
};

export default updateGrupo4;
