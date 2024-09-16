import SearchValue from "./SearchValue.jsx";

const updateGrupo4 = (formData, valor3, allData) => {

  // Función para encontrar el número de canales basado en la velocidad y el número de personas
  const findGearleesCanales = (velocidadNombre, personas) => {
    const motorData = allData.motors[velocidadNombre];
    const maquina_de_traccion = formData['MaquinaTraccion']?.nombre || '';
    
    if (!motorData || !Array.isArray(motorData.items)) {
      return 0;
    }
  
    const motor = motorData.items.find(item => item.personas >= personas);
  
    if (maquina_de_traccion.toLowerCase().includes("gearlees")) {
      return motor ? motor.gearleesCanales : 0;
    } else if (maquina_de_traccion.toLowerCase().includes("reductor")) {
      return motor ? motor.conReducCanales : 0;
    } else {
      return 0;
    }
  };

  const velocidadClave = formData['Velocidad']?.nombre.replace('/', '_').toLowerCase();
  const personas = formData['03_PERSONAS'] || 0;
  const canales = findGearleesCanales(velocidadClave, personas);

  const descriptions = {
    "Cable_de_traccion": () => {
      const traccion = formData['Traccion'] && formData['Traccion'].nombre.toLowerCase();
      const recorrido = formData['03_RECORRIDO'] || 0;
      let unidades;

      // Fórmula para calcular las unidades basadas en el tipo de tracción y los canales
      if (traccion.includes('1 a 1')) { 
        unidades = recorrido * canales; 
      } else if (traccion.includes('2 a 1')) {
        unidades = recorrido * 2 * canales;
      } else {
        unidades = 1; // Valor predeterminado si no se encuentra tracción específica
      }

      const volumenEnM3XPieza = formData['Cable_de_traccion'].VOLUMEN_EN_M3_X_PIEZA;
      const volumenTotalM3 = unidades * volumenEnM3XPieza;
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * (formData['Cable_de_traccion'].PRECIO_UNITARIO || 0)) + transporte) * 0.3 * 0.5;
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
    "Chumbadores": () => {
      // Unidades de chumbadores es igual al número de canales por 2
      const unidades = canales * 2;

      formData['Chumbadores'] = {
        ...formData['Chumbadores'],
        UNIDADES: unidades
      };

      return unidades;
    },
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
      const aduana = ((unidades * (formData['Poleas']?.PRECIO_UNITARIO || 0)) + transporte) * 0.3 * 0.5;
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
      // Usando SearchValue para encontrar el precio unitario y volumen de la tabla de precios
      const valorBuscado = "Cable de 6mm Regulador de velocidad";
      const precioUnitario = SearchValue(allData.price_table, valorBuscado, "precio_unitario");
      const volumenEnM3XPieza = SearchValue(allData.price_table, valorBuscado, "volumen_x_pieza_m3");

      const volumenTotalM3 = unidades * volumenEnM3XPieza;
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3 * 0.5;
      const costoFinal = aduana + transporte + (precioUnitario * unidades);

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

      if (description !== 'Cable_de_traccion' && description !== 'Poleas') {
        const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
        const transporte = (valor3 || 0) * volumenTotalM3;
        const aduana = ((unidades * (formData[key].PRECIO_UNITARIO || 0)) + transporte) * 0.3 * 0.5;
        const costoFinal = aduana + transporte + ((formData[key].PRECIO_UNITARIO || 0) * unidades);

        formData[key] = {
          ...formData[key],
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
