import React from 'react';
import SaveButton from './SaveButton';

const Results = ({ resultFields, onCalculate, routeData, setRouteData, allData }) => {

  const handleCalculateClick = () => {
    const lastBuilding = routeData[0] || {};
    const requiredFields = lastBuilding.requiredFields || [];

    // Aseguramos que los campos requeridos se busquen tanto en el nivel superior como en TipoDeEdificio
    const missingFields = requiredFields.filter((field) => {
      const fieldValue = lastBuilding[field] || lastBuilding.TipoDeEdificio?.[field];
      return !fieldValue || fieldValue.trim() === ''; // Verificamos que no esté vacío o no definido
    });

    // Validaciones adicionales para campos específicos
    const hospital = routeData[0].TipoDeEdificio.Nombre.includes("Hospital")
    const capacidad = parseInt(lastBuilding.Pasajeros);
    const detencionPuertas = lastBuilding["Detencion Puertas"];
    const vendor = lastBuilding.cliente;
    const clientPhone = lastBuilding.clientPhone;

    // Verificar que los campos importantes tengan valores aceptables
    const additionalMissingFields = [];
    // Obtener el rango mínimo y máximo de pasajeros permitido según si es un hospital o no
    let minPasajeros = 0;
    let maxPasajeros = 0;
    if (hospital) {
      const dataAscensor = allData.configuraciones_de_ascensor?.[0]?.data || [];
      minPasajeros = Math.min(...dataAscensor.map(info => info.Pasajeros));
      maxPasajeros = Math.max(...dataAscensor.map(info => info.Pasajeros));
    } else {
      const dataPuertas = allData.puertas_info?.[0]?.data || [];
      minPasajeros = Math.min(...dataPuertas.map(info => info.Pasajeros));
      maxPasajeros = Math.max(...dataPuertas.map(info => info.Pasajeros));
    }

    // Validar que la capacidad esté dentro del rango mínimo y máximo permitido
    if (!capacidad || capacidad < minPasajeros || capacidad > maxPasajeros) {
      additionalMissingFields.push(`Pasajeros (debe ser un entero positivo entre ${minPasajeros} y ${maxPasajeros})`);
    }

    if (!detencionPuertas || (detencionPuertas !== 'Abre de un lado' && detencionPuertas !== 'Abre del centro')) {
      additionalMissingFields.push('Detención Puertas (debe seleccionar una opción válida)');
    }
    if (!vendor || vendor.trim() === '') {
      additionalMissingFields.push('Nombre del Cliente (debe estar completo)');
    }
    if (!clientPhone || clientPhone.trim() === '') {
      additionalMissingFields.push('Número de Teléfono (debe estar completo)');
    }

    const allMissingFields = [...missingFields, ...additionalMissingFields];

    if (allMissingFields.length > 0) {
      alert(`Faltan los siguientes campos o tienen valores no válidos: ${allMissingFields.join(', ')}`);
    } else {
      onCalculate();
      saveCalculatedResults();
    }
  };

  const saveCalculatedResults = () => {
    const hospital = routeData[0].TipoDeEdificio.Nombre.includes("Hospital")
    const lastBuilding = routeData[0] || {};
    const fieldValues = ['PISOS', 'AREAS', 'OFICINAS', 'DEPARTAMENTOS', 'HABITACIONES', 'CAMAS', 'AUTOMOVILES'].reduce((acc, field) => {
      acc[field] = parseFloat(lastBuilding[field] || lastBuilding.TipoDeEdificio?.[field]) || 1;
      return acc;
    }, {});

    const capacidad = parseInt(lastBuilding.Pasajeros) || 0;
    let puertasInfoData
    if(hospital){
      puertasInfoData = allData.configuraciones_de_ascensor?.[0]?.data || [];
    }else{
      puertasInfoData = allData.puertas_info?.[0]?.data || [];
    }
    const ancho = puertasInfoData.find((info) => info.Pasajeros === capacidad)?.Ancho || 0.8;
    const detencionPuertasTexto = routeData[0]["Detencion Puertas"] || "N/A";
    const demoraRecomendable = parseFloat(lastBuilding.TipoDeEdificio?.['Demora recomendable']) || 1;
    const personaValue = parseFloat(lastBuilding.TipoDeEdificio?.['Persona']) || 1;
    const totalPoblacion = Object.values(fieldValues).reduce((product, value) => product * value, 1) * personaValue;
    const poblacionServida = Math.ceil(totalPoblacion * (demoraRecomendable / 100));
    const pisosServicios = parseInt(routeData[0].PISOS) - 1 || 0;

    let detencionesParciales = 0

    if((pisosServicios - 2)>22){
      detencionesParciales = allData.configuraciones_de_pisos[0].data[22][capacidad] || 0;
    }else{
      detencionesParciales = allData.configuraciones_de_pisos[0].data[pisosServicios - 2][capacidad] || 0;
    }

    const saltoPromedio = (pisosServicios * 4) / detencionesParciales || 0;
    let velocidadDesarrollada = 0;

    if (allData.valores_de_salto && Array.isArray(allData.valores_de_salto[0]?.data)) {
      const saltoDataList = allData.valores_de_salto[0].data;
      const saltoDataInferior = saltoDataList.filter(item => parseFloat(item['VALORES DE SALTO (m)']) <= saltoPromedio);
      const closestInferior = saltoDataInferior.length > 0 ? saltoDataInferior[saltoDataInferior.length - 1] : null;
      velocidadDesarrollada = closestInferior ? closestInferior['VELOCIDAD DESARROLLADA (m/s)'] : saltoDataList[0]['VELOCIDAD DESARROLLADA (m/s)'];
    }

    let tiempoSumados = 0;
    if (allData.velocidades_tiempos && Array.isArray(allData.velocidades_tiempos[0]?.data)) {
      const tiempoDataList = allData.velocidades_tiempos[0].data;
      // Filtrar todos los elementos que son menores o iguales a 'velocidadDesarrollada'
      const tiempoDataInferior = tiempoDataList.filter(item => parseFloat(item['VELOCIDADES (m/s)']) <= velocidadDesarrollada);
    
      // Seleccionar el valor más cercano al inmediato inferior
      const closestInferior = tiempoDataInferior.length > 0 ? tiempoDataInferior[tiempoDataInferior.length - 1] : null;
    
      tiempoSumados = closestInferior ? closestInferior['TIEMPOS SUMADOS DE ACELERACIÓN Y DESACELERACIÓN (m/s)'] : tiempoDataList[0]['TIEMPOS SUMADOS DE ACELERACIÓN Y DESACELERACIÓN (m/s)'];
    }
    

    const tiempo1 = (pisosServicios * 4) / velocidadDesarrollada || 0;
    let tiempoAberturaPuerta = null;

    if (allData.puertas_datos && Array.isArray(allData.puertas_datos[0]?.data)) {
      const puertasDatos = allData.puertas_datos[0].data;
      for (const puerta of puertasDatos) {
        const [minAncho, maxAncho] = puerta['ANCHO DE PUERTA (m)'].split(' - ').map(Number);
        if (ancho >= minAncho && ancho <= maxAncho) {
          tiempoAberturaPuerta = detencionPuertasTexto === 'Abre de un lado'
            ? puerta['PUERTA ABRE A UN LADO (seg.)']
            : puerta['PUERTA ABRE DEL CENTRO (seg.)'];
          break;
        }
      }
    }

    const detencionPuerta = detencionesParciales * tiempoAberturaPuerta;
    const tiempoAceleracion = detencionesParciales * tiempoSumados || 0;
    let tiempototal = 0;

    if (allData.puertas_tiempo_total && Array.isArray(allData.puertas_tiempo_total[0]?.data)) {
      const puertasDatosTotal = allData.puertas_tiempo_total[0].data;
      for (const puerta of puertasDatosTotal) {
        const [minAncho, maxAncho] = puerta['ANCHO DE PUERTA (m)'].split(' - ').map(Number);
        if (ancho >= minAncho && (maxAncho === undefined || ancho <= maxAncho)) {
          tiempototal = puerta['TIEMPO TOTAL (seg.)'] || 0;
          break;
        }
      }
    }

    const tiempoEntradaSalidaPasajeros = capacidad * tiempototal;
    const tiempoRecuperacion = detencionesParciales * 0.2;
    const tiempoTotal = tiempo1 + tiempoAceleracion + detencionPuerta + tiempoEntradaSalidaPasajeros + tiempoRecuperacion || 0;
    const ajustesFinales = (5 * 60 * capacidad) / tiempoTotal;
    let numeroCabinasNecesarias = Math.ceil(poblacionServida / ajustesFinales);
    let intervaloEspera = tiempoTotal / numeroCabinasNecesarias;

    // Obtener el rango de intervalo de espera desde los datos de TipoDeEdificio
    const intervaloEsperaMin = routeData[0].TipoDeEdificio["intervalo de espera seg."][0];
    const intervaloEsperaMax = routeData[0].TipoDeEdificio["intervalo de espera seg."][1];

    // Ajustar el número de cabinas necesarias si el intervalo de espera no está dentro del rango permitido
    while (intervaloEspera < intervaloEsperaMin && numeroCabinasNecesarias > 1) {
      numeroCabinasNecesarias -= 1;
      intervaloEspera = tiempoTotal / numeroCabinasNecesarias;
    }

    while (intervaloEspera > intervaloEsperaMax) {
      numeroCabinasNecesarias += 1;
      intervaloEspera = tiempoTotal / numeroCabinasNecesarias;
    }


    const calculations = {
      Ancho:ancho,
      'Total Poblacion': totalPoblacion,
      'Poblacion servida': poblacionServida,
      'Pisos servicios': pisosServicios,
      'Detenciones parciales': detencionesParciales,
      'Salto promedio': saltoPromedio,
      'Velocidad desarrollada': velocidadDesarrollada,
      tiempoSumados: tiempoSumados,
      'Tiempo 1': tiempo1,
      'Tiempo de aceleración': tiempoAceleracion,
      detencionPuerta: detencionPuerta,
      'Tiempo de abertura de puerta': tiempoAberturaPuerta,
      'Tiempo total de abertura de puerta': tiempototal,
      'Tiempo de entrada y salida de pasajeros': tiempoEntradaSalidaPasajeros,
      'Tiempo de recuperación': tiempoRecuperacion,
      'Tiempo total': tiempoTotal,
      'Ajustes finales': ajustesFinales,
      'Número de cabinas necesarias': numeroCabinasNecesarias,
      'Intervalo de espera': intervaloEspera,
      'Pasajeros': capacidad,
    };

    setRouteData((prev) => {
      const updatedData = [...prev];
      updatedData[0].result = [calculations]; // Reemplazar el resultado existente
      return updatedData;
    });
    console.log(routeData);
  };

  const formatValue = (value) => {
    return value !== undefined && value !== null ? value.toFixed(2) : 'No disponible';
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 mb-4"
        onClick={handleCalculateClick}
      >
        Cálcular
      </button>
      <h2 className="text-xl font-bold mb-4">Resultados</h2>

      {routeData[0]?.result && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mt-4">Pasajeros:</h3>
          <p className="text-red-700 text-2xl font-bold">
            {routeData[0].result[0]['Pasajeros'] || 'No disponible'}
          </p>
          <h3 className="text-lg font-semibold mt-4">Poblacion servida:</h3>
          <p className="text-red-700 text-2xl font-bold">
            {routeData[0].result[0]['Poblacion servida'] || 'No disponible'}
          </p>
          <h3 className="text-lg font-semibold">Velocidad desarrollada:</h3>
          <p className="text-blue-700 text-2xl font-bold">
            {formatValue(routeData[0].result[0]['Velocidad desarrollada'])}
          </p>
          <h3 className="text-lg font-semibold mt-4">Número de cabinas necesarias:</h3>
          <p className="text-green-700 text-2xl font-bold">
            {formatValue(routeData[0].result[0]['Número de cabinas necesarias'])}
          </p>
          <h3 className="text-lg font-semibold mt-4">Intervalo de espera:</h3>
          <p className="text-green-700 text-2xl font-bold">
            {formatValue(routeData[0].result[0]['Intervalo de espera'])}
          </p>
          <h3 className="text-lg font-semibold">Cantidad de Personas Transportadas cada 5 min:</h3>
          <p className="text-blue-700 text-2xl font-bold">
            {routeData[0].result[0]['Ajustes finales'] || 'No disponible'}
          </p>
        </div>
      )}

      <SaveButton routeData={routeData} />
    </div>
  );
};

export default Results;
