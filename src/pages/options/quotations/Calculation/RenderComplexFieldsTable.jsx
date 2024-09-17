const RenderComplexFieldsTable = ({ formData }) => {
  const preferredOrder = [
    "Ramplus",
    "Brakets",
    "Pernos_brakets",
    "Pernos_empalme_braket",
    "Riel_de_cabina",
    "Riel_de_contrapeso",
    "Estructura_de_cabina",
    "Estructura_de_contrapeso",
    "Estructura_de_foso",
    "SubTecho",
    "Cabina",
    "Hormigones",
    "Estructura_de_motor",
    "Pernos_de_motor",
    "Cable_de_traccion",
    "Chumbadores",
    "Poleas",
    "Corredizas_de_cabina",
    "Corredizas_de_contrapeso",
    "Puerta_de_cabina",
    "Puertas_en_inoxidable",
    "Puertas_En_Epoxi",
    "Puertas_En_Vidrio",
    "Regulador_de_velocidad",
    "Freno",
    "Cable_de_8mm",
    "Cadena_de_compensacion",
    "ACCESORIOS_DE_CADENA_DE_COMPENSACION",
    "Motor",
    "Maniobra",
    "Indicador_de_Cabina",
    "Indicador_de_piso",
    "Cableado_de_pisos",
    "LOP",
    "Tipo_de_Botonera_COP",
    "Botones_de_cabina",
    "Botones_de_piso",
    "Regla",
    "Embarque_Simple_Doble_Triple",
    "MRL_MR",
    "Pesacarga",
    "Regenerador_de_energia",
    "Indicador_de_solo_boton",
    "Llavines_con_llave",
    "Pasamanos_adicional",
    "Espejo_adicional",
    "Sistema_de_monitoreo",
    "Pre_Apertura_de_puertas",
    "Piso",
    "AutoTransformador",
    "ARD",
    "Ventiladores",
    "Aire_acondicionado",
    "Lector_de_Tarjetas",
    "Transporte_interno",
    "Comision_INTERNA_EMPRESA",
    "Mano_de_obra_produccion",
    "Mano_de_obra_instalaciones",
    "Costo_de_seguridad_agencias_transportes_internos",
    "Comision_del_banco_intermediario",
    "Señalizacion_Luminosas_de_Pisos",
    "Amortiguador",
    "Encoder",
  ];

  const complexFields = Object.keys(formData)
    .filter(field => typeof formData[field] === 'object' && formData[field] !== null)
    .sort((a, b) => {
      const indexA = preferredOrder.indexOf(a);
      const indexB = preferredOrder.indexOf(b);

      if (indexA === -1 && indexB === -1) {
        return 0; // Mantiene el orden original para campos que no están en preferredOrder
      } else if (indexA === -1) {
        return 1; // Los campos no listados se colocan al final
      } else if (indexB === -1) {
        return -1;
      } else {
        return indexA - indexB; // Ordena según preferredOrder
      }
    });

  const safeRender = (value) => {
    // Verifica si el valor es un número, una cadena, o undefined/null
    if (typeof value === 'number' || typeof value === 'string') {
      return value;
    }
    return '0'; // Si es un objeto, array, o cualquier otro tipo no renderizable, muestra '-'
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
