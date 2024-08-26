import { useState } from 'react';
import { calcularEstructura } from './CalculosFunciones';

const CalculosEstructuras = ({
  valor3, setEstructuraCabina, setEstructuraContrapeso, setEstructuraFoso
}) => {
  const calcularEstructuras = () => {
    const resultadoEstructuraCabina = calcularEstructura(0.5, 100, valor3);
    setEstructuraCabina(resultadoEstructuraCabina.costoFinal);

    const resultadoEstructuraContrapeso = calcularEstructura(0.5, 100, valor3);
    setEstructuraContrapeso(resultadoEstructuraContrapeso.costoFinal);

    const resultadoEstructuraFoso = calcularEstructura(0.5, 100, valor3);
    setEstructuraFoso(resultadoEstructuraFoso.costoFinal);
  };

  return { calcularEstructuras };
};

export default CalculosEstructuras;
