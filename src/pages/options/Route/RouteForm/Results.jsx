import React from 'react';
import SaveButton from './SaveButton';

const Results = ({ resultFields, onCalculate, routeData, setRouteData, allData }) => {
  const handleCalculateClick = () => {
    const lastBuilding = routeData[routeData.length - 1] || {};
    const requiredFields = lastBuilding.requiredFields || [];
    const missingFields = requiredFields.filter(field => !lastBuilding.TipoDeEdificio?.[field]);

    // Validaciones adicionales para campos específicos
    const capacidad = parseInt(routeData[0]?.Pasajeros);
    const ancho = parseFloat(routeData[0]?.["Ancho de puertas"]);
    const detencionPuertas = routeData[0]?.["Detencion Puertas"];

    // Verificar que los campos importantes tengan valores aceptables
    const additionalMissingFields = [];
    if (!capacidad || capacidad <= 0) {
      additionalMissingFields.push('Pasajeros (debe ser un entero positivo)');
    }
    if (!ancho || ancho < 0.8 || ancho > 1.5) {
      additionalMissingFields.push('Ancho de puertas (debe estar entre 0.8 y 1.5)');
    }
    if (!detencionPuertas || (detencionPuertas !== 'Abre de un lado' && detencionPuertas !== 'Abre del centro')) {
      additionalMissingFields.push('Detención Puertas (debe seleccionar una opción válida)');
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
    const lastBuilding = routeData[routeData.length - 1] || {};
    const fieldValues = ['PISOS', 'AREAS', 'OFICINAS', 'DEPARTAMENTOS', 'HABITACIONES', 'CAMAS', 'AUTOMOVILES'].reduce((acc, field) => {
      acc[field] = parseFloat(lastBuilding.TipoDeEdificio?.[field]) || 1;
      return acc;
    }, {});

    const capacidad = parseInt(routeData[0].Pasajeros) || 0;
    const ancho = parseFloat(routeData[0]["Ancho de puertas"]) || 0.8;
    const detencionPuertasTexto = routeData[0]["Detencion Puertas"] || "N/A";
    const demoraRecomendable = parseFloat(lastBuilding.TipoDeEdificio?.['Demora recomendable']) || 1;
    const personaValue = parseFloat(lastBuilding.TipoDeEdificio?.['Persona']) || 1;
    const totalPoblacion = Object.values(fieldValues).reduce((product, value) => product * value, 1) * personaValue;
    const poblacionServida = Math.ceil(totalPoblacion * (demoraRecomendable / 100));
    const pisosServicios = parseInt(routeData[0].TipoDeEdificio.PISOS) - 1 || 0;
    const detencionesParciales = allData.configuraciones_de_pisos[0].data[pisosServicios - 2][capacidad] || 0;
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
      const tiempoData = tiempoDataList.find(item => parseFloat(item['VELOCIDADES (m/s)']) >= velocidadDesarrollada);
      tiempoSumados = tiempoData ? tiempoData['TIEMPOS SUMADOS DE ACELERACIÓN Y DESACELERACIÓN (m/s)'] : tiempoDataList[tiempoDataList.length - 1]['TIEMPOS SUMADOS DE ACELERACIÓN Y DESACELERACIÓN (m/s)'];
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
    const ajustesFinales = Math.ceil((5 * 60 * capacidad) / tiempoTotal);
    const numeroCabinasNecesarias = Math.ceil(poblacionServida / ajustesFinales);
    const intervaloEspera = tiempoTotal / numeroCabinasNecesarias;

    const calculations = {
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
      const lastIndex = updatedData.length - 1;
      if (updatedData[lastIndex]?.result) {
        updatedData[lastIndex].result = [calculations]; // Reemplazar el resultado existente
      } else {
        updatedData[lastIndex] = {
          ...updatedData[lastIndex],
          result: [calculations], // Guardar un nuevo resultado si no existe
        };
      }
      return updatedData;
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 mb-4"
        onClick={handleCalculateClick}
      >
        Hacer Cálculo
      </button>
      <h2 className="text-xl font-bold mb-4">Resultados</h2>
  
      {routeData[routeData.length - 1]?.result && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Velocidad desarrollada:</h3>
          <p className="text-blue-700 text-2xl font-bold">
            {routeData[routeData.length - 1].result[0]['Velocidad desarrollada'].toFixed(2)}
          </p>
          <h3 className="text-lg font-semibold mt-4">Intervalo de espera:</h3>
          <p className="text-green-700 text-2xl font-bold">
            {routeData[routeData.length - 1].result[0]['Intervalo de espera'].toFixed(2)}
          </p>
          <h3 className="text-lg font-semibold mt-4">Pasajeros:</h3>
          <p className="text-red-700 text-2xl font-bold">
            {routeData[routeData.length - 1].result[0]['Pasajeros']}
          </p>
        </div>
      )}
  
      <SaveButton routeData={routeData} />
    </div>
  );
};

export default Results;
