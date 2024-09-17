import React from 'react';

const RenderCalculatedValuesTable = ({ calculatedValues }) => (
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
            {index < 5 ? `VALOR ${index}` : `VAR${index - 4}`}
          </td>
          <td className="px-4 py-2 border">{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default RenderCalculatedValuesTable;
