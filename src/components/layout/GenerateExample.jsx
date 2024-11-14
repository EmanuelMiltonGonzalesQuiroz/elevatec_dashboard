// GenerateExample.jsx
import React from 'react';
import * as XLSX from 'xlsx';

const GenerateExample = ({ headers, name }) => {
  const handleGenerateExample = () => {
    const exampleData = [headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {})];

    const worksheet = XLSX.utils.json_to_sheet(exampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ejemplo');

    XLSX.writeFile(workbook, `${name}.xlsx`);
    console.log('Archivo de ejemplo creado exitosamente.');
  };

  return (
    <button onClick={handleGenerateExample} className="bg-purple-500 text-white px-4 py-2 rounded">
      Descargar Ejemplo de Formato
    </button>
  );
};

export default GenerateExample;
