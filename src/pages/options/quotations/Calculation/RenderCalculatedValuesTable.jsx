import React from 'react';

const RenderCalculatedValuesTable = ({ calculatedValues }) => {
  const variableNames = {
    valor1: 'Transporte de un contenedor 40 pies más transporte terrestre',
    valor2: 'Volumen de un contenedor de 40 pies (%)',
    valor3: 'VALOR 2 * VALOR 3',
    valor4: 'Costo por metro cúbico',
    VAR1: 'TOTAL COSTO FINAL',
    VAR2: 'COSTO REAL',
    VAR3: 'Utilidad (%)',
    VAR4: 'VENTA MÍNIMA',
    VAR5: 'Factura (%)',
    VAR6: 'TOTAL',
    VAR7: 'TOTAL FINAL'
  };

  return (
    <table className="table-auto w-full mt-4">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Descripción</th>
          <th className="px-4 py-2 border">Valor</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(calculatedValues).map(([key, value], index) => (
          <tr key={index}>
            <td className="px-4 py-2 border">
              {variableNames[key] || `Variable ${index + 1}`}
            </td>
            <td className="px-4 py-2 border">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RenderCalculatedValuesTable;
