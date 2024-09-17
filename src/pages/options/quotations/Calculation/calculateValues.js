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

    const sumaCostoFinalBanco = Object.keys(formData)
    .filter(field => typeof formData[field] === 'object')
    .reduce((sum, key) => {
      const item = formData[key];
      if ((item.ADUANA || 0) !== 0 && (item.TRANSPORTE || 0) !== 0) {
        return sum + (item.COSTO_FINAL || 0);
      }
      return sum;
    }, 0);

  let VAR1 = sumaCostoFinal+sumaCostoFinalBanco * (getValueByName("Comision Bancaria (%)") / 100);;

  // Revisar si Interpisos es "Sí" y ajustar VAR1 basado en el número de personas
  if (formData["Interpisos"] === "Sí" || formData["Interpisos"] === undefined) {
    const paradas = formData["01_PARADAS"] || 0;
    
    // Buscar el valor correcto en allData.groups["Interpisos"]
    const interpisosItems = allData.groups["Interpisos"]?.items || [];
  
    // Valores por defecto en caso de que no se encuentren en los datos
    let valorMenosDe10Pisos = 320.2;
    let valorEntre10Y20Pisos = 254.6;
    let valorMasDe20Pisos = 181.9;
  
    // Buscar los valores en los items de Interpisos
    const itemMenosDe10Pisos = interpisosItems.find(item => item.nombre.includes("CONTROLADOR DE PISOS") && item.descripcion.includes("10 PISOS O MENO"));
    const itemEntre10Y20Pisos = interpisosItems.find(item => item.nombre.includes("CONTROLADOR INTERPISOS") && item.descripcion.includes("10 A 20 PISOS"));
    const itemMasDe20Pisos = interpisosItems.find(item => item.nombre.includes("TARJETADE INTER PISOS") && item.descripcion.includes("más de 20 pisos"));
  
    // Si existen los valores en los datos, actualizarlos
    if (itemMenosDe10Pisos) {
      valorMenosDe10Pisos = itemMenosDe10Pisos.valor;
    }
    if (itemEntre10Y20Pisos) {
      valorEntre10Y20Pisos = itemEntre10Y20Pisos.valor;
    }
    if (itemMasDe20Pisos) {
      valorMasDe20Pisos = itemMasDe20Pisos.valor;
    }
  
    // Aplicar los valores según el número de paradas
    if (paradas <= 10) {
      VAR1 += valorMenosDe10Pisos;
    } else if (paradas <= 20) {
      VAR1 += valorEntre10Y20Pisos;
    } else if (paradas <= 30) {
      VAR1 += valorMasDe20Pisos;
    }
  }
  
  const VAR2 = VAR1
  const VAR3 =  VAR1 * (getValueByName("Utilidad (%)") / 100);
  const VAR4 =VAR2+VAR3
  const VAR5= VAR4* (getValueByName("Factura (%)") / 100);
  const VAR6= VAR4+VAR5
  const VAR7= VAR6*formData["08_Número de ascensores"]

  return { valor1, valor2, valor3, valor4, VAR1,VAR2,VAR3,VAR4,VAR5,VAR6,VAR7 };
};

export default calculateValues;
