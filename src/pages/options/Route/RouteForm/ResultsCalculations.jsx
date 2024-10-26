// ResultsCalculations.js
export const calculateResults = (routeData, allData) => {
    const lastBuilding = routeData[0] || {};
    const hospital = routeData[0].TipoDeEdificio.Nombre.includes("Hospital");
    
    const fieldValues = ['PISOS', 'AREAS', 'OFICINAS', 'DEPARTAMENTOS', 'HABITACIONES', 'CAMAS', 'AUTOMOVILES'].reduce((acc, field) => {
      acc[field] = parseFloat(lastBuilding[field] || lastBuilding.TipoDeEdificio?.[field]) || 1;
      return acc;
    }, {});
  
    const capacidad = parseInt(lastBuilding.Pasajeros) || 0;
    const ancho = hospital 
      ? allData.configuraciones_de_ascensor?.[0]?.data.find(info => info.Pasajeros === capacidad)?.Ancho || 0.8
      : allData.puertas_info?.[0]?.data.find(info => info.Pasajeros === capacidad)?.Ancho || 0.8;
  
    const totalPoblacion = Object.values(fieldValues).reduce((product, value) => product * value, 1) * 
                           (parseFloat(lastBuilding.TipoDeEdificio?.['Persona']) || 1);
  
    let poblacionServida = Math.ceil(totalPoblacion * (parseFloat(lastBuilding.TipoDeEdificio?.['Demora recomendable']) / 100) || 0);
    const pisosServicios = parseInt(routeData[0].PISOS) || 0;
  
    const interval = hospital ? allData.configuraciones_de_pisos[0].data : allData.valores_de_salto[0].data;
    const detencionesParciales = calculatePartialDetentions(pisosServicios, capacidad, interval);
  
    const saltoPromedio = (pisosServicios * 4) / detencionesParciales || 0;
    const velocidadDesarrollada = findClosestValue(saltoPromedio, allData.valores_de_salto, 'VALORES DE SALTO (m)', 'VELOCIDAD DESARROLLADA (m/s)');
    const tiempoSumados = findClosestValue(velocidadDesarrollada, allData.velocidades_tiempos, 'VELOCIDADES (m/s)', 'TIEMPOS SUMADOS DE ACELERACIÓN Y DESACELERACIÓN (m/s)');
    
    const tiempoTotal = calculateTotalTime(pisosServicios, capacidad, ancho, detencionesParciales, tiempoSumados, hospital, allData);
    const ajustesFinales = (5 * 60 * capacidad) / tiempoTotal;
    const numeroCabinasNecesarias = Math.ceil(poblacionServida / ajustesFinales);
    
    return {
      ancho,
      totalPoblacion,
      poblacionServida,
      detencionesParciales,
      saltoPromedio,
      velocidadDesarrollada,
      tiempoTotal,
      ajustesFinales,
      numeroCabinasNecesarias
    };
  };
  
  const calculatePartialDetentions = (pisosServicios, capacidad, intervalData) => {
    let detencionesParciales = 0;
    
    if ((pisosServicios - 2) > 22) {
      detencionesParciales = findClosestFloorValue(intervalData, 22, capacidad);
    } else if ((pisosServicios - 2) < 2) {
      detencionesParciales = findClosestFloorValue(intervalData, 0, capacidad);
    } else {
      detencionesParciales = findClosestFloorValue(intervalData, pisosServicios - 2, capacidad);
    }
    
    return detencionesParciales;
  };
  
  const findClosestFloorValue = (intervalData, floorIndex, capacidad) => {
    let detencionesParciales = intervalData[floorIndex]?.[capacidad] || 0;
    let currentCapacidad = capacidad;
  
    while ((!detencionesParciales || detencionesParciales === 0) && currentCapacidad > 0) {
      currentCapacidad -= 1;
      detencionesParciales = intervalData[floorIndex]?.[currentCapacidad] || 0;
    }
  
    return detencionesParciales;
  };
  
  const findClosestValue = (target, data, dataField, resultField) => {
    const dataList = data[0]?.data || [];
    const filteredData = dataList.filter(item => parseFloat(item[dataField]) <= target);
    const closestInferior = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;
    return closestInferior ? closestInferior[resultField] : dataList[0][resultField];
  };
  
  const calculateTotalTime = (pisosServicios, capacidad, ancho, detencionesParciales, tiempoSumados, hospital, allData) => {
    const tiempo1 = (pisosServicios * 4) / (findClosestValue(pisosServicios * 4, allData.valores_de_salto, 'VALORES DE SALTO (m)', 'VELOCIDAD DESARROLLADA (m/s)') || 0);
    const tiempoAberturaPuerta = calculateDoorOpeningTime(ancho, allData.puertas_datos, hospital, capacidad);
    const detencionPuerta = detencionesParciales * tiempoAberturaPuerta;
    const tiempoAceleracion = detencionesParciales * tiempoSumados || 0;
    const tiempoEntradaSalidaPasajeros = capacidad * tiempoAberturaPuerta;
    const tiempoRecuperacion = detencionesParciales * 0.2;
    
    return tiempo1 + tiempoAceleracion + detencionPuerta + tiempoEntradaSalidaPasajeros + tiempoRecuperacion || 0;
  };
  
  const calculateDoorOpeningTime = (ancho, puertasDatos, hospital, capacidad) => {
    const puertasDataList = puertasDatos[0]?.data || [];
    
    const parsedPuertasDatos = puertasDataList.map((puerta) => {
      const [minAncho, maxAncho] = puerta['ANCHO DE PUERTA (m)'].split(' - ').map(Number);
      return { minAncho, maxAncho, ...puerta };
    });
  
    let puertaSeleccionada = parsedPuertasDatos.find((puerta) => ancho >= puerta.minAncho && ancho <= puerta.maxAncho);
    
    if (!puertaSeleccionada) {
      puertaSeleccionada = parsedPuertasDatos.slice().reverse().find((puerta) => puerta.minAncho <= ancho);
      if (!puertaSeleccionada) {
        puertaSeleccionada = parsedPuertasDatos[0];
      }
    }
  
    return puertaSeleccionada ? (hospital ? puertaSeleccionada['PUERTA ABRE A UN LADO (seg.)'] : puertaSeleccionada['PUERTA ABRE DEL CENTRO (seg.)']) : 0;
  };
  