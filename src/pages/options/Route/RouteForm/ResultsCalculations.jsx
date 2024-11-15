export const calculateResults = (routeData, allData) => {
  let result = {};
  let totalPoblacion = 0;
  let poblacionServida = 0;
  let pisos = 0;
  let Ancho;
  let Tiempo_de_apaertura_Cabina;
  let Detencion;
  let Valor_de_Salto;
  let Velocidad_Desarrollada;
  const alt_entre_pisos = 4;
  let Distancia_Recorrida;
  let Tiempo_de_Recorrido_con_Detenciones_Parciales;
  let Tiempo_Sumado_Aceleracion;
  let Aceleracion_Desaceleracion;
  let Tiempo_de_Entrada_y_Salida_de_Pasajeros;
  let Tiempo_Total_Puerta;
  let Tiempo_de_apaertura_cierre_de_Cabina;
  let Tiempo_de_Recuperacion;
  const Recuperacion = 0.2;
  let Tiempo_total;
  let Pasajeros_Atendidos_en_5_min;
  let Cabinas_Nesesarias;
  let Mensaje = "x";

  const data = routeData[0];
  const modifiedResults = data.modifiedResults || {};
  const Hospital = data.TipoDeEdificio?.Nombre?.includes("Hospital");

  if (data) {
    const { PISOS, Pasajeros, TipoDeEdificio } = data;

    // Use modified Pisos if available
    pisos = modifiedResults.Pisos !== undefined ? parseInt(modifiedResults.Pisos) : parseInt(PISOS) || 0;

    // Use modified Pasajeros if available
    totalPoblacion = modifiedResults.totalPoblacion !== undefined ? parseInt(modifiedResults.totalPoblacion) : parseInt(Pasajeros) || 0;

    // Calculate poblacionServida
    if (data["Población Servida"]) {
      poblacionServida = parseInt(data["Población Servida"]) || 0;
    } else if (TipoDeEdificio && TipoDeEdificio["m^2"] && TipoDeEdificio.Persona) {
      if (
        routeData[0][`piso_1_m2`] !== undefined &&
        !isNaN(parseFloat(routeData[0][`piso_1_m2`]))
      ) {
        poblacionServida = calcularPoblacionPorM2(routeData, allData, pisos);
      } else if (
        routeData[0][`piso_1_AREAS`] !== undefined ||
        routeData[0][`piso_1_DEPARTAMENTOS`] !== undefined ||
        routeData[0][`piso_1_HABITACIONES`] !== undefined
      ) {
        poblacionServida = calcularPoblacionPorPiso(routeData, allData, pisos);
      }
    } else if (Pasajeros && !isNaN(parseInt(Pasajeros))) {
      poblacionServida = parseInt(Pasajeros) || 0;
    }

    // Ancho
    Ancho = encontrarAnchoPorPasajeros(totalPoblacion, allData, Hospital);

    // Tiempo_de_apaertura_Cabina
    Tiempo_de_apaertura_Cabina = encontrarTiempoDeApertura(
      Ancho,
      data["Detencion Puertas"],
      allData
    );

    // Detencion
    Detencion = encontrarConfiguracionPorPisosYPasajeros(pisos, totalPoblacion, allData);

    // Valor_de_Salto
    Valor_de_Salto = (pisos * alt_entre_pisos) / Detencion;

    // Velocidad_Desarrollada
    if (modifiedResults.Velocidad_Desarrollada !== undefined) {
      Velocidad_Desarrollada = parseFloat(modifiedResults.Velocidad_Desarrollada);
    } else {
      Velocidad_Desarrollada = encontrarVelocidadDesarrolladaPorValorDeSalto(
        Valor_de_Salto,
        allData
      );
      if (Velocidad_Desarrollada <= 1) {
        Velocidad_Desarrollada = 1;
      } else if (Velocidad_Desarrollada <= 1.5) {
        Velocidad_Desarrollada = 1.5;
      } else if (Velocidad_Desarrollada <= 1.75) {
        Velocidad_Desarrollada = 1.75;
      } else {
        Velocidad_Desarrollada = 2;
      }
    }

    // Distancia_Recorrida
    Distancia_Recorrida = pisos * alt_entre_pisos;

    // Tiempo_de_Recorrido_con_Detenciones_Parciales
    Tiempo_de_Recorrido_con_Detenciones_Parciales =
      Distancia_Recorrida / Velocidad_Desarrollada;

    // Tiempo_Sumado_Aceleracion
    Tiempo_Sumado_Aceleracion = encontrarTiemposSumadosPorVelocidad(
      Velocidad_Desarrollada,
      allData
    );

    // Aceleracion_Desaceleracion
    Aceleracion_Desaceleracion = Detencion * Tiempo_Sumado_Aceleracion;

    // Tiempo_Total_Puerta
    Tiempo_Total_Puerta = encontrarTiempoTotalPorAnchoDePuerta(Ancho, allData);

    // Tiempo_de_Entrada_y_Salida_de_Pasajeros
    Tiempo_de_Entrada_y_Salida_de_Pasajeros = totalPoblacion * Tiempo_Total_Puerta;

    // Tiempo_de_apaertura_cierre_de_Cabina
    Tiempo_de_apaertura_cierre_de_Cabina = Detencion * Tiempo_de_apaertura_Cabina;

    // Tiempo_de_Recuperacion
    Tiempo_de_Recuperacion = Detencion * Recuperacion;

    // Tiempo_total
    if (modifiedResults.Tiempo_total !== undefined) {
      Tiempo_total = parseFloat(modifiedResults.Tiempo_total);
    } else {
      Tiempo_total =
        Tiempo_de_Recorrido_con_Detenciones_Parciales +
        Aceleracion_Desaceleracion +
        Tiempo_de_Entrada_y_Salida_de_Pasajeros +
        Tiempo_de_apaertura_cierre_de_Cabina +
        Tiempo_de_Recuperacion;
    }

    // Pasajeros_Atendidos_en_5_min
    if (modifiedResults.Pasajeros_Atendidos_en_5_min !== undefined) {
      Pasajeros_Atendidos_en_5_min = parseFloat(modifiedResults.Pasajeros_Atendidos_en_5_min);
      if (modifiedResults.Tiempo_total === undefined) {
        Tiempo_total = (5 * 60 * totalPoblacion) / Pasajeros_Atendidos_en_5_min;
      }
    } else {
      Pasajeros_Atendidos_en_5_min = (5 * 60 * totalPoblacion) / Tiempo_total;
    }

    // Cabinas_Nesesarias
    if (modifiedResults.Cabinas_Nesesarias !== undefined) {
      Cabinas_Nesesarias = parseInt(modifiedResults.Cabinas_Nesesarias);
    } else {
      Cabinas_Nesesarias = Math.ceil(poblacionServida / Pasajeros_Atendidos_en_5_min);
    }

    // Mensaje
    if (
      data.TipoDeEdificio &&
      data.TipoDeEdificio["intervalo de espera seg."] &&
      data.TipoDeEdificio["intervalo de espera seg."].length >= 2
    ) {
      const intervaloEsperaMin = data.TipoDeEdificio["intervalo de espera seg."][0];
      const intervaloEsperaMax = data.TipoDeEdificio["intervalo de espera seg."][1];

      if (Tiempo_total <= intervaloEsperaMin - 15) {
        Mensaje = "Excelente";
      } else if (
        Tiempo_total > intervaloEsperaMin - 15 &&
        Tiempo_total <= intervaloEsperaMax + 15
      ) {
        Mensaje = "Óptimo";
      } else if (Tiempo_total <= intervaloEsperaMax + 15) {
        Mensaje = "Regular";
      } else if (Tiempo_total <= intervaloEsperaMax + 30) {
        Mensaje = "Bajo";
      } else if (Tiempo_total > intervaloEsperaMax + 30) {
        Mensaje = "Pésimo";
      }
    } else {
      Mensaje = "No disponible";
    }
  }

  result = {
    Pisos: pisos,
    totalPoblacion: totalPoblacion,
    poblacionServida: poblacionServida,
    Ancho: Ancho,
    Tiempo_de_apaertura_Cabina: Tiempo_de_apaertura_Cabina,
    Detencion: Detencion,
    Valor_de_Salto: Valor_de_Salto,
    Velocidad_Desarrollada: Velocidad_Desarrollada,
    Distancia_Recorrida: Distancia_Recorrida,
    Tiempo_de_Recorrido_con_Detenciones_Parciales:
      Tiempo_de_Recorrido_con_Detenciones_Parciales,
    Tiempo_Sumado_Aceleracion: Tiempo_Sumado_Aceleracion,
    Aceleracion_Desaceleracion: Aceleracion_Desaceleracion,
    Tiempo_Total_Puerta: Tiempo_Total_Puerta,
    Tiempo_de_Entrada_y_Salida_de_Pasajeros: Tiempo_de_Entrada_y_Salida_de_Pasajeros,
    Tiempo_de_apaertura_cierre_de_Cabina: Tiempo_de_apaertura_cierre_de_Cabina,
    Tiempo_de_Recuperacion: Tiempo_de_Recuperacion,
    Tiempo_total: Tiempo_total,
    Pasajeros_Atendidos_en_5_min: Pasajeros_Atendidos_en_5_min,
    Cabinas_Nesesarias: Cabinas_Nesesarias,
    Mensaje: Mensaje,
  };

  return result;
};



