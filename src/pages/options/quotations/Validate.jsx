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
      'Solicitante', 'Vendedor', '02_CLIENTE', 'Ubicacion', 'Ubicacion_nombre',
      '03_PERSONAS', '01_PARADAS', '03_RECORRIDO', '09_PISOS A ANTENDER',
      '04_Frente', '05_ProfundidadR', '06_Foso', '07_Huida', '08_Número de ascensores'
    ];

    const complexFields = [
      'Puertas_en_inoxidable', 'Puertas_En_Epoxi', 'Puertas_En_Vidrio'
    ];

    let errorMessage = '';

    // Validar campos numéricos requeridos
    const areRequiredFieldsValid = requiredNumericFields.every(field => {
      if (
        formData[field] === 0 ||
        formData[field] === undefined ||
        formData[field] === "" ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
      ) {
        errorMessage += `El campo ${field} tiene un valor no válido. `;
        return false;
      }
      return true;
    });

    // Verificar que todos los arrays no estén vacíos
    const areAllArraysEmpty = arrayFields.every(field => {
      if (Array.isArray(formData[field]) && formData[field].length === 0) {
        errorMessage += `El campo ${field} está vacío. `;
        return false;
      } 
      return true;
    });

    // Validar que los campos complejos no tengan valores predeterminados
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

    const totalUnits = complexFields.reduce((sum, field) => sum + (formData[field]?.UNIDADES || 0), 0);
    const stopsMatch = totalUnits === formData['01_PARADAS'];
    if (!stopsMatch) {
      errorMessage += 'La suma de UNIDADES en Puertas no coincide con el número de paradas. ';
    }

    // Si alguna de las validaciones de campos falla, no continuar con las validaciones de las puertas y motor
    if (!areRequiredFieldsValid || !areAllArraysEmpty || !hasNonDefaultValues || !stopsMatch) {
      setIsValid(false);
      onShowMessage(errorMessage || 'Hay campos que no cumplen con los criterios de validación.');
      return;
    }

    // Si los campos son válidos, entonces validar puertas y motor
    const getPrecioUnitario = (tipo, medida, keyword) => {
      const puerta = allData.doors[tipo];
      if (!puerta || !puerta.items) return 0;

      const item = puerta.items.find(
        (item) =>
          item.medida === medida &&
          Object.keys(item).some((key) =>
            key.toLowerCase().includes(keyword.toLowerCase())
          )
      );
      return item ? item[keyword] || 0 : 0;
    };

    const tipoPuerta = formData['doors']?.nombre?.split(' - ')[0];
    const medidaPuerta = formData['doors']?.nombre?.split(' - ')[1];
    const acabadoCabina = formData['AcabadoPuertaCabina']?.nombre?.toLowerCase();
    
    const precioPuertaCabina = getPrecioUnitario(tipoPuerta, medidaPuerta, 'c_' + acabadoCabina);
    const precioPuertasInoxidable = getPrecioUnitario(tipoPuerta, medidaPuerta, 'p_inox');
    const precioPuertasEpoxi = getPrecioUnitario(tipoPuerta, medidaPuerta, 'p_epoxi');
    const precioPuertasVidrio = getPrecioUnitario(tipoPuerta, medidaPuerta, 'p_de_vidrio');
    
    // Función para buscar el precio del motor
    const findGearleesPrecio = (velocidadNombre, personas) => {
      const motorData = allData.motors[velocidadNombre];
      const maquina_de_traccion = formData['MaquinaTraccion']?.nombre || '';
      if (!motorData || !Array.isArray(motorData.items)) {
        return 0;
      }

      const motor = motorData.items.find(item => personas >= item.personas && personas <= item.personas);
      if (maquina_de_traccion.toLowerCase().includes("gearlees")) {
        return motor ? motor.gearleesPrecio : 0;
      } else if (maquina_de_traccion.toLowerCase().includes("reductor")) {
        return motor ? motor.conReducPrecio : 0;
      } else {
        return 0;
      }
    };

    const velocidadClave = formData['Velocidad']?.nombre?.replace('/', '_').toLowerCase();
    const personas = formData['03_PERSONAS'] || 0;
    const precioMotor = findGearleesPrecio(velocidadClave, personas);

    // Mensajes de error personalizados para puertas, cabina y motor
    if (precioPuertaCabina === 0) {
      errorMessage += `No hay medida válida para la puerta de cabina con acabado ${acabadoCabina}. `;
    }
    if (precioPuertasInoxidable === 0 && formData['Puertas_en_inoxidable'].UNIDADES > 0) {
      errorMessage += `No hay medida válida para las puertas en inoxidable con la medida ${medidaPuerta}. `;
    }
    if (precioPuertasEpoxi === 0 && formData['Puertas_En_Epoxi'].UNIDADES > 0) {
      errorMessage += `No hay medida válida para las puertas en epoxi con la medida ${medidaPuerta}. `;
    }
    if (precioPuertasVidrio === 0 && formData['Puertas_En_Vidrio'].UNIDADES > 0) {
      errorMessage += `No hay medida válida para las puertas en vidrio con la medida ${medidaPuerta}. `;
    }
    if (precioMotor === 0) {
      errorMessage += 'No hay un motor de esa capacidad. ';
    }

    // Validar después de verificar los campos y los precios de puertas y motor
    if (precioPuertaCabina > 0 && precioMotor > 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
      onShowMessage(errorMessage || 'Hay campos que no cumplen con los criterios de validación.');
    }
  }, [formData, onShowMessage, allData]);

  return (
    <div>
      {isValid && (
        <Calculation formData={formData} allData={allData} setFormData={setFormData} />
      )}
    </div>
  );
};

export default Validate;
