const calculateValues = (formData, allData) => {
  const basicItems = allData.basic_config["basic config"].items;

  // Obtener valores de los elementos del array según el nombre
  const getValueByName = (name) => {
    const item = basicItems.find(item => item.name === name);
    return item ? item.valor : 0;
  };

  const valor0 = getValueByName("Transporte de un contenedor 40 pies más transporte terrestre");
  const valor1 = getValueByName("Volumen de un contenedor de 40 pies (%)");
  const valor2 = valor1 * 0.6;
  const valor3 = valor0 / valor2;

  // Campos específicos para restablecer COSTO_FINAL a 0
  const fieldsToReset = [
    "Ciudad",
    "EnergiaElectrica",
    "IndicadorCabinaPiso",
    "IndicadorPisoBoton",
    "MaquinaTraccion",
    "Traccion",
    "Velocidad",
    "elements",
    "doors",
    "AcabadoPuertaCabina",
    "EspejoAdicional",
    "IndicadorPisoHorizontal",
    "LectorTarjetas",
    "PasamanosAdicional",
    "Tipo",
    "TipoBotonera",
    "BotonesCabina",
    "BotonesPiso",
    "Embarque"
  ];

  // Restablecer COSTO_FINAL a 0 para los campos específicos
  fieldsToReset.forEach(field => {
    if (formData[field] && typeof formData[field] === 'object') {
      formData[field].COSTO_FINAL = 0;
    }
  });

  // Calcular suma de COSTO_FINAL después de restablecer los valores
  const sumaCostoFinal = Object.keys(formData)
    .filter(field => typeof formData[field] === 'object')
    .reduce((sum, key) => sum + (formData[key].COSTO_FINAL || 0), 0);

  const valor4 = sumaCostoFinal;
  const valor5 = valor4 * (getValueByName("Utilidad (%)") / 100); // Utilidad (%)
  const valor6 = (valor4 * 2) + valor5;
  const valor7 = valor6 * (getValueByName("Factura (%)") / 100); // Factura (%)
  const valor8 = valor6 + valor7;

  return { valor0, valor1, valor2, valor3, valor4, valor5, valor6, valor7, valor8 };
};

export default calculateValues;
