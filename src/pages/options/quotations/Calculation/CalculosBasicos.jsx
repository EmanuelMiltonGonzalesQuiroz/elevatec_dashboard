import { useState } from 'react';
import { calcularRampus } from './CalculosFunciones';

const CalculosBasicos = ({ valor3, setRampus, setBrakets, setPernosBrakets, setPernosEmpalmeBraket }) => {
  const calcularComponentesBasicos = () => {
    const resultadoRampus = calcularRampus(paradas, 0.00006, 0.12, valor3);
    setRampus(resultadoRampus.costoFinal);

    const resultadoBrakets = calcularRampus(paradas, 0.00006, 0.12, valor3);
    setBrakets(resultadoBrakets.costoFinal);

    const resultadoPernosBrakets = calcularRampus(paradas, 0.00006, 0.12, valor3);
    setPernosBrakets(resultadoPernosBrakets.costoFinal);

    const resultadoPernosEmpalmeBraket = calcularRampus(paradas, 0.00006, 0.12, valor3);
    setPernosEmpalmeBraket(resultadoPernosEmpalmeBraket.costoFinal);
  };

  return { calcularComponentesBasicos };
};

export default CalculosBasicos;