const encontrarTiempoTotalPorAnchoDePuerta = (ancho, allData) => {
  const puertasData = allData.puertas_tiempo_total[0].data;
  const anchoNumerico = parseFloat(ancho);

  // Buscar el tiempo correspondiente al ancho o el inmediato superior
  const tiempoEncontrado = puertasData.find((puerta) => {
    const [minAncho, maxAncho] = puerta["ANCHO DE PUERTA (m)"].split(" - ").map(parseFloat);
    return anchoNumerico >= minAncho && anchoNumerico <= (maxAncho || minAncho);
  });

  // Si no se encuentra una coincidencia exacta, elegir el inmediato superior
  if (!tiempoEncontrado) {
    return puertasData.find((puerta) => {
      const minPuertaAncho = parseFloat(puerta["ANCHO DE PUERTA (m)"].split(" - ")[0]);
      return anchoNumerico <= minPuertaAncho;
    })?.["TIEMPO TOTAL (seg.)"] || null;
  }

  return tiempoEncontrado["TIEMPO TOTAL (seg.)"];
};

const encontrarTiemposSumadosPorVelocidad = (velocidad, allData) => {
  const tiemposData = allData.velocidades_tiempos[0].data;

  // Ordenar por velocidad para garantizar el inmediato superior
  const tiemposOrdenados = tiemposData.sort((a, b) => a["VELOCIDADES (m/s)"] - b["VELOCIDADES (m/s)"]);

  // Encontrar el tiempo correspondiente o el inmediato superior si no existe una coincidencia exacta
  const tiempoEncontrado = tiemposOrdenados.find(
    (entry) => entry["VELOCIDADES (m/s)"] >= velocidad
  );

  return tiempoEncontrado ? tiempoEncontrado["TIEMPOS SUMADOS DE ACELERACIÓN Y DESACELERACIÓN (m/s)"] : null;
};

