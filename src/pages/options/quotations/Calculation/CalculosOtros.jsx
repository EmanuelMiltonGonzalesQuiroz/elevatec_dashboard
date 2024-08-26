import { useState } from 'react';
import { calcularPoleas, calcularRampus, calcularEstructura } from './CalculosFunciones';

const CalculosOtros = ({
  valor3, setPoleas, setChumbadores, setCorredizasCabina, setCorredizasContrapeso
}) => {
  const calcularPoleas = () => {
    const resultadoPoleas = calcularPoleas(traccion, 0.01, valor3);
    setPoleas(resultadoPoleas.costoFinal);
  };

  const calcularChumbadores = () => {
    const resultadoChumbadores = calcularRampus(10, 0.00006, 0.12, valor3);
    setChumbadores(resultadoChumbadores.costoFinal);
  };

  const calcularCorredizas = () => {
    const resultadoCorredizasCabina = calcularRampus(4, 0.00006, 0.12, valor3);
    setCorredizasCabina(resultadoCorredizasCabina.costoFinal);

    const resultadoCorredizasContrapeso = calcularRampus(4, 0.00006, 0.12, valor3);
    setCorredizasContrapeso(resultadoCorredizasContrapeso.costoFinal);
  };

  return { calcularPoleas, calcularChumbadores, calcularCorredizas };
};

export default CalculosOtros;
