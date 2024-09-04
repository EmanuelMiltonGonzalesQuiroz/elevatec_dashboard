const updateGrupo5 = (formData, valor3, allData) => {
  const getPrecioUnitario = (tipo, medida, keyword) => {
    const puerta = allData.doors[tipo];
    if (!puerta || !puerta.items) return 0;

    const item = puerta.items.find(
      (item) =>
        item.medida === medida &&
        Object.keys(item).some((key) =>
          key.toLowerCase().includes(keyword.toLowerCase())
        )
    );
    return item ? item[keyword] || 0 : 0;
  };

  // Función para buscar precios en `internal_config` según la velocidad
  const findInternalConfigPrice = (configKey, velocidadNombre) => {
    const configData = allData.internal_config[configKey]?.items || [];
    
    // Convertir `velocidadNombre` a número y asegurarnos de que `item["velocidad m/s"]` también sea un número
    const velocidadNumero = parseFloat(velocidadNombre.replace('m/s', '').trim());
    
    const configItem = configData.find(item => parseFloat(item["velocidad m/s"]) === velocidadNumero);

    return configItem ? configItem.precio : 0;
  };

  // Obtener el tipo y medida de la puerta del formData
  const tipoPuerta = formData['doors'].nombre.split(' - ')[0];
  const medidaPuerta = formData['doors'].nombre.split(' - ')[1];

  // Puerta de cabina
  const acabadoCabina = formData['AcabadoPuertaCabina'].nombre.toLowerCase();
  const precioPuertaCabina = getPrecioUnitario(
    tipoPuerta,
    medidaPuerta,
    'c_' + acabadoCabina.toLowerCase()
  );

  // Puertas en inoxidable
  const precioPuertasInoxidable = getPrecioUnitario(
    tipoPuerta,
    medidaPuerta,
    'p_inox'
  );

  // Puertas en epoxi
  const precioPuertasEpoxi = getPrecioUnitario(
    tipoPuerta,
    medidaPuerta,
    'p_epoxi'
  );

  // Puertas en vidrio
  const precioPuertasVidrio = getPrecioUnitario(
    tipoPuerta, 
    medidaPuerta,
    'p_de_vidrio'
  );

  // Descripciones para las unidades
  const descriptions = {
    "Puerta_de_cabina": 1,
    "Puertas_en_inoxidable": formData['Puertas_en_inoxidable'].UNIDADES || 0,
    "Puertas_En_Epoxi": formData['Puertas_En_Epoxi'].UNIDADES || 0,
    "Puertas_En_Vidrio": formData['Puertas_En_Vidrio'].UNIDADES || 0,
    "Regulador_de_velocidad": 1, // Agregamos aquí la búsqueda de precio
    "Freno": 1 // Agregamos aquí la búsqueda de precio
  };

  Object.keys(descriptions).forEach(description => {
    const key = Object.keys(formData).find(
      key => key.toLowerCase() === description.toLowerCase()
    );

    if (key && formData[key]) {
      const unidades = descriptions[description];
      
      let precioUnitario;
      switch (description) {
        case 'Puerta_de_cabina':
          precioUnitario = precioPuertaCabina;
          break;
        case 'Puertas_en_inoxidable':
          precioUnitario = precioPuertasInoxidable;
          break;
        case 'Puertas_En_Epoxi':
          precioUnitario = precioPuertasEpoxi;
          break;
        case 'Puertas_En_Vidrio':
          precioUnitario = precioPuertasVidrio;
          break;
        case 'Regulador_de_velocidad':
          // Buscar el precio en `internal_config` según la velocidad
          precioUnitario = findInternalConfigPrice("regulador de velocidad", formData['Velocidad'].nombre);
          break;
        case 'Freno':
          // Buscar el precio en `internal_config` según la velocidad
          precioUnitario = findInternalConfigPrice("freno", formData['Velocidad'].nombre);
          break;
        default:
          precioUnitario = formData[key].PRECIO_UNITARIO;
      }

      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3;
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

export default updateGrupo5;
