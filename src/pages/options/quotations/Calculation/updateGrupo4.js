// Archivo: Calculation/updateGrupo4.js

const updateGrupo4 = (formData, valor3) => {
  const descriptions = {
    "Cable_de_traccion": () => {
      const traccion = formData['Traccion'] && formData['Traccion'].nombre.toLowerCase();
      const recorrido = formData['03_RECORRIDO'] || 0;
      if (traccion.includes('1 a 1')) {
        return recorrido * 5;
      } else if (traccion.includes('2 a 1')) {
        return recorrido * 2 * 5;
      }
      return 1; // Valor predeterminado si no se encuentra tracción específica
    },
    "Chumbadores": () => 10,
    "Poleas": () => {
      const traccion = formData['Traccion'] && formData['Traccion'].nombre.toLowerCase();
      if (traccion.includes('1 a 1')) {
        return 1;
      } else if (traccion.includes('2 a 1')) {
        return 3;
      }
      return 1; // Valor predeterminado
    },
    "Cable_de_8mm": () => {
      const recorrido = formData['03_RECORRIDO'] || 0;
      const unidades = recorrido * 2;
      // Calcular el precio unitario específico para el Cable de 8mm
      const precioUnitario = 0.01 * unidades * 0.01;
      formData['Cable_de_8mm'].PRECIO_UNITARIO = precioUnitario;
      return unidades;
    },
    "Cadena_de_compensacion": () => 2
  };

  Object.keys(descriptions).forEach(description => {
    const key = Object.keys(formData).find(
      key => key.toLowerCase() === description.toLowerCase()
    );

    if (key && formData[key]) {
      const unidades = descriptions[description]();

      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * (formData[key].PRECIO_UNITARIO || 0)) + transporte) * 0.3;
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
  });

  return formData;
};

export default updateGrupo4;