const encontrarVelocidadDesarrolladaPorValorDeSalto = (valorDeSalto, allData) => {
  // Obtener los datos de valores de salto desde allData
  const valoresDeSaltoData = allData.valores_de_salto[0].data;

  // Ordenar los valores de salto para facilitar la búsqueda
  const valoresOrdenados = valoresDeSaltoData.sort((a, b) => a["VALORES DE SALTO (m)"] - b["VALORES DE SALTO (m)"]);

  // Encontrar la configuración más cercana al valor de salto sin excederlo
  let configuracionEncontrada = valoresOrdenados.find(config => config["VALORES DE SALTO (m)"] >= valorDeSalto);

  // Si no se encuentra una configuración igual o superior, tomar la última (máxima)
  if (!configuracionEncontrada) {
    configuracionEncontrada = valoresOrdenados[valoresOrdenados.length - 1];
  }

  // Retornar la velocidad desarrollada de la configuración encontrada
  return configuracionEncontrada["VELOCIDAD DESARROLLADA (m/s)"];
};

const encontrarConfiguracionPorPisosYPasajeros = (pisos, pasajeros, allData) => {
  // Obtener los datos de configuraciones de pisos desde allData
  const configuracionesDePisos = allData.configuraciones_de_pisos[0].data;

  // Ordenar las configuraciones de pisos en función del número de pisos
  const configuracionesOrdenadas = configuracionesDePisos.sort((a, b) => a.pisos - b.pisos);

  // Encontrar la configuración más cercana en número de pisos sin excederse
  let configuracionSeleccionada = configuracionesOrdenadas.find((config) => config.pisos >= pisos);

  // Si no se encuentra una configuración con el mismo o más pisos, tomar la última (máxima)
  if (!configuracionSeleccionada) {
    configuracionSeleccionada = configuracionesOrdenadas[configuracionesOrdenadas.length - 1];
  }

  // Obtener el valor asociado al número de pasajeros en la configuración seleccionada
  let valorPasajeros = configuracionSeleccionada[pasajeros];

  // Si no existe un valor exacto para el número de pasajeros, tomar el valor más cercano sin excederse
  if (valorPasajeros === undefined) {
    const pasajerosDisponibles = Object.keys(configuracionSeleccionada)
      .filter(key => !isNaN(key)) // Filtrar solo las claves numéricas (que representan pasajeros)
      .map(key => parseInt(key))
      .sort((a, b) => a - b);

    // Encontrar el valor más cercano sin excederse
    valorPasajeros = pasajerosDisponibles.find((p) => p >= pasajeros) 
      ? configuracionSeleccionada[pasajerosDisponibles.find((p) => p >= pasajeros)]
      : configuracionSeleccionada[pasajerosDisponibles[pasajerosDisponibles.length - 1]];
  }

  return valorPasajeros;
};


