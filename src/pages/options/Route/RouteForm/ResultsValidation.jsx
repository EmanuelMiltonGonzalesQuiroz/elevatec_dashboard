export const validateFields = (routeData, allData) => {
  console.log(routeData);
  const lastBuilding = routeData[0] || {};
  const requiredFields = lastBuilding.requiredFields || [];

  const poblacionServida = lastBuilding['Población Servida'];
  const isPoblacionServidaValid = poblacionServida && String(poblacionServida).trim() !== '';

  let missingFields = [];
  if (!isPoblacionServidaValid) {
    missingFields = requiredFields.filter((field) => {
      const fieldValue = lastBuilding[field] || lastBuilding.TipoDeEdificio?.[field];
      return !fieldValue || String(fieldValue).trim() === '';
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

  // Verificación de 'Nombre' solo si 'TipoDeEdificio' está definido
  if (lastBuilding.TipoDeEdificio?.Nombre?.includes('Hospital')) {
    minPasajeros = Math.min(...dataAscensor.map((info) => info.Pasajeros));
    maxPasajeros = Math.max(...dataAscensor.map((info) => info.Pasajeros));
  } else {
    minPasajeros = Math.min(...dataPuertas.map((info) => info.Pasajeros));
    maxPasajeros = Math.max(...dataPuertas.map((info) => info.Pasajeros));
  }

  if (capacidad !== 0 && (capacidad < minPasajeros || capacidad > maxPasajeros)) {
    additionalMissingFields.push(
      `Pasajeros (debe ser un entero positivo entre ${minPasajeros} y ${maxPasajeros})`
    );
  }

  if (!detencionPuertas || (detencionPuertas !== 'Abre de un lado' && detencionPuertas !== 'Abre del centro')) {
    additionalMissingFields.push('Detención Puertas (debe seleccionar una opción válida)');
  }

  if (!vendor || String(vendor).trim() === '') {
    additionalMissingFields.push('Nombre del Cliente (debe estar completo)');
  }
  if (!clientPhone || String(clientPhone).trim() === '') {
    additionalMissingFields.push('Número de Teléfono (debe estar completo)');
  }

  Object.keys(lastBuilding).forEach((key) => {
    if (key.startsWith('piso_')) {
      const floorData = lastBuilding[key];

      requiredFields.forEach((field) => {
        if (!floorData?.[field] || String(floorData[field]).trim() === '') {
          additionalMissingFields.push(`${field} en ${key} (debe estar completo)`);
        }
      });

      Object.keys(floorData || {}).forEach((fieldKey) => {
        if (fieldKey.endsWith('_personas')) {
          const personasValue = floorData[fieldKey];
          if (!personasValue || parseInt(personasValue, 10) <= 0) {
            additionalMissingFields.push(`${fieldKey} en ${key} debe ser un entero positivo`);
          }
        }
      });
    }
  });

  return [...missingFields, ...additionalMissingFields];
};
