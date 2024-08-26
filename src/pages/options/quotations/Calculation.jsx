/*import React, { useState } from 'react';
import CalculosBasicos from './CalculosBasicos';
import CalculosRieles from './CalculosRieles';
import CalculosEstructuras from './CalculosEstructuras';
import CalculosCabinasYSubtechos from './CalculosCabinasYSubtechos';
import CalculosHormigonesMotorPernos from './CalculosHormigonesMotorPernos';
import CalculosCablesTraccionCompensacion from './CalculosCablesTraccionCompensacion';
import CalculosOtros from './CalculosOtros';

const Calculation = () => {
  const [valor3, setValor3] = useState(0);
  const [rampus, setRampus] = useState(0);
  const [brakets, setBrakets] = useState(0);
  const [pernosBrakets, setPernosBrakets] = useState(0);
  const [pernosEmpalmeBraket, setPernosEmpalmeBraket] = useState(0);
  const [rielCabina, setRielCabina] = useState(0);
  const [rielContrapeso, setRielContrapeso] = useState(0);
  const [estructuraCabina, setEstructuraCabina] = useState(0);
  const [estructuraContrapeso, setEstructuraContrapeso] = useState(0);
  const [estructuraFoso, setEstructuraFoso] = useState(0);
  const [subtecho, setSubtecho] = useState(0);
  const [cabina, setCabina] = useState(0);
  const [hormigones, setHormigones] = useState(0);
  const [estructuraMotor, setEstructuraMotor] = useState(0);
  const [pernosMotor, setPernosMotor] = useState(0);
  const [cableTraccion, setCableTraccion] = useState(0);
  const [cadenaCompensacion, setCadenaCompensacion] = useState(0);
  const [poleas, setPoleas] = useState(0);
  const [chumbadores, setChumbadores] = useState(0);
  const [corredizasCabina, setCorredizasCabina] = useState(0);
  const [corredizasContrapeso, setCorredizasContrapeso] = useState(0);

  const calculosBasicos = CalculosBasicos({ valor3, setRampus, setBrakets, setPernosBrakets, setPernosEmpalmeBraket });
  const calculosRieles = CalculosRieles({ valor3, setRielCabina, setRielContrapeso });
  const calculosEstructuras = CalculosEstructuras({ valor3, setEstructuraCabina, setEstructuraContrapeso, setEstructuraFoso });
  const calculosCabinasYSubtechos = CalculosCabinasYSubtechos({ valor3, setSubtecho, setCabina });
  const calculosHormigonesMotorPernos = CalculosHormigonesMotorPernos({ valor3, setHormigones, setEstructuraMotor, setPernosMotor });
  const calculosCablesTraccionCompensacion = CalculosCablesTraccionCompensacion({ valor3, setCableTraccion, setCadenaCompensacion });
  const calculosOtros = CalculosOtros({ valor3, setPoleas, setChumbadores, setCorredizasCabina, setCorredizasContrapeso });

  const ejecutarCalculos = () => {
    calculosBasicos.calcularComponentesBasicos();
    calculosRieles.calcularRieles();
    calculosEstructuras.calcularEstructuras();
    calculosCabinasYSubtechos.calcularSubtechos();
    calculosCabinasYSubtechos.calcularCabinas();
    calculosHormigonesMotorPernos.calcularHormigones();
    calculosHormigonesMotorPernos.calcularEstructuraMotorYPernos();
    calculosCablesTraccionCompensacion.calcularCablesTraccionYCompensacion();
    calculosOtros.calcularPoleas();
    calculosOtros.calcularChumbadores();
    calculosOtros.calcularCorredizas();
  };

  return (
    <div>
      <button onClick={ejecutarCalculos}>Ejecutar Cálculos</button>
    </div>
  );
};

export default Calculation;
*/