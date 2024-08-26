import { useState } from 'react';
import { calcularRampus, calcularEstructura } from './CalculosFunciones';

const CalculosHormigonesMotorPernos = ({
  valor3, setHormigones, setEstructuraMotor, setPernosMotor
}) => {
  const calcularHormigones = () => {
    const resultadoHormigones = calcularRampus(15, 0.5, 50, valor3);
    setHormigones(resultadoHormigones.costoFinal);
  };

  const calcularEstructuraMotorYPernos = () => {
    const resultadoEstructuraMotor = calcularEstructura(1, 100, valor3);
    setEstructuraMotor(resultadoEstructuraMotor.costoFinal);

    const resultadoPernosMotor = calcularRampus(4, 0.00006, 0.12, valor3);
    setPernosMotor(resultadoPernosMotor.costoFinal);
  };

  return { calcularHormigones, calcularEstructuraMotorYPernos };
};

export default CalculosHormigonesMotorPernos;
