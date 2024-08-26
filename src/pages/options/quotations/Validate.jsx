import { useEffect, useState } from 'react';

const Validate = ({ formData, onShowMessage }) => {
  const [, setIsValid] = useState(false);
  console.log(formData)

  useEffect(() => {
    const requiredFields = [
      '02_CLIENTE', '03_PERSONAS', '01_PARADAS', '03_RECORRIDO', '06_Foso', '04_Frente', '05_ProfundidadR',
      '07_Huida', '08_Número de ascensores', 'Cabina', 'Ciudad', 'embark', 'electricity',
      'Indicador_de_Cabina', 'Indicador_de_piso', 'Motor', 'Cable_de_traccion', 
      'locks', 'Puerta_de_cabina', 'ARD', 'Cabina', 'Espejo_adicional', 
      'Indicador_de_piso', 'Lector_de_Tarjetas', 'Pasamanos_adicional', 
      'Piso', 'Subtecho', 'MRL_MR', 'Maniobra', 'Botones_de_cabina', 
      'Botones_de_piso'
    ];

    const missingFields = requiredFields.filter(field => 
      formData[field] === 0 || formData[field] === "" || formData[field] === null
    );

    const mismatches = [];

    if (formData['01_PARADAS']) {
      formData['Puertas_en_inoxidable'].UNIDADES = formData['01_PARADAS'];
    }

    if (formData['floorAssignments'] && new Set(formData['floorAssignments']).size !== formData['floorAssignments'].length) {
      mismatches.push('No puede haber asignaciones duplicadas a la misma parada');
    }

    const variableFields = [
      'RAMPUS', 'Brakets', 'Pernos_brakets', 'Pernos_empalme_braket', 'Riel_de_cabina',
      'Riel_de_contrapeso', 'Pernos_de_empalmes', 'Estructura_de_cabina', 
      'Estructura_de_contrapeso', 'Estructura_de_foso', 'Subtecho', 'Cabina', 
      'Hormigones', 'Estructura_de_motor', 'Pernos_de_motor', 'Cable_de_traccion',
      'Chumbadores', 'Poleas', 'Corredizas_de_cabina', 'Corredizas_de_contrapeso', 
      'Puerta_de_cabina', 'Puertas_en_inoxidable', 'Puertas_En_Epoxi', 'Puertas_En_Vidrio', 
      'Regulador_de_velocidad', 'Freno', 'Cable_de_8mm', 'Cadena_de_compensacion', 
      'Motor', 'Maniobra', 'Indicador_de_Cabina', 'Indicador_de_piso', 'Cableado_de_pisos', 
      'LOP', 'Tipo_de_Botonera_COP', 'Botones_de_cabina', 'Botones_de_piso', 
      'Regla', 'Embarque_Simple_Doble_Triple', 'MRL_MR', 'Pesacarga', 
      'Regenerador_de_energia', 'Llavines_con_llave', 'Pasamanos_adicional', 
      'Espejo_adicional', 'Sistema_de_monitoreo', 'Pre_Apertura_de_puertas', 
      'Piso', 'AutoTransformador', 'ARD', 'Ventiladores', 'Aire_acondicionado', 
      'Lector_de_Tarjetas', 'Transporte_interno', 'Comision_INTERNA_EMPRESA', 
      'Mano_de_obra_produccion', 'Mano_de_obra_instalaciones', 
      'Costo_de_seguridad_agencias_transportes_internos', 
      'Comision_del_banco_intermediario'
    ];

    const hasNonDefaultValues = variableFields.some(field => {
      const variable = formData[field];
      return variable?.UNIDADES !== 0 || 
             variable?.VOLUMEN_TOTAL_M3 !== 0 || 
             variable?.VOLUMEN_EN_M3_X_PIEZA !== 0 || 
             variable?.PRECIO_UNITARIO !== 0 || 
             variable?.TRANSPORTE !== 0 || 
             variable?.ADUANA !== 0 || 
             variable?.COSTO_FINAL !== 0;
    });

    if (missingFields.length === 0 && mismatches.length === 0 && hasNonDefaultValues) {
      setIsValid(true);
    } else {
      setIsValid(false);
      if (missingFields.length > 0) {
        onShowMessage(`Faltan los siguientes campos: ${missingFields.join(', ')}`);
      } else if (mismatches.length > 0) {
        onShowMessage(mismatches.join('. '));
      } else if (!hasNonDefaultValues) {
        onShowMessage('Debe haber al menos un campo de variables distinto a su valor inicial.');
      }
    }
  }, [formData, onShowMessage]);

  return null;
};

export default Validate;
