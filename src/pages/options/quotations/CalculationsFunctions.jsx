
// Función para calcular volumen total (general)
const calcularVolumenTotal = (unidades, volumenPorPieza) => {
  return unidades * volumenPorPieza;
};

// Función para calcular transporte (general)
const calcularTransporte = (valor3, volumenTotal) => {
  return valor3 * volumenTotal;
};

// Función para calcular aduana (general)
const calcularAduana = (unidades, precioUnitario, transporte) => {
  return ((unidades * precioUnitario) + transporte) * 0.3;
};

// Función para calcular costo final (general)
const calcularCostoFinal = (aduana, transporte, unidades, precioUnitario) => {
  return aduana + transporte + (precioUnitario * unidades);
};

// Función para calcular RAMPUS, Brakets, Pernos Brakets, Pernos Empalme Braket
const calcularRampus = (paradas, volumenPorPieza, precioUnitario, valor3) => {
  const unidades = (paradas + 2) * 8;
  const volumenTotal = calcularVolumenTotal(unidades, volumenPorPieza);
  const transporte = calcularTransporte(valor3, volumenTotal);
  const aduana = calcularAduana(unidades, precioUnitario, transporte);
  const costoFinal = calcularCostoFinal(aduana, transporte, unidades, precioUnitario);
  return { volumenTotal, transporte, aduana, costoFinal };
};

// Función para calcular Riel de Cabina, Riel de Contrapeso
const calcularRiel = (recorrido, volumenPorPieza, precioUnitario, valor3) => {
  const unidades = Math.ceil(recorrido / 5) * 2;
  const volumenTotal = calcularVolumenTotal(unidades, volumenPorPieza);
  const transporte = calcularTransporte(valor3, volumenTotal);
  const aduana = calcularAduana(unidades, precioUnitario, transporte);
  const costoFinal = calcularCostoFinal(aduana, transporte, unidades, precioUnitario);
  return { volumenTotal, transporte, aduana, costoFinal };
};

// Función para calcular Estructura de Cabina, Estructura de Contrapeso, Estructura de Foso
const calcularEstructura = (volumenPorPieza, precioUnitario, valor3) => {
  const unidades = 1;
  const volumenTotal = calcularVolumenTotal(unidades, volumenPorPieza);
  const transporte = calcularTransporte(valor3, volumenTotal);
  const aduana = calcularAduana(unidades, precioUnitario, transporte);
  const costoFinal = calcularCostoFinal(aduana, transporte, unidades, precioUnitario);
  return { volumenTotal, transporte, aduana, costoFinal };
};

// Función para calcular Subtecho
const calcularSubtecho = (volumenPorPieza, tipoSubtecho, valor3) => {
  const unidades = 1;
  const precioUnitario = tipoSubtecho;
  const volumenTotal = calcularVolumenTotal(unidades, volumenPorPieza);
  const transporte = calcularTransporte(valor3, volumenTotal);
  const aduana = calcularAduana(unidades, precioUnitario, transporte);
  const costoFinal = calcularCostoFinal(aduana, transporte, unidades, precioUnitario);
  return { volumenTotal, transporte, aduana, costoFinal };
};

// Función para calcular Cabina
const calcularCabina = (volumenPorPieza, tipoCabina, valor3) => {
  const unidades = 1;
  const precioUnitario = tipoCabina;
  const volumenTotal = calcularVolumenTotal(unidades, volumenPorPieza);
  const transporte = calcularTransporte(valor3, volumenTotal);
  const aduana = calcularAduana(unidades, precioUnitario, transporte);
  const costoFinal = calcularCostoFinal(aduana, transporte, unidades, precioUnitario);
  return { volumenTotal, transporte, aduana, costoFinal };
};

// Función para calcular Cable de Tracción y Poleas
const calcularCableTraccion = (traccion, recorrido, volumenPorPieza, valor3) => {
  const unidades = traccion === '1 A 1' ? recorrido * 5 : recorrido * 2 * 5;
  const volumenTotal = calcularVolumenTotal(unidades, volumenPorPieza);
  const transporte = calcularTransporte(valor3, volumenTotal);
  const aduana = calcularAduana(unidades, 0, transporte);
  const costoFinal = calcularCostoFinal(aduana, transporte, unidades, 0);
  return { volumenTotal, transporte, aduana, costoFinal };
};

const calcularPoleas = (traccion, volumenPorPieza, valor3) => {
  const unidades = traccion === '1 A 1' ? 1 : 3;
  const volumenTotal = calcularVolumenTotal(unidades, volumenPorPieza);
  const transporte = calcularTransporte(valor3, volumenTotal);
  const aduana = calcularAduana(unidades, 0, transporte);
  const costoFinal = calcularCostoFinal(aduana, transporte, unidades, 0);
  return { volumenTotal, transporte, aduana, costoFinal };
};

export {
  calcularRampus,
  calcularRiel,
  calcularEstructura,
  calcularSubtecho,
  calcularCabina,
  calcularCableTraccion,
  calcularPoleas
};
