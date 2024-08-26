import { useState } from 'react';
import { calcularSubtecho, calcularCabina } from './CalculosFunciones';

const CalculosCabinasYSubtechos = ({ valor3, setSubtecho, setCabina }) => {
  const calcularSubtechos = () => {
    const resultadoSubtecho = calcularSubtecho(1, tipoSubtecho, valor3);
    setSubtecho(resultadoSubtecho.costoFinal);
  };

  const calcularCabinas = () => {
    const resultadoCabina = calcularCabina(2, tipoCabina, valor3);
    setCabina(resultadoCabina.costoFinal);
  };

  return { calcularSubtechos, calcularCabinas };
};

export default CalculosCabinasYSubtechos;
