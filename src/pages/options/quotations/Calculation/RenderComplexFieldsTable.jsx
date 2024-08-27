import React from 'react';

const RenderComplexFieldsTable = ({ formData }) => {
  const complexFields = Object.keys(formData).filter(
    field => typeof formData[field] === 'object'
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
            <td className="px-4 py-2 border">{formData[field].UNIDADES || ''}</td>
            <td className="px-4 py-2 border">{formData[field].VOLUMEN_TOTAL_M3 || ''}</td>
            <td className="px-4 py-2 border">{formData[field].VOLUMEN_EN_M3_X_PIEZA || ''}</td>
            <td className="px-4 py-2 border">{formData[field].PRECIO_UNITARIO || ''}</td>
            <td className="px-4 py-2 border">{formData[field].TRANSPORTE || ''}</td>
            <td className="px-4 py-2 border">{formData[field].ADUANA || ''}</td>
            <td className="px-4 py-2 border">{formData[field].COSTO_FINAL || ''}</td>
            <td className="px-4 py-2 border">{formData[field].nombre || ''}</td>
            <td className="px-4 py-2 border">{formData[field].valor || ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RenderComplexFieldsTable;
