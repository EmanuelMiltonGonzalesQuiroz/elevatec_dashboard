import areStringsSimilar from './areStringsSimilar';

// Función para buscar un valor específico en la tabla de precios
const SearchValue = (priceTableData, valorBuscado, campo) => {
  const priceTableItems = priceTableData?.items || [];
  
  // Intentar encontrar el item utilizando areStringsSimilar
  let item = priceTableItems.find((item) => areStringsSimilar(item.name, valorBuscado));
  // Si no se encuentra el item, intentar una búsqueda directa
  if (!item) {
    item = priceTableItems.find((item) => item.name === valorBuscado);
  }

  // Depuración para "Cable de 6mm Regulador de velocidad"


  // Si se encuentra el item, devuelve el valor del campo especificado, de lo contrario, 0
  return item ? item[campo] || 0 : 0;
};

export default SearchValue;
