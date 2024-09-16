const updateGrupo1 = (formData, valor3, allData) => {
  const getValorPesoPersona = (allData) => {
    const items = allData.basic_config["basic config"].items;
    const pesoPersonaItem = items.find(item => item.name === 'Peso persona');
    return pesoPersonaItem ? pesoPersonaItem.valor : undefined;
  };

  const calcularPrecioEstructura = (estructura, personas) => {
    const baseItem = estructura.items[0]; // Primer ítem, valor base
    const porcentajeItem = estructura.items[1]; // Segundo ítem, porcentaje extra

    let precioBase = baseItem.valor; // Valor base de la estructura
    let precioFinal = precioBase;

    if (personas > 6 && porcentajeItem) {
      const porcentaje = parseFloat(porcentajeItem.valor.replace('%', '')) / 100;
      const personasExtras = personas - 6;
      precioFinal += precioBase * porcentaje * personasExtras; // Precio ajustado
    }

    return precioFinal;
  };

  // Función para normalizar las claves (eliminar espacios, guiones bajos y convertir a minúsculas)
  const normalizeKey = (key) => {
    let normalizedKey = key.toLowerCase().replace(/\s|_/g, '');
    if (normalizedKey.includes('motor')) {
      normalizedKey = normalizedKey.replace('de', ''); // Quitar "de" solo en casos relacionados con "motor"
    }
    return normalizedKey;
  };

  // Normalizar los IDs de los documentos y valores dentro de allData.groups
  const normalizedGroups = {};
  Object.keys(allData.groups).forEach(groupKey => {
    normalizedGroups[normalizeKey(groupKey)] = allData.groups[groupKey];
  });

  const descriptions = [
    "Estructura_de_cabina",
    "Estructura_de_contrapeso",
    "Estructura_de_motor",
    "Estructura_de_foso",
    "SubTecho",
    "Cabina",
    "Hormigones",
    "Piso",
    "Transporte_interno",
    "Comision_INTERNA_EMPRESA",
    "Mano_de_obra_produccion",
    "Mano_de_obra_instalaciones",
    "Costo_de_seguridad_agencias_transportes_internos",
    "Comision_del_banco_intermediario"
  ];

  descriptions.forEach((description) => {
    const normalizedDescription = normalizeKey(description);

    const key = Object.keys(formData).find(
      key => normalizeKey(key) === normalizedDescription
    );

    if (key && formData[key]) {
      let unidades = formData[key].UNIDADES || 0;

      // Cálculo especial para las estructuras
      if (["estructuradecabina", "estructuradecontrapeso", "estructuramotor"].includes(normalizedDescription)) {
        const estructuraData = normalizedGroups[normalizedDescription];
        if (estructuraData) {
          formData[key].PRECIO_UNITARIO = calcularPrecioEstructura(estructuraData, formData['03_PERSONAS']);
        } else {
          console.error(`Estructura para ${description} no encontrada en allData.groups`);
        }
      }

      // Cálculo especial para la Cabina (aplicar porcentaje si hay más de 6 personas)
      if (normalizedDescription === "cabina") {
        const personas = formData['03_PERSONAS'];
        const cabinaPorcentajeData = normalizedGroups["cabinaporcentaje"];
        if (cabinaPorcentajeData && personas > 6) {
          const porcentajeItem = cabinaPorcentajeData.items[1];
          if (porcentajeItem) {
            const porcentaje = parseFloat(porcentajeItem.valor.replace('%', '')) / 100;
            const personasExtras = personas - 6;
            formData[key].PRECIO_UNITARIO =formData[key].valor + formData[key].valor * porcentaje * personasExtras;
          }
        }
      }

      if (["manodeobrainstalaciones"].includes(normalizedDescription)) {
        formData[key].PRECIO_UNITARIO = 700 + (70 * formData["01_PARADAS"]);
      }

      // Cálculo especial para 'Hormigones'
      if (normalizedDescription === 'hormigones') {
        const peso_Persona = getValorPesoPersona(allData);
        const potencia = peso_Persona * formData['03_PERSONAS'];
        unidades = Math.ceil((potencia * 1.5) / 30);
      }

      let precioUnitario = formData[key].PRECIO_UNITARIO || formData[key].valor || 0;
      let aduana = 0;
      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;

      if (normalizedDescription === 'piso') {
        precioUnitario = formData['Piso'].valor || 0;
        aduana = ((unidades * precioUnitario) + transporte) * 0.3 * 0.5;
      }

      if (["transporteinterno", "comisioninternaempresa", "manodeobraproduccion", "manodeobrainstalaciones", "costodeseguridadagenciastransportesinternos", "comisiondelbancointermediario"].includes(normalizedDescription)) {
        if (normalizedDescription === 'transporteinterno') {
          precioUnitario = formData['Ciudad'].valor || precioUnitario;
          unidades = 1; // Forzar unidades a 1
        }

        aduana = ((unidades * precioUnitario) + transporte) * 0.3 * 0.5;
      }

      const costoFinal = aduana + transporte + (precioUnitario * unidades);

      formData[key].UNIDADES = unidades;
      formData[key].PRECIO_UNITARIO = precioUnitario;
      formData[key].VOLUMEN_TOTAL_M3 = volumenTotalM3;
      formData[key].TRANSPORTE = transporte;
      formData[key].ADUANA = aduana;
      formData[key].COSTO_FINAL = costoFinal;
    }
  });

  return formData;
};

export default updateGrupo1;
