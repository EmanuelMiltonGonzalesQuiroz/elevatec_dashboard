import { useState } from 'react';
import { calcularCableTraccion, calcularRampus } from './CalculosFunciones';

const CalculosCablesTraccionCompensacion = ({
  valor3, setCableTraccion, setCadenaCompensacion
}) => {
  const calcularCablesTraccionYCompensacion = () => {
    const resultadoCableTraccion = calcularCableTraccion(traccion, recorrido, 0.02, valor3);
    setCableTraccion(resultadoCableTraccion.costoFinal);

    const resultadoCadenaCompensacion = calcularRampus(2, 0.00006, 0.12, valor3);
    setCadenaCompensacion(resultadoCadenaCompensacion.costoFinal);
  };

  return { calcularCablesTraccionYCompensacion };
};

export default CalculosCablesTraccionCompensacion;
