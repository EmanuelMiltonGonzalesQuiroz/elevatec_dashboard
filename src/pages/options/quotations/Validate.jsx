import React, { useState, useEffect } from 'react';
import Calculation from './Calculation';

const Validate = ({ formData, setFormData, allData, onShowMessage, handleCloseModal }) => {
  //console.log(formData)
 

  const [isValid, setIsValid] = useState(false);
  const [validationMessages, setValidationMessages] = useState([]);

  // Mapeo de nombres técnicos a nombres amigables
  const fieldLabels = {
    'ARD': 'Sistema ARD',
    'AcabadoPuertaCabina': 'Acabado de la Puerta de Cabina',
    'EspejoAdicional': 'Espejo Adicional',
    'IndicadorCabina': 'Indicador de Cabina',
    'IndicadorPiso': 'Indicador de Piso',
    'LectorTarjetas': 'Lector de Tarjetas',
    'PasamanosAdicional': 'Pasamanos Adicional',
    'Piso': 'Piso',
    'SubTecho': 'SubTecho',
    'Tipo': 'Tipo',
    'TipoBotonera': 'Tipo de Botonera',
    'BotonesCabina': 'Botones de Cabina',
    'BotonesPiso': 'Botones de Piso',
    'Cabina': 'Cabina',
    'Ciudad': 'Ciudad',
    'Embarque': 'Embarque',
    'EnergiaElectrica': 'Energía Eléctrica',
    'MaquinaTraccion': 'Máquina de Tracción',
    'Traccion': 'Tracción',
    'Velocidad': 'Velocidad',
    'Solicitante': 'Solicitante',
    'Vendedor': 'Vendedor',
    'MetodoDePago': 'Método de Pago',
    '02_CLIENTE': 'Cliente',
    'Ubicacion': 'Ubicación',
    'Ubicacion_nombre': 'Nombre de Ubicación',
    '03_PERSONAS': 'Número de Personas',
    '01_PARADAS': 'Número de Paradas',
    '03_RECORRIDO': 'Recorrido',
    '09_PISOS A ANTENDER': 'Pisos a Atender',
    '04_Frente': 'Frente',
    '05_ProfundidadR': 'Profundidad',
    '06_Foso': 'Foso',
    '07_Huida': 'Huida',
    '08_Número de ascensores': 'Número de Ascensores',
    'Puertas_en_inoxidable': 'Puertas en Inoxidable',
    'Puertas_En_Epoxi': 'Puertas en Epoxi',
    'Puertas_En_Vidrio': 'Puertas en Vidrio'
  };

  useEffect(() => {
    const arrayFields = [
      'ARD', 'AcabadoPuertaCabina', 'EspejoAdicional', 
      'IndicadorCabina','IndicadorPiso', 'LectorTarjetas', 'PasamanosAdicional', 'Piso', 
      'SubTecho', 'Tipo', 'TipoBotonera', 'BotonesCabina', 'BotonesPiso', 
      'Cabina', 'Ciudad', 'Embarque', 'EnergiaElectrica', 'MaquinaTraccion', 'Traccion', 'Velocidad'
    ];

    const requiredNumericFields = [
      'Vendedor', "MetodoDePago", '02_CLIENTE', 'Ubicacion', 'Ubicacion_nombre',
      '03_PERSONAS', '01_PARADAS', '03_RECORRIDO', '09_PISOS A ANTENDER',
      '04_Frente', '05_ProfundidadR', '06_Foso', '07_Huida', '08_Número de ascensores'
    ];

    const complexFields = [
      'Puertas_en_inoxidable', 'Puertas_En_Epoxi', 'Puertas_En_Vidrio'
    ];

    let validationMessagesArray = [];
    let formIsValid = true;

    // Validar todas las cotizaciones dentro del array formData
    formData.forEach((quotationData, index) => {
      let errorMessage = '';

      // Validar campos numéricos requeridos
      const areRequiredFieldsValid = requiredNumericFields.every(field => {
        if (
          quotationData[field] === 0 ||
          quotationData[field] === undefined ||
          quotationData[field] === "" ||
          (Array.isArray(quotationData[field]) && quotationData[field].length === 0)
        ) {
          errorMessage += `El campo "${fieldLabels[field]}" tiene un valor no válido. `;
          return false;
        }
        return true;
      });

      // Verificar que todos los arrays no estén vacíos
      const areAllArraysEmpty = arrayFields.every(field => {
        if (Array.isArray(quotationData[field]) && quotationData[field].length === 0) {
          errorMessage += `El campo "${fieldLabels[field]}" está vacío. `;
          return false;
        } 
        return true;
      });

      // Validar que los campos complejos no tengan valores predeterminados
      const hasNonDefaultValues = complexFields.some(field => {
        const variable = quotationData[field];
        if (
          variable &&
          (
            variable.UNIDADES !== 0 || 
            variable.VOLUMEN_TOTAL_M3 !== 0 || 
            variable.VOLUMEN_EN_M3_X_PIEZA !== 0 || 
            variable.PRECIO_UNITARIO !== 0 || 
            variable.TRANSPORTE !== 0 || 
            variable.ADUANA !== 0 || 
            variable.COSTO_FINAL !== 0
          )
        ) {
          return true;
        } else {
          errorMessage += `El campo "${fieldLabels[field]}" tiene todos sus valores en 0 o vacío. `;
          return false;
        }
      });

      const totalUnits = complexFields.reduce((sum, field) => sum + (quotationData[field]?.UNIDADES || 0), 0);
      const stopsMatch = totalUnits === quotationData['01_PARADAS'];
      if (!stopsMatch) {
        errorMessage += 'La Cantidad de Puertas no coincide con el número de paradas. ';
      }

      if (!areRequiredFieldsValid || !areAllArraysEmpty || !hasNonDefaultValues || !stopsMatch) {
        formIsValid = false;
        validationMessagesArray.push(`Cotización ${index + 1}: ${errorMessage}`);
      }
    });

    if (!formIsValid) {
      onShowMessage('Hay errores en las siguientes cotizaciones:\n' + validationMessagesArray.join('\n'));
      setValidationMessages(validationMessagesArray);
      setIsValid(false);
    } else {
      setIsValid(true);
      setValidationMessages([]);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, onShowMessage, allData]);

  return (
    <div>
      {isValid ? (
        <Calculation formData={formData} allData={allData} setFormData={setFormData} handleCloseModal={handleCloseModal} />
      ) : (
        validationMessages.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
            {validationMessages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        )
      )}
    </div>
  ); 
};

export default Validate;
