import React from 'react';

const RenderFormDataFieldsTable = ({ formData, fields }) => (
  <table className="table-auto w-full mt-4">
    <thead>
      <tr>
        <th className="px-4 py-2 border">Campo</th>
        <th className="px-4 py-2 border">Valor</th>
      </tr>
    </thead>
    <tbody>
      {fields.map((field, index) => (
        <tr key={index}>
          <td className="px-4 py-2 border">{field}</td>
          <td className="px-4 py-2 border">{formData[field] || ''}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default RenderFormDataFieldsTable;