const calcularPoblacionPorM2 = (routeData, allData, pisos) => {
  let totalPoblacionServida = 0;
  const edificiosData = allData.configuraciones_de_edificios[0].data;

  for (let i = 1; i <= pisos; i++) {
    // Obtener tipo de edificio y metros cuadrados de cada piso
    const tipoEdificio = routeData[0][`piso_${i}_tipoEdificio`];
    const m2Piso = parseFloat(routeData[0][`piso_${i}_m2`]);

    if (tipoEdificio && m2Piso) {
      // Buscar configuración del edificio
      const edificioConfig = edificiosData.find(
        (edificio) => edificio.Nombre === tipoEdificio
      );

      if (edificioConfig && edificioConfig.Persona && edificioConfig["m^2"]) {
        const personasPorM2 = parseFloat(edificioConfig.Persona);
        const m2Edificio = parseFloat(edificioConfig["m^2"]);

        // Calcular la población servida en este piso
        const poblacionPiso = Math.ceil(((m2Piso * personasPorM2) / m2Edificio) * ( parseFloat(edificioConfig["Demora recomendable"]) / 100));

        // Acumular la población servida total
        totalPoblacionServida += poblacionPiso;
      } 
    } 
  }

  return totalPoblacionServida;
};

const calcularPoblacionPorPiso = (routeData, allData, pisos) => {
  let totalPoblacionServida = 0;
  const edificiosData = allData.configuraciones_de_edificios[0].data;

  for (let i = 1; i <= pisos; i++) {
    // Obtener tipo de edificio y sumar personas en subáreas dinámicamente
    const tipoEdificio = routeData[0][`piso_${i}_tipoEdificio`];
    
    // Sumar todas las personas en las subáreas de este piso
    const subAreas = ["AREAS", "DEPARTAMENTOS", "HABITACIONES", "AUTOMOVILES"];
    let personasPorPiso = 0;

    subAreas.forEach((subArea) => {
      const cantidad = parseInt(routeData[0][`piso_${i}_${subArea}`] || 0);
      for (let j = 1; j <= cantidad; j++) {
        const clavePersona = `piso_${i}_piso_${i}_${subArea}_${j}_personas`;
        personasPorPiso += parseInt(routeData[0][clavePersona] || 0);
      }
    });

    if (tipoEdificio && personasPorPiso) {
      // Buscar configuración del edificio
      const edificioConfig = edificiosData.find(
        (edificio) => edificio.Nombre === tipoEdificio
      );

      if (edificioConfig && edificioConfig.Persona && edificioConfig["Demora recomendable"]) {
        const personasPorUnidad = parseFloat(edificioConfig.Persona);
        const demoraRecomendable = parseFloat(edificioConfig["Demora recomendable"]) / 100;

        // Calcular la población servida en este piso y redondear al entero superior
        const poblacionPiso = Math.ceil(personasPorPiso * personasPorUnidad * demoraRecomendable);

        // Acumular la población servida total
        totalPoblacionServida += poblacionPiso;
      }
    }
  }

  return totalPoblacionServida;
};

const encontrarAnchoPorPasajeros = (pasajeros, allData, esHospital) => {
  // Seleccionar la configuración adecuada basada en si es un hospital o no
  const configuraciones = esHospital 
    ? allData.configuraciones_de_ascensor[0].data 
    : allData.puertas_info[0].data;

  // Ordenar las configuraciones por número de pasajeros para facilitar la búsqueda
  const configuracionesOrdenadas = configuraciones.sort((a, b) => a.Pasajeros - b.Pasajeros);

  // Encontrar la configuración más cercana al número de pasajeros
  let configuracionEncontrada = configuracionesOrdenadas.find(
    (config) => config.Pasajeros >= pasajeros
  );

  // Si no se encuentra una configuración igual o superior, tomar la última (máxima)
  if (!configuracionEncontrada) {
    configuracionEncontrada = configuracionesOrdenadas[configuracionesOrdenadas.length - 1];
  }

  // Retornar el ancho de la configuración encontrada
  return configuracionEncontrada.Ancho;
};

const encontrarTiempoDeApertura = (ancho, direccionApertura, allData) => {
  // Obtener los datos de las puertas desde allData
  const puertasData = allData.puertas_datos[0].data;

  // Convertir el ancho de puerta a un número para comparar
  const anchoNumerico = parseFloat(ancho);

  // Encontrar el rango adecuado de ancho
  const rangoEncontrado = puertasData.find((puerta) => {
    const [minAncho, maxAncho] = puerta["ANCHO DE PUERTA (m)"].split(" - ").map(parseFloat);
    return anchoNumerico >= minAncho && anchoNumerico <= maxAncho;
  });

  // Si no se encuentra un rango, retornar null
  if (!rangoEncontrado) {
    return null;
  }

  // Retornar el tiempo de apertura basado en la dirección
  if (direccionApertura === "Abre de un lado") {
    return rangoEncontrado["PUERTA ABRE A UN LADO (seg.)"];
  } else if (direccionApertura === "Abre del centro") {
    return rangoEncontrado["PUERTA ABRE DEL CENTRO (seg.)"];
  }

  // Retornar null si no se encuentra una dirección válida
  return null;
};
