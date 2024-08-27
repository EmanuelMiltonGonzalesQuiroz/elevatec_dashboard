// InitializeVariables.jsx
import { useState, useEffect } from 'react';

const initializeVariable = () => ({
  UNIDADES: 0,
  VOLUMEN_TOTAL_M3: 0,
  VOLUMEN_EN_M3_X_PIEZA: 0,
  PRECIO_UNITARIO: 0,
  TRANSPORTE: 0,
  ADUANA: 0,
  COSTO_FINAL: 0,
});

const useInitializeVariables = () => {
  const [variables, setVariables] = useState({});

  useEffect(() => {
    const initVars = {
      "01_PARADAS": 0,
      "02_CLIENTE": "",
      "03_RECORRIDO": 0,
      "03_PERSONAS": 0,
      "04_Frente": 0,
      "05_ProfundidadR": 0,
      "06_Foso": 0,
      "07_Huida": 0,
      "08_Número de ascensores": 0,
      "09_PISOS A ANTENDER": "",
      Ramplus: initializeVariable(),
      Brakets: initializeVariable(),
      Pernos_brakets: initializeVariable(),
      Pernos_empalme_braket: initializeVariable(),
      Riel_de_cabina: initializeVariable(),
      Riel_de_contrapeso: initializeVariable(),
      Pernos_de_empalmes: initializeVariable(),
      Estructura_de_cabina: initializeVariable(),
      Estructura_de_contrapeso: initializeVariable(),
      Estructura_de_foso: initializeVariable(),
      Subtecho: initializeVariable(),
      Cabina: initializeVariable(),
      Hormigones: initializeVariable(),
      Estructura_de_motor: initializeVariable(),
      Pernos_de_motor: initializeVariable(),
      Cable_de_traccion: initializeVariable(),
      Chumbadores: initializeVariable(),
      Poleas: initializeVariable(),
      Corredizas_de_cabina: initializeVariable(),
      Corredizas_de_contrapeso: initializeVariable(),
      Puerta_de_cabina: initializeVariable(),
      Puertas_en_inoxidable: initializeVariable(),
      Puertas_En_Epoxi: initializeVariable(),
      Puertas_En_Vidrio: initializeVariable(),
      Regulador_de_velocidad: initializeVariable(),
      Freno: initializeVariable(),
      Cable_de_8mm: initializeVariable(),
      Cadena_de_compensacion: initializeVariable(),
      Motor: initializeVariable(),
      Maniobra: initializeVariable(),
      Indicador_de_Cabina: initializeVariable(),
      Indicador_de_piso: initializeVariable(),
      Cableado_de_pisos: initializeVariable(),
      LOP: initializeVariable(),
      Tipo_de_Botonera_COP: initializeVariable(),
      Botones_de_cabina: initializeVariable(),
      Botones_de_piso: initializeVariable(),
      Regla: initializeVariable(),
      Embarque_Simple_Doble_Triple: initializeVariable(),
      MRL_MR: initializeVariable(),
      Pesacarga: initializeVariable(),
      Regenerador_de_energia: initializeVariable(),
      Llavines_con_llave: initializeVariable(),
      Pasamanos_adicional: initializeVariable(),
      Espejo_adicional: initializeVariable(),
      Sistema_de_monitoreo: initializeVariable(),
      Pre_Apertura_de_puertas: initializeVariable(),
      Piso: initializeVariable(),
      AutoTransformador: initializeVariable(),
      ARD: initializeVariable(),
      Ventiladores: initializeVariable(),
      Aire_acondicionado: initializeVariable(),
      Lector_de_Tarjetas: initializeVariable(),
      Transporte_interno: initializeVariable(),
      Comision_INTERNA_EMPRESA: initializeVariable(),
      Mano_de_obra_produccion: initializeVariable(),
      Mano_de_obra_instalaciones: initializeVariable(),
      Costo_de_seguridad_agencias_transportes_internos: initializeVariable(),
      Comision_del_banco_intermediario: initializeVariable(),
      Ciudad: [],
      EnergiaElectrica: [],
      IndicadorCabinaPiso: [],
      IndicadorPisoBoton: [],
      MaquinaTraccion: [],
      Traccion: [],
      Velocidad: [],
      elements: [],
      doors: [],
      AcabadoPuertaCabina: [],
      EspejoAdicional: [],
      IndicadorPisoHorizontal: [],
      LectorTarjetas: [],
      PasamanosAdicional: [],
      SubTecho: [],
      Tipo: [],
      TipoBotonera: [],
      BotonesCabina: [],
      BotonesPiso: [],
    };

    setVariables(initVars);
  }, []);

  return variables;
};

export default useInitializeVariables;
