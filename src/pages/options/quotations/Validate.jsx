import React, { useState, useEffect } from 'react';
import Calculation from './Calculation';

const Validate = ({ formData, setFormData, allData, onShowMessage }) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const arrayFields = [
      'ARD', 'AcabadoPuertaCabina', 'EspejoAdicional', 
      'IndicadorPisoHorizontal', 'LectorTarjetas', 'PasamanosAdicional', 'Piso', 
      'SubTecho', 'Tipo', 'TipoBotonera', 'BotonesCabina', 'BotonesPiso', 
      'Cabina', 'Ciudad', 'Embarque', 'EnergiaElectrica', 'IndicadorCabinaPiso', 
      'IndicadorPisoBoton', 'MaquinaTraccion', 'Traccion', 'Velocidad'
    ];

    const requiredNumericFields = [
      '03_PERSONAS', '01_PARADAS', '03_RECORRIDO', '09_PISOS A ANTENDER',
      '04_Frente', '05_ProfundidadR', '06_Foso', '07_Huida', '08_Número de ascensores'
    ];

    const complexFields = [
      'Puertas_en_inoxidable', 'Puertas_En_Epoxi', 'Puertas_En_Vidrio'
    ];

    let errorMessage = '';

    const hasNonDefaultValues = complexFields.some(field => {
      const variable = formData[field];
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
        errorMessage += `El campo ${field} tiene todos sus valores en 0 o vacío. `;
        return false;
      }
    });

    const areAllArraysEmpty = arrayFields.every(field => {
      if (Array.isArray(formData[field]) && formData[field].length === 0) {
        errorMessage += `El campo ${field} está vacío. `;
        return false;
      } else if (Array.isArray(formData[field]) && formData[field].length > 0) {
        errorMessage += `El campo ${field} tiene datos: ${JSON.stringify(formData[field])}. `;
        return true;
      }
      return true;
    });

    const areRequiredFieldsValid = requiredNumericFields.every(field => {
      if (formData[field] === 0 || formData[field] === undefined) {
        errorMessage += `El campo ${field} tiene un valor no válido. `;
        return false;
      }
      return true;
    });

    const totalUnits = complexFields.reduce((sum, field) => sum + (formData[field]?.UNIDADES || 0), 0);
    const stopsMatch = totalUnits === formData['01_PARADAS'];
    if (!stopsMatch) {
      errorMessage += 'La suma de UNIDADES en Puertas no coincide con el número de paradas. ';
    }

    if (areAllArraysEmpty && areRequiredFieldsValid && hasNonDefaultValues && stopsMatch) {
      setIsValid(true);
    } else {
      setIsValid(false);
      onShowMessage(errorMessage || 'Hay campos que no cumplen con los criterios de validación.');
    }
  }, [formData, onShowMessage]);

  return (
    <div>
      {isValid && (
        <Calculation formData={formData} allData={allData} setFormData={setFormData} />
      )}
    </div>
  );
};

export default Validate;
