// ResultsValidation.js
export const validateFields = (routeData, allData) => {
  const lastBuilding = routeData[0] || {};
  const requiredFields = lastBuilding.requiredFields || [];

  // Check if "Población Servida" exists and has a valid value
  const poblacionServida = lastBuilding['Población Servida'];
  const isPoblacionServidaValid = poblacionServida && String(poblacionServida).trim() !== '';

  // Only validate required fields if "Población Servida" is not valid
  let missingFields = [];
  if (!isPoblacionServidaValid) {
    missingFields = requiredFields.filter((field) => {
      const fieldValue = lastBuilding[field] || lastBuilding.TipoDeEdificio?.[field];
      return !fieldValue || String(fieldValue).trim() === ''; // Convert to string to avoid errors with trim
    });
  }

  const detencionPuertas = lastBuilding['Detencion Puertas'];
  const vendor = lastBuilding.cliente;
  const clientPhone = lastBuilding.clientPhone;
  const capacidad = parseInt(lastBuilding.Pasajeros, 10);

  const additionalMissingFields = [];
  let minPasajeros = 0;
  let maxPasajeros = 0;

  const dataAscensor = allData.configuraciones_de_ascensor?.[0]?.data || [];
  const dataPuertas = allData.puertas_info?.[0]?.data || [];

  if (routeData[0].TipoDeEdificio.Nombre.includes('Hospital')) {
    minPasajeros = Math.min(...dataAscensor.map((info) => info.Pasajeros));
    maxPasajeros = Math.max(...dataAscensor.map((info) => info.Pasajeros));
  } else {
    minPasajeros = Math.min(...dataPuertas.map((info) => info.Pasajeros));
    maxPasajeros = Math.max(...dataPuertas.map((info) => info.Pasajeros));
  }

  // Verify capacity only if Pasajeros is not 0
  if (capacidad !== 0 && (capacidad < minPasajeros || capacidad > maxPasajeros)) {
    additionalMissingFields.push(
      `Pasajeros (debe ser un entero positivo entre ${minPasajeros} y ${maxPasajeros})`
    );
  }

  // Verification of door detentions
  if (
    !detencionPuertas ||
    (detencionPuertas !== 'Abre de un lado' && detencionPuertas !== 'Abre del centro')
  ) {
    additionalMissingFields.push('Detención Puertas (debe seleccionar una opción válida)');
  }

  // Verification of client name and phone number
  if (!vendor || String(vendor).trim() === '') {
    additionalMissingFields.push('Nombre del Cliente (debe estar completo)');
  }
  if (!clientPhone || String(clientPhone).trim() === '') {
    additionalMissingFields.push('Número de Teléfono (debe estar completo)');
  }

  return [...missingFields, ...additionalMissingFields];
};
