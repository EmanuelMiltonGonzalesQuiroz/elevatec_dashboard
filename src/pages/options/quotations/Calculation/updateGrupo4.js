const updateGrupo4 = (formData, valor3, allData) => {
  

  // Función para buscar el conReducPrecio según la clase de velocidad y el número de personas
  const findConReducPrecio = (velocidadNombre, personas) => {
    const motorData = allData.motors[velocidadNombre];
    if (!motorData || !Array.isArray(motorData.items)) {
      console.error("No se encontraron items para la velocidad especificada en motors.");
      return 0; // Retornar 0 si no se encuentran datos
    }

    const motor = motorData.items.find(item => {
      const personasRango = item.personas.toLowerCase();
      const personasNumeros = personasRango.includes('-') 
        ? personasRango.split('-').map(p => parseInt(p.trim(), 10))
        : [parseInt(personasRango, 10), parseInt(personasRango, 10)];

      return (
        personas >= personasNumeros[0] && personas <= personasNumeros[1]
      );
    });

    return motor ? motor.conReducPrecio : 0;
  };

  // Convertir la velocidad a la clave correspondiente en allData.motors
  const velocidadClave = formData['Velocidad'].nombre.replace('/', '_').toLowerCase();
  const personas = formData['03_PERSONAS'] || 0;

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

      // Calcular VOLUMEN_EN_M3_X_PIEZA y VOLUMEN_TOTAL_M3 específicos para Cable_de_traccion
      const volumenEnM3XPieza = 0.02 * unidades * 0.02;
      const volumenTotalM3 = volumenEnM3XPieza;
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * (formData['Cable_de_traccion'].PRECIO_UNITARIO || 0)) + transporte) * 0.3;
      const costoFinal = aduana + transporte + ((formData['Cable_de_traccion'].PRECIO_UNITARIO || 0) * unidades);

      // Actualizar formData para Cable_de_traccion
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
      const conReducPrecio = findConReducPrecio(velocidadClave, personas);
      if (traccion.includes('1 a 1')) {
        return 1; 
      } else if (traccion.includes('2 a 1')) {
        formData['Poleas'].PRECIO_UNITARIO = conReducPrecio;
        return 3;
      }
      return 1; // Valor predeterminado
    },
    "Cable_de_8mm": () => {
      const recorrido = formData['03_RECORRIDO'] || 0;
      const unidades = recorrido * 2;
      // Calcular el precio unitario específico para el Cable de 8mm
      const VOLUMEN_EN_M3_X_PIEZA = 0.01 * unidades * 0.01;
      formData['Cable_de_8mm'].VOLUMEN_EN_M3_X_PIEZA = VOLUMEN_EN_M3_X_PIEZA;
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

      // Solo recalcular VOLUMEN_TOTAL_M3, TRANSPORTE, ADUANA y COSTO_FINAL si no es Cable_de_traccion
      if (description !== 'Cable_de_traccion') {
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
    }
  });

  return formData;
};

export default updateGrupo4;
