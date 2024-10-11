
const lowercaseWords = [
    'de', 'u', 'y', 'e', 'o', 'a', 'con', 'por', 'para',
    'en', 'el', 'la', 'los', 'las', 'un', 'una', 'unos',
    'unas', 'al', 'del'
  ];
  
  // Función para formatear los títulos
  export const formatTitle = (title) => {
    return title
      .replace(/_/g, ' ') // Reemplaza guiones bajos por espacios
      .split(' ') // Divide en palabras
      .map((word) => {
        if (lowercaseWords.includes(word.toLowerCase())) {
          return word.toLowerCase(); // Palabras en minúscula
        } else {
          // Capitaliza la primera letra y el resto en minúscula
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      })
      .join(' '); // Une las palabras de nuevo
  };
  