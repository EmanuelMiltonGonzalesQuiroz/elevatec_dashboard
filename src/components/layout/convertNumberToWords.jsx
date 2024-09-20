// @ts-nocheck
import writtenNumber from 'written-number';

export const convertNumberToWords = (num) => {
  writtenNumber.defaults.lang = 'es'; // Establecer el idioma español

  // Convertir el número a palabras
  let words = writtenNumber(num);

  // Solo la primera letra en mayúscula
  words = words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();

  return words;
};

