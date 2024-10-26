export const calculateResults = (routeData, allData) => {
    const lastBuilding = routeData[0] || {};
    const hospital = lastBuilding.TipoDeEdificio.Nombre.includes("Hospital");

    // Identificar el campo dinámico adecuado como segundo field
    const secondField = lastBuilding.requiredFields[1]

    if (!secondField) {
        console.error("No se encontró un segundo field válido.");
        return;
    }

    // Calcular el total de garajes con el campo dinámico segundo field
    const totalGarajes = Math.ceil(
        lastBuilding[secondField].reduce((sum, num) => sum + parseInt(num, 10), 0) * 2 * 0.12
    );

    // Obtener multiplicadores de `Persona` y `Demora recomendable`
    const personaMultiplier = parseFloat(lastBuilding.TipoDeEdificio?.Persona) || 1;
    const demoraMultiplier = parseFloat(lastBuilding.TipoDeEdificio?.['Demora recomendable']) / 100 || 1;

    // Calcular total de personas por piso aplicando multiplicadores
    const secondFieldPersonas = lastBuilding[`${secondField}_personas`] || {};
    const totalPersonasPorPiso = lastBuilding[secondField].map((_, pisoIndex) => {
        const piso = pisoIndex + 1;
        const personasEnPiso = Object.keys(secondFieldPersonas)
            .filter(key => key.startsWith(`${piso}_`))
            .reduce((sum, key) => sum + parseInt(secondFieldPersonas[key] || 0, 10), 0);
        
        // Calcular el resultado y redondear
        return Math.ceil(personasEnPiso * personaMultiplier * demoraMultiplier);
    });

    // Imprimir los datos en consola como en el ejemplo mostrado
    console.log(`Cantidad de elementos en el segundo field (${secondField}):`, lastBuilding[secondField].length);
    console.log("Total de personas por piso (multiplicado y redondeado):", totalPersonasPorPiso);
    console.log("Total de garajes (multiplicado por 12 y redondeado):", totalGarajes);

    // Calcular la Población Servida sumando los valores redondeados de personas por piso y total de garajes
    const poblacionServidaCalculada = totalPersonasPorPiso.reduce((a, b) => a + b, 0) + totalGarajes;
    console.log("Población servida total:", poblacionServidaCalculada);

    // Continuar con el cálculo restante sin modificar ni almacenar

    const totalPersonasSum = totalPersonasPorPiso.reduce((a, b) => a + b, 0);
    const ancho = hospital 
      ? allData.configuraciones_de_ascensor?.[0]?.data.find(info => info.Pasajeros === totalPersonasSum)?.Ancho || 0.8
      : allData.puertas_info?.[0]?.data.find(info => info.Pasajeros === totalPersonasSum)?.Ancho || 0.8;

    const totalPoblacion = (parseFloat(lastBuilding.Pasajeros));

    const poblacionServida = poblacionServidaCalculada;
    const pisosServicios = parseInt(lastBuilding.PISOS) || 0;

    let detencionesParciales = 0;

    // Para pisos mayores de 22
    if ((pisosServicios - 2) > 22) {
      let currentCapacidad = totalPoblacion;
      detencionesParciales = allData.configuraciones_de_pisos[0].data[22][currentCapacidad] || 0;

      // Si no hay valor válido, busca el inmediato inferior
      while ((!detencionesParciales || detencionesParciales === 0) && currentCapacidad > 0) {
        currentCapacidad -= 1;
        detencionesParciales = allData.configuraciones_de_pisos[0].data[22][currentCapacidad] || 0;
      }

    // Para pisos menores de 2
    } else if ((pisosServicios - 2) < 2) {
      let currentCapacidad = totalPoblacion;
      detencionesParciales = allData.configuraciones_de_pisos[0].data[0][currentCapacidad] || 0;

      // Si no hay valor válido, busca el inmediato inferior
      while ((!detencionesParciales || detencionesParciales === 0) && currentCapacidad > 0) {
        currentCapacidad -= 1;
        detencionesParciales = allData.configuraciones_de_pisos[0].data[0][currentCapacidad] || 0;
      }

    // Para los demás casos
    } else {
      let currentCapacidad = totalPoblacion;
      detencionesParciales = allData.configuraciones_de_pisos[0].data[pisosServicios - 2][currentCapacidad] || 0;

      // Si no hay valor válido, busca el inmediato inferior
      while ((!detencionesParciales || detencionesParciales === 0) && currentCapacidad > 0) {
        currentCapacidad -= 1;
        detencionesParciales = allData.configuraciones_de_pisos[0].data[pisosServicios - 2][currentCapacidad] || 0;
      }
    }


    let tiempototal = 0;

    if (allData.puertas_tiempo_total && Array.isArray(allData.puertas_tiempo_total[0]?.data)) {
      const puertasDatosTotal = allData.puertas_tiempo_total[0].data;

      // Convertimos los rangos de ancho de puerta a números
      const parsedPuertasDatosTotal = puertasDatosTotal.map((puerta) => {
        const [minAncho, maxAncho] = puerta['ANCHO DE PUERTA (m)'].split(' - ').map(Number);
        return { minAncho, maxAncho, ...puerta };
      });

      // Buscar el rango exacto o, si no existe, el inmediato inferior
      let puertaSeleccionada = parsedPuertasDatosTotal.find((puerta) => ancho >= puerta.minAncho && ancho <= puerta.maxAncho);
      
      // Si no se encuentra, buscamos el inmediato inferior
      if (!puertaSeleccionada) {
        puertaSeleccionada = parsedPuertasDatosTotal.slice().reverse().find((puerta) => puerta.minAncho <= ancho);
        
        // Si no existe uno inferior, tomamos el más pequeño disponible
        if (!puertaSeleccionada) {
          puertaSeleccionada = parsedPuertasDatosTotal[0];
        }
      }

      // Asignamos el tiempo total basado en el valor seleccionado
      if (puertaSeleccionada) {
        tiempototal = puertaSeleccionada['TIEMPO TOTAL (seg.)'] || 0;
      }
    }
    const detencionPuertasTexto = routeData[0]["Detencion Puertas"] || "N/A";
    let tiempoAberturaPuerta = 0;

    if (allData.puertas_datos && Array.isArray(allData.puertas_datos[0]?.data)) {
      const puertasDatos = allData.puertas_datos[0].data;

      // Convertimos los rangos de ancho de puerta a números
      const parsedPuertasDatos = puertasDatos.map((puerta) => {
        const [minAncho, maxAncho] = puerta['ANCHO DE PUERTA (m)'].split(' - ').map(Number);
        return { minAncho, maxAncho, ...puerta };
      });

      // Buscar el rango exacto o, si no existe, el inmediato inferior
      let puertaSeleccionada = parsedPuertasDatos.find((puerta) => ancho >= puerta.minAncho && ancho <= puerta.maxAncho);
      
      // Si no se encuentra, buscamos el inmediato inferior
      if (!puertaSeleccionada) {
        puertaSeleccionada = parsedPuertasDatos.slice().reverse().find((puerta) => puerta.minAncho <= ancho);
        
        // Si no existe uno inferior, tomamos el más pequeño disponible
        if (!puertaSeleccionada) {
          puertaSeleccionada = parsedPuertasDatos[0];
        }
      }

      // Determinamos el tiempo de apertura basado en el valor seleccionado
      if (puertaSeleccionada) {
        tiempoAberturaPuerta = detencionPuertasTexto === 'Abre de un lado'
          ? puertaSeleccionada['PUERTA ABRE A UN LADO (seg.)']
          : puertaSeleccionada['PUERTA ABRE DEL CENTRO (seg.)'];
      }
    }



   const saltoPromedio = (pisosServicios * 4) / detencionesParciales || 0;
   const tiempodesalida = totalPoblacion * tiempototal
    const tiempo_recorrido = (pisosServicios * 4) / detencionesParciales || 0;
    const velocidadDesarrollada = findClosestValue(saltoPromedio, allData.valores_de_salto, 'VALORES DE SALTO (m)', 'VELOCIDAD DESARROLLADA (m/s)');
    const tiempoSumados = findClosestValue(velocidadDesarrollada, allData.velocidades_tiempos, 'VELOCIDADES (m/s)', 'TIEMPOS SUMADOS DE ACELERACIÓN Y DESACELERACIÓN (m/s)');
    const tiempodeaceleracion = detencionesParciales * tiempoSumados
   const tiempoApertura = detencionesParciales * tiempoAberturaPuerta
   const tiempoRecuperacion = detencionesParciales * 0.2;
    const tiempoTotal = tiempo_recorrido + tiempodeaceleracion + tiempoApertura + tiempodesalida + tiempoRecuperacion
    const ajustesFinales = (5 * 60 * totalPersonasSum) / tiempoTotal;
    let numeroCabinasNecesarias = Math.ceil(poblacionServida / ajustesFinales);
    let intervaloEspera = Math.ceil(tiempoTotal / numeroCabinasNecesarias);

    const intervaloEsperaMin = routeData[0].TipoDeEdificio["intervalo de espera seg."][0];
    const intervaloEsperaMax = routeData[0].TipoDeEdificio["intervalo de espera seg."][1];

    while (intervaloEspera < intervaloEsperaMin && numeroCabinasNecesarias > 1) {
      numeroCabinasNecesarias -= 1;
      intervaloEspera = Math.ceil(tiempoTotal / numeroCabinasNecesarias);
    }

    while (intervaloEspera > intervaloEsperaMax) {
      numeroCabinasNecesarias += 1;
      intervaloEspera = Math.ceil(tiempoTotal / numeroCabinasNecesarias);
    }


    return {
      totalPoblacion,
      poblacionServida,
      tiempoTotal,
      ajustesFinales,
      numeroCabinasNecesarias,
      intervaloEspera,
      velocidadDesarrollada,
    };
};


// Encuentra el valor más cercano basado en el campo objetivo y el campo de resultados
const findClosestValue = (target, data, dataField, resultField) => {
    const dataList = data[0]?.data || [];
    const filteredData = dataList.filter(item => parseFloat(item[dataField]) <= target);
    const closestInferior = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;
    return closestInferior ? closestInferior[resultField] : dataList[0][resultField];
};

// Calcular el tiempo total
// Calcula el tiempo de apertura de puerta
