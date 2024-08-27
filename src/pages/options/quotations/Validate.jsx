import React, { useState, useEffect } from 'react';

const Validate = ({ formData, onShowMessage }) => {
  const [isValid, setIsValid] = useState(false);

  const requiredFields = [
    '02_CLIENTE', '03_PERSONAS', '01_PARADAS', '03_RECORRIDO', '06_Foso', '04_Frente', '05_ProfundidadR',
    '07_Huida', '08_Número de ascensores', '09_PISOS A ANTENDER'
  ];

  const variableFields = [
    'Cabina', 'Ciudad', 'Embarque', 'EnergiaElectrica', 'IndicadorCabinaPiso', 'IndicadorPisoBoton', 
    'MaquinaTraccion', 'Traccion', 'Velocidad', 'ARD', 'AcabadoPuertaCabina', 'EspejoAdicional', 
    'IndicadorPisoHorizontal', 'LectorTarjetas', 'PasamanosAdicional', 'Piso', 'SubTecho', 'Tipo', 
    'TipoBotonera', 'BotonesCabina', 'BotonesPiso', 'Llavines_con_llave'
  ];

  useEffect(() => {
    const missingFields = requiredFields.filter(field => !formData[field]);
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

    if (missingFields.length === 0 && hasNonDefaultValues) {
      setIsValid(true);
    } else {
      setIsValid(false);
      if (missingFields.length > 0) {
        onShowMessage(`Faltan los siguientes campos: ${missingFields.join(', ')}`);
      } else {
        onShowMessage('Debe haber al menos un campo de variables distinto a su valor inicial.');
      }
    }
  }, [formData, onShowMessage]);

  const renderSimpleFieldsTable = () => (
    <table className="table-auto w-full mt-4">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Campo</th>
          <th className="px-4 py-2 border">Valor</th>
        </tr>
      </thead>
      <tbody>
        {requiredFields.map((field, index) => (
          <tr key={index}>
            <td className="px-4 py-2 border">{field}</td>
            <td className="px-4 py-2 border">{formData[field]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderComplexFieldsTable = () => {
    const complexFields = Object.keys(formData).filter(
      field => !requiredFields.includes(field) && typeof formData[field] === 'object'
    );
  
    return (
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Descripción</th>
            <th className="px-4 py-2 border">UNIDADES</th>
            <th className="px-4 py-2 border">VOLUMEN_TOTAL_M3</th>
            <th className="px-4 py-2 border">VOLUMEN_EN_M3_X_PIEZA</th>
            <th className="px-4 py-2 border">PRECIO_UNITARIO</th>
            <th className="px-4 py-2 border">TRANSPORTE</th>
            <th className="px-4 py-2 border">ADUANA</th>
            <th className="px-4 py-2 border">COSTO_FINAL</th>
            <th className="px-4 py-2 border">nombre</th>
            <th className="px-4 py-2 border">valor</th>
          </tr>
        </thead>
        <tbody>
          {complexFields.map((field, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border">{field}</td>
              <td className="px-4 py-2 border">{formData[field].UNIDADES}</td>
              <td className="px-4 py-2 border">{formData[field].VOLUMEN_TOTAL_M3}</td>
              <td className="px-4 py-2 border">{formData[field].VOLUMEN_EN_M3_X_PIEZA}</td>
              <td className="px-4 py-2 border">{formData[field].PRECIO_UNITARIO}</td>
              <td className="px-4 py-2 border">{formData[field].TRANSPORTE}</td>
              <td className="px-4 py-2 border">{formData[field].ADUANA}</td>
              <td className="px-4 py-2 border">{formData[field].COSTO_FINAL}</td>
              <td className="px-4 py-2 border">{formData[field].nombre}</td>
              <td className="px-4 py-2 border">{formData[field].valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  

  return (
    <div>
      {isValid ? (
        <div>
          <h2 className="text-xl font-bold">Campos Simples</h2>
          {renderSimpleFieldsTable()}
          
          <h2 className="text-xl font-bold mt-8">Campos Complejos</h2>
          {renderComplexFieldsTable()}
        </div>
      ) : null}
    </div>
  );
};

export default Validate;
