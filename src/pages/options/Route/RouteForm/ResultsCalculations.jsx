export const calculateResults = (routeData, allData) => {
  const lastBuilding = routeData[0] || {};
  const hospital = lastBuilding.TipoDeEdificio.Nombre.includes("Hospital");

  let poblacionServida = parseInt(lastBuilding["Población Servida"], 10);
  let totalPersonasSum = 0;
  let totalGarajes = 0;
  let totalPersonasPorPiso = [];
  let pisosServicios = parseInt(lastBuilding.PISOS) || 0;

  if (!poblacionServida || poblacionServida === 0) {
    // Identificar el campo dinámico adecuado como segundo field
    const secondField = lastBuilding.requiredFields[1];

    if (!secondField) {
      console.error("No se encontró un segundo field válido.");
      return;
    }

    // Calcular el total de garajes con el campo dinámico segundo field
    totalGarajes = Math.ceil(
      lastBuilding[secondField].reduce((sum, num) => sum + parseInt(num, 10), 0) * 2 * 0.12
    );

    // Obtener multiplicadores de `Persona` y `Demora recomendable`
    const personaMultiplier = parseFloat(lastBuilding.TipoDeEdificio?.Persona) || 1;
    const demoraMultiplier = parseFloat(lastBuilding.TipoDeEdificio?.['Demora recomendable']) / 100 || 1;

    // Calcular total de personas por piso aplicando multiplicadores
    const secondFieldPersonas = lastBuilding[`${secondField}_personas`] || {};
    totalPersonasPorPiso = lastBuilding[secondField].map((_, pisoIndex) => {
      const piso = pisoIndex + 1;
      const personasEnPiso = Object.keys(secondFieldPersonas)
        .filter((key) => key.startsWith(`${piso}_`))
        .reduce((sum, key) => sum + parseInt(secondFieldPersonas[key] || 0, 10), 0);

      // Calcular el resultado y redondear
      return Math.ceil(personasEnPiso * personaMultiplier * demoraMultiplier);
    });

    // Calcular la Población Servida sumando los valores redondeados de personas por piso y total de garajes
    poblacionServida = totalPersonasPorPiso.reduce((a, b) => a + b, 0) + totalGarajes;

    // Sumar total de personas
    totalPersonasSum = totalPersonasPorPiso.reduce((a, b) => a + b, 0);
  } else {
    // Cuando "Población Servida" está definida y es válida
    totalPersonasSum = poblacionServida;

    // Si "PISOS" no está definido, asignar un valor por defecto
    if (!pisosServicios || pisosServicios === 0) {
      pisosServicios = 1; // Puedes ajustar este valor según tus necesidades
    }
  }

  const totalPoblacion = parseFloat(lastBuilding.Pasajeros);

  // Obtener el ancho basado en totalPersonasSum
  const ancho = hospital
    ? allData.configuraciones_de_ascensor?.[0]?.data.find((info) => info.Pasajeros === totalPersonasSum)?.Ancho || 0.8
    : allData.puertas_info?.[0]?.data.find((info) => info.Pasajeros === totalPersonasSum)?.Ancho || 0.8;

  let detencionesParciales = 0;

  // Cálculo de detenciones parciales basado en pisosServicios
  if (pisosServicios - 2 > 22) {
    let currentCapacidad = totalPoblacion;
    detencionesParciales = allData.configuraciones_de_pisos[0].data[22][currentCapacidad] || 0;

    while ((!detencionesParciales || detencionesParciales === 0) && currentCapacidad > 0) {
      currentCapacidad -= 1;
      detencionesParciales = allData.configuraciones_de_pisos[0].data[22][currentCapacidad] || 0;
    }
  } else if (pisosServicios - 2 < 2) {
    let currentCapacidad = totalPoblacion;
    detencionesParciales = allData.configuraciones_de_pisos[0].data[0][currentCapacidad] || 0;

    while ((!detencionesParciales || detencionesParciales === 0) && currentCapacidad > 0) {
      currentCapacidad -= 1;
      detencionesParciales = allData.configuraciones_de_pisos[0].data[0][currentCapacidad] || 0;
    }
  } else {
    let currentCapacidad = totalPoblacion;
    detencionesParciales =
      allData.configuraciones_de_pisos[0].data[pisosServicios - 2][currentCapacidad] || 0;

    while ((!detencionesParciales || detencionesParciales === 0) && currentCapacidad > 0) {
      currentCapacidad -= 1;
      detencionesParciales =
        allData.configuraciones_de_pisos[0].data[pisosServicios - 2][currentCapacidad] || 0;
    }
  }

  let tiempototal = 0;

  if (allData.puertas_tiempo_total && Array.isArray(allData.puertas_tiempo_total[0]?.data)) {
    const puertasDatosTotal = allData.puertas_tiempo_total[0].data;

    const parsedPuertasDatosTotal = puertasDatosTotal.map((puerta) => {
      const [minAncho, maxAncho] = puerta['ANCHO DE PUERTA (m)'].split(' - ').map(Number);
      return { minAncho, maxAncho, ...puerta };
    });

    let puertaSeleccionada = parsedPuertasDatosTotal.find(
      (puerta) => ancho >= puerta.minAncho && ancho <= puerta.maxAncho
    );

    if (!puertaSeleccionada) {
      puertaSeleccionada = parsedPuertasDatosTotal
        .slice()
        .reverse()
        .find((puerta) => puerta.minAncho <= ancho);

      if (!puertaSeleccionada) {
        puertaSeleccionada = parsedPuertasDatosTotal[0];
      }
    }

    if (puertaSeleccionada) {
      tiempototal = puertaSeleccionada['TIEMPO TOTAL (seg.)'] || 0;
    }
  }

  const detencionPuertasTexto = lastBuilding["Detencion Puertas"] || "N/A";
  let tiempoAberturaPuerta = 0;

  if (allData.puertas_datos && Array.isArray(allData.puertas_datos[0]?.data)) {
    const puertasDatos = allData.puertas_datos[0].data;

    const parsedPuertasDatos = puertasDatos.map((puerta) => {
      const [minAncho, maxAncho] = puerta['ANCHO DE PUERTA (m)'].split(' - ').map(Number);
      return { minAncho, maxAncho, ...puerta };
    });

    let puertaSeleccionada = parsedPuertasDatos.find(
      (puerta) => ancho >= puerta.minAncho && ancho <= puerta.maxAncho
    );

    if (!puertaSeleccionada) {
      puertaSeleccionada = parsedPuertasDatos
        .slice()
        .reverse()
        .find((puerta) => puerta.minAncho <= ancho);

      if (!puertaSeleccionada) {
        puertaSeleccionada = parsedPuertasDatos[0];
      }
    }

    if (puertaSeleccionada) {
      tiempoAberturaPuerta =
        detencionPuertasTexto === 'Abre de un lado'
          ? puertaSeleccionada['PUERTA ABRE A UN LADO (seg.)']
          : puertaSeleccionada['PUERTA ABRE DEL CENTRO (seg.)'];
    }
  }

  const saltoPromedio = (pisosServicios * 4) / detencionesParciales || 0;
  const tiempodesalida = totalPoblacion * tiempototal;
  const tiempo_recorrido = (pisosServicios * 4) / detencionesParciales || 0;
  let velocidadDesarrollada = findClosestValue(
    saltoPromedio,
    allData.valores_de_salto,
    'VALORES DE SALTO (m)',
    'VELOCIDAD DESARROLLADA (m/s)'
);

// Ajustar la velocidadDesarrollada a las opciones específicas
if (velocidadDesarrollada <= 1) {
    velocidadDesarrollada = 1;
} else if (velocidadDesarrollada <= 1.5) {
    velocidadDesarrollada = 1.5;
} else if (velocidadDesarrollada <= 1.75) {
    velocidadDesarrollada = 1.75;
} else {
    velocidadDesarrollada = 2;
}

  const tiempoSumados = findClosestValue(
    velocidadDesarrollada,
    allData.velocidades_tiempos,
    'VELOCIDADES (m/s)',
    'TIEMPOS SUMADOS DE ACELERACIÓN Y DESACELERACIÓN (m/s)'
  );
  const tiempodeaceleracion = detencionesParciales * tiempoSumados;
  const tiempoApertura = detencionesParciales * tiempoAberturaPuerta;
  const tiempoRecuperacion = detencionesParciales * 0.2;
  const tiempoTotal =
    tiempo_recorrido + tiempodeaceleracion + tiempoApertura + tiempodesalida + tiempoRecuperacion;
  const ajustesFinales = (5 * 60 * totalPersonasSum) / tiempoTotal;
  let numeroCabinasNecesarias = Math.ceil(poblacionServida / ajustesFinales);
  let intervaloEspera = Math.ceil(tiempoTotal / numeroCabinasNecesarias);

  const intervaloEsperaMin = lastBuilding.TipoDeEdificio["intervalo de espera seg."][0];
  const intervaloEsperaMax = lastBuilding.TipoDeEdificio["intervalo de espera seg."][1];

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

// Función auxiliar para encontrar el valor más cercano
const findClosestValue = (target, data, dataField, resultField) => {
  const dataList = data[0]?.data || [];
  const filteredData = dataList.filter((item) => parseFloat(item[dataField]) <= target);
  const closestInferior = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;
  return closestInferior ? closestInferior[resultField] : dataList[0][resultField];
};
