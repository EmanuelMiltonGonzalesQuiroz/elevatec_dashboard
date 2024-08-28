const RenderComplexFieldsTable = ({ formData }) => {
  const complexFields = Object.keys(formData).filter(
    field => typeof formData[field] === 'object' && formData[field] !== null
  );

  const safeRender = (value) => {
    // Verifica si el valor es un número, una cadena, o undefined/null
    if (typeof value === 'number' || typeof value === 'string') {
      return value;
    }
    return '-'; // Si es un objeto, array, o cualquier otro tipo no renderizable, muestra '-'
  };

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
        {complexFields.map((field, index) => {
          const data = formData[field];
          return (
            <tr key={index}>
              <td className="px-4 py-2 border">{field}</td>
              <td className="px-4 py-2 border">{safeRender(data.UNIDADES)}</td>
              <td className="px-4 py-2 border">{safeRender(data.VOLUMEN_TOTAL_M3)}</td>
              <td className="px-4 py-2 border">{safeRender(data.VOLUMEN_EN_M3_X_PIEZA)}</td>
              <td className="px-4 py-2 border">{safeRender(data.PRECIO_UNITARIO)}</td>
              <td className="px-4 py-2 border">{safeRender(data.TRANSPORTE)}</td>
              <td className="px-4 py-2 border">{safeRender(data.ADUANA)}</td>
              <td className="px-4 py-2 border">{safeRender(data.COSTO_FINAL)}</td>
              <td className="px-4 py-2 border">{safeRender(data.nombre)}</td>
              <td className="px-4 py-2 border">{safeRender(data.valor)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RenderComplexFieldsTable;
