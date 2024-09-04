const calculateValues = (formData, allData) => {
  const basicItems = allData.basic_config["basic config"].items;

  // Obtener valores de los elementos del array según el nombre
  const getValueByName = (name) => {
    const item = basicItems.find(item => item.name === name);
    return item ? item.valor : 0;
  };

  const valor1 = getValueByName("Transporte de un contenedor 40 pies más transporte terrestre");
  const valor2 = getValueByName("Volumen de un contenedor de 40 pies (%)");
  const valor3 = valor2 * (getValueByName("Volumen de un contenedor de 40 pies")/100);
  const valor4 = valor1 / valor3;

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
    "Embarque",
    "Regenerador_de_energía"
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

  const VAR1 = sumaCostoFinal;
  const VAR2 = VAR1
  const VAR3 =  VAR1 * (getValueByName("Utilidad (%)") / 100);
  const VAR4 =VAR1+VAR2+VAR3
  const VAR5= VAR4* (getValueByName("Factura (%)") / 100);
  const VAR6= VAR4+VAR5
  const VAR7= VAR6*formData["08_Número de ascensores"]

  return { valor1, valor2, valor3, valor4, VAR1,VAR2,VAR3,VAR4,VAR5,VAR6,VAR7 };
};

export default calculateValues;
