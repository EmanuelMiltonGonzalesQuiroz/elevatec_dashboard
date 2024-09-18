import 'jspdf-autotable';

// Función para verificar si se necesita un salto de página
const checkAddPage = (doc, currentY, additionalSpace = 20) => {
  const pageHeight = doc.internal.pageSize.height;
  if (currentY + additionalSpace > pageHeight) {
    doc.addPage();
    return 30; // Reinicia la posición Y en la nueva página
  }
  return currentY;
};

const TableComponent = ({ doc, formData, values, startY }) => {
  // Definir los datos principales
  const valorFormateado = parseFloat(values["VAR7"].toFixed(2)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rowsFromFormData = [
    ["Ramplus", formData.Ramplus?.UNIDADES, formData.Ramplus?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Ramplus?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Ramplus?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Brakets", formData.Brakets?.UNIDADES, formData.Brakets?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Brakets?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Brakets?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Pernos brakets (sapos)", formData.Pernos_brakets?.UNIDADES, formData.Pernos_brakets?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pernos_brakets?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pernos_brakets?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Pernos empalme braket", formData.Pernos_empalme_braket?.UNIDADES, formData.Pernos_empalme_braket?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pernos_empalme_braket?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pernos_empalme_braket?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Riel de cabina + Pernos", formData.Riel_de_cabina?.UNIDADES, formData.Riel_de_cabina?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Riel_de_cabina?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Riel_de_cabina?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Riel de contrapeso + Pernos", formData.Riel_de_contrapeso?.UNIDADES, formData.Riel_de_contrapeso?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Riel_de_contrapeso?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Riel_de_contrapeso?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Estructura de cabina", formData.Estructura_de_cabina?.UNIDADES, formData.Estructura_de_cabina?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Estructura_de_cabina?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Estructura_de_cabina?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Estructura de contrapeso", formData.Estructura_de_contrapeso?.UNIDADES, formData.Estructura_de_contrapeso?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Estructura_de_contrapeso?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Estructura_de_contrapeso?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Estructura de foso", formData.Estructura_de_foso?.UNIDADES, formData.Estructura_de_foso?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Estructura_de_foso?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Estructura_de_foso?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Subtecho", formData.SubTecho?.UNIDADES, formData.SubTecho?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.SubTecho?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.SubTecho?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Cabina", formData.Cabina?.UNIDADES, formData.Cabina?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Cabina?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Cabina?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Hormigones", formData.Hormigones?.UNIDADES, formData.Hormigones?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Hormigones?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Hormigones?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Estructura de motor", formData.Estructura_de_motor?.UNIDADES, formData.Estructura_de_motor?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Estructura_de_motor?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Estructura_de_motor?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Pernos de motor", formData.Pernos_de_motor?.UNIDADES, formData.Pernos_de_motor?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pernos_de_motor?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pernos_de_motor?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Cable de tracción", formData.Cable_de_traccion?.UNIDADES, formData.Cable_de_traccion?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Cable_de_traccion?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Cable_de_traccion?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Chumbadores", formData.Chumbadores?.UNIDADES, formData.Chumbadores?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Chumbadores?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Chumbadores?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Poleas", formData.Poleas?.UNIDADES, formData.Poleas?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Poleas?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Poleas?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Corredizas de cabina", formData.Corredizas_de_cabina?.UNIDADES, formData.Corredizas_de_cabina?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Corredizas_de_cabina?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Corredizas_de_cabina?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Corredizas de contrapeso", formData.Corredizas_de_contrapeso?.UNIDADES, formData.Corredizas_de_contrapeso?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Corredizas_de_contrapeso?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Corredizas_de_contrapeso?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Puerta de cabina", formData.Puerta_de_cabina?.UNIDADES, formData.Puerta_de_cabina?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Puerta_de_cabina?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Puerta_de_cabina?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Puertas en inoxidable", formData.Puertas_en_inoxidable?.UNIDADES, formData.Puertas_en_inoxidable?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Puertas_en_inoxidable?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Puertas_en_inoxidable?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Puertas En Epoxi", formData.Puertas_En_Epoxi?.UNIDADES, formData.Puertas_En_Epoxi?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Puertas_En_Epoxi?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Puertas_En_Epoxi?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Puertas En Vidrio", formData.Puertas_En_Vidrio?.UNIDADES, formData.Puertas_En_Vidrio?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Puertas_En_Vidrio?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Puertas_En_Vidrio?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Regulador de velocidad", formData.Regulador_de_velocidad?.UNIDADES, formData.Regulador_de_velocidad?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Regulador_de_velocidad?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Regulador_de_velocidad?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Freno", formData.Freno?.UNIDADES, formData.Freno?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Freno?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Freno?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Cable de 6mm Regulador de velocidad", formData.Cable_de_8mm?.UNIDADES, formData.Cable_de_8mm?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Cable_de_8mm?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Cable_de_8mm?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Cadena de compensacion", formData.Cadena_de_compensacion?.UNIDADES, formData.Cadena_de_compensacion?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Cadena_de_compensacion?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Cadena_de_compensacion?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Motor", formData.Motor?.UNIDADES, formData.Motor?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Motor?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Motor?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Maniobra", formData.Maniobra?.UNIDADES, formData.Maniobra?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Maniobra?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Maniobra?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Indicador de Cabina", formData.Indicador_de_Cabina?.UNIDADES, formData.Indicador_de_Cabina?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Indicador_de_Cabina?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Indicador_de_Cabina?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Indicador de piso", formData.Indicador_de_piso?.UNIDADES, formData.Indicador_de_piso?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Indicador_de_piso?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Indicador_de_piso?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Cableado de pisos", formData.Cableado_de_pisos?.UNIDADES, formData.Cableado_de_pisos?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Cableado_de_pisos?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Cableado_de_pisos?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["LOP", formData.LOP?.UNIDADES, formData.LOP?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.LOP?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.LOP?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Tipo de Botonera COP", formData.Tipo_de_Botonera_COP?.UNIDADES, formData.Tipo_de_Botonera_COP?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Tipo_de_Botonera_COP?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Tipo_de_Botonera_COP?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Botones de cabina", formData.Botones_de_cabina?.UNIDADES, formData.Botones_de_cabina?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Botones_de_cabina?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Botones_de_cabina?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Botones de piso", formData.Botones_de_piso?.UNIDADES, formData.Botones_de_piso?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Botones_de_piso?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Botones_de_piso?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Regla", formData.Regla?.UNIDADES, formData.Regla?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Regla?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Regla?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Embarque Simple,Doble,Triple", formData.Embarque_Simple_Doble_Triple?.UNIDADES, formData.Embarque_Simple_Doble_Triple?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Embarque_Simple_Doble_Triple?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Embarque_Simple_Doble_Triple?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["MRL/MR", formData.MRL_MR?.UNIDADES, formData.MRL_MR?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.MRL_MR?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.MRL_MR?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Pesacarga", formData.Pesacarga?.UNIDADES, formData.Pesacarga?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pesacarga?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pesacarga?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Regenerador de energia", formData.Regenerador_de_energia?.UNIDADES, formData.Regenerador_de_energia?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Regenerador_de_energia?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Regenerador_de_energia?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Indicador de solo botón", formData.Indicador_de_solo_boton?.UNIDADES, formData.Indicador_de_solo_boton?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Indicador_de_solo_boton?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Indicador_de_solo_boton?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Llavines con llave", formData.Llavines_con_llave?.UNIDADES, formData.Llavines_con_llave?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Llavines_con_llave?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Llavines_con_llave?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Pasamanos adicional", formData.Pasamanos_adicional?.UNIDADES, formData.Pasamanos_adicional?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pasamanos_adicional?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pasamanos_adicional?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Espejo adicional", formData.Espejo_adicional?.UNIDADES, formData.Espejo_adicional?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Espejo_adicional?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Espejo_adicional?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Sistema de monitoreo", formData.Sistema_de_monitoreo?.UNIDADES, formData.Sistema_de_monitoreo?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Sistema_de_monitoreo?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Sistema_de_monitoreo?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Pre Apertura de puertas", formData.Pre_Apertura_de_puertas?.UNIDADES, formData.Pre_Apertura_de_puertas?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pre_Apertura_de_puertas?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Pre_Apertura_de_puertas?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Piso", formData.Piso?.UNIDADES, formData.Piso?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Piso?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Piso?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["AutoTransformador", formData.AutoTransformador?.UNIDADES, formData.AutoTransformador?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.AutoTransformador?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.AutoTransformador?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["ARD", formData.ARD?.UNIDADES, formData.ARD?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.ARD?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.ARD?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Ventiladores", formData.Ventiladores?.UNIDADES, formData.Ventiladores?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Ventiladores?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Ventiladores?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Aire acondicionado", formData.Aire_acondicionado?.UNIDADES, formData.Aire_acondicionado?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Aire_acondicionado?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Aire_acondicionado?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Lector de Tarjetas", formData.Lector_de_Tarjetas?.UNIDADES, formData.Lector_de_Tarjetas?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Lector_de_Tarjetas?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Lector_de_Tarjetas?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Transporte interno", formData.Transporte_interno?.UNIDADES, formData.Transporte_interno?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Transporte_interno?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Transporte_interno?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Comision INTERNA EMPRESA", formData.Comision_INTERNA_EMPRESA?.UNIDADES, formData.Comision_INTERNA_EMPRESA?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Comision_INTERNA_EMPRESA?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Comision_INTERNA_EMPRESA?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Mano de obra produccion", formData.Mano_de_obra_produccion?.UNIDADES, formData.Mano_de_obra_produccion?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Mano_de_obra_produccion?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Mano_de_obra_produccion?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Mano de obra instalaciones", formData.Mano_de_obra_instalaciones?.UNIDADES, formData.Mano_de_obra_instalaciones?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Mano_de_obra_instalaciones?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Mano_de_obra_instalaciones?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Costo de seguridad (agencias transportes internos)", formData.Costo_de_seguridad_agencias_transportes_internos?.UNIDADES, formData.Costo_de_seguridad_agencias_transportes_internos?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Costo_de_seguridad_agencias_transportes_internos?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Costo_de_seguridad_agencias_transportes_internos?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Comision del banco intermediario", formData.Comision_del_banco_intermediario?.UNIDADES, formData.Comision_del_banco_intermediario?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Comision_del_banco_intermediario?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Comision_del_banco_intermediario?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Señalizacion Luminosas de Pisos", formData.Señalizacion_Luminosas_de_Pisos?.UNIDADES, formData.Señalizacion_Luminosas_de_Pisos?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Señalizacion_Luminosas_de_Pisos?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Señalizacion_Luminosas_de_Pisos?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Amortiguador", formData.Amortiguador?.UNIDADES, formData.Amortiguador?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Amortiguador?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Amortiguador?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    ["Encoder", formData.Encoder?.UNIDADES, formData.Encoder?.VOLUMEN_TOTAL_M3?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Encoder?.PRECIO_UNITARIO?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), formData.Encoder?.COSTO_FINAL?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
  ];
  
  

  const metodosDePago = formData.MetodoDePago ? formData.MetodoDePago.split('_') : [];

  // Función para agregar un check si el método de pago está presente
  const getCheckOrEmpty = (metodo) => metodosDePago.includes(metodo) ? "X" : "";

  const tableData = [
    ["ITEM", "DESCRIPCIÓN", "CANT.", "VEL.", "CAP.", "PARADAS", "UNITARIO $us", "TOTAL $us"],
    ...rowsFromFormData.map((row, index) => [
      index + 1,
      row[0] || "0",
      row[1] || "0",
      formData?.Velocidad?.nombre || "0",
      formData["03_PERSONAS"] || "0",
      formData["01_PARADAS"] || "0",
      row[3] || "0",
      (row[4] !== undefined ? parseFloat(row[4]).toFixed(2) : "0")
    ]),
    [{ content: "Valor Total del Equipo Instalado y Funcionando", colSpan: 7, styles: { halign: 'center', fontStyle: 'bold' } }, valorFormateado || " "],
    [{ content: "TIPO DE PAGO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }, ""],
    [
      { content: "Efectivo", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, getCheckOrEmpty("Efectivo"),
      { content: "Depósito", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, getCheckOrEmpty("Deposito"),
      { content: "Dólar", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, getCheckOrEmpty("Dolar"),
      { content: "Bolivianos", colSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }, getCheckOrEmpty("Bolivianos"),
    ]
  ];

  doc.autoTable({
    startY: startY,
    head: [[{ content: "PRECIO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }]],
    body: tableData,
    theme: 'grid',
  });

  // Añadir texto adicional "Opcionales Incluidos"
  let currentYPosition = doc.lastAutoTable.finalY + 10;
  const opcionales = [
    { nombre: "Aire acondicionado", key: "Aire_acondicionado" },
    { nombre: "Indicador de solo boton", key: "Indicador_de_solo_boton" },
    { nombre: "Pesacarga", key: "Pesacarga" },
    { nombre: "Pre Apertura de puertas", key: "Pre_Apertura_de_puertas" },
    { nombre: "Regenerador de energia", key: "Regenerador_de_energia" },
    { nombre: "Sistema de monitoreo", key: "Sistema_de_monitoreo" },
    { nombre: "Ventilación", key: "Ventiladores" },
  ];

  const opcionalesIncluidos = opcionales.filter(item => formData[item.key]?.valor !== 0 && formData[item.key]?.valor !== undefined);

  currentYPosition = checkAddPage(doc, currentYPosition);
  doc.setFontSize(12).setFont("Helvetica", "bold").text("Opcionales Incluidos:", 20, currentYPosition);
  currentYPosition += 10;

  if (opcionalesIncluidos.length > 0) {
    opcionalesIncluidos.forEach(opcional => {
      doc.setFontSize(12).setFont("Helvetica", "normal").text(`* ${opcional.nombre}`, 20, currentYPosition);
      currentYPosition += 10;
    });
    currentYPosition += opcionalesIncluidos.length * 5;
  } else {
    doc.setFontSize(12).setFont("Helvetica", "normal").text("No se agregó ningún opcional", 20, currentYPosition);
    currentYPosition += 20;
  }

  // Definir los datos de la tabla "FORMA DE PAGO"
  const cuota1 = (parseFloat(values["VAR7"]) * 0.3).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cuota2 = (parseFloat(values["VAR7"]) * 0.4).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cuota3 = (parseFloat(values["VAR7"]) * 0.2).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cuota4 = (parseFloat(values["VAR7"]) * 0.05).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cuota5 = (parseFloat(values["VAR7"]) * 0.05).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const total = valorFormateado;

  const paymentPlanData = [
    [
      { content: "CUOTA", styles: { halign: 'center', fontStyle: 'bold', cellWidth: 20 } },
      { content: "%", styles: { halign: 'center', fontStyle: 'bold', cellWidth: 20 } },
      { content: "DESCRIPCIÓN", colSpan: 5, styles: { halign: 'center', fontStyle: 'bold', cellWidth: 40 } },
      { content: "Monto $us", styles: { halign: 'center', fontStyle: 'bold', cellWidth: 30 } }
    ],
    ["1", "30%", { content: "A ser pagado a firma de contrato", colSpan: 5 }, cuota1],
    ["2", "40%", { content: "A ser pagado a 60 días de firma de contrato", colSpan: 5 }, cuota2],
    ["3", "20%", { content: "A ser pagado antes de inicio de montaje del ascensor o con equipos en obra", colSpan: 5 }, cuota3],
    ["4", "5%", { content: "A ser pagado concluida la instalación mecánica de las puertas", colSpan: 5 }, cuota4],
    ["5", "5%", { content: "A ser pagado contra entrega en funcionamiento del ascensor", colSpan: 5 }, cuota5],
    [{ content: "TOTAL", colSpan: 7, styles: { fontStyle: 'bold' } }, { content: total, styles: { fontStyle: 'bold' } }]
  ];
  // Añadir la tabla "FORMA DE PAGO"
currentYPosition = doc.lastAutoTable.finalY + 60;
currentYPosition = checkAddPage(doc, currentYPosition); // Verificar si se necesita nueva página

  doc.autoTable({
    startY: currentYPosition,
    head: [[{ content: "FORMA DE PAGO", colSpan: 8, styles: { halign: 'center', fontStyle: 'bold' } }]],
    body: paymentPlanData,
    theme: 'grid',
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 20 },
      2:      { cellWidth: 40 },  // DESCRIPCIÓN
      3: { cellWidth: 30 }   // Monto $us
    }
  });

  // Añadir más textos después de la tabla con separación entre ellos y verificando espacio
  currentYPosition = doc.lastAutoTable.finalY + 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 20); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("TIEMPO DE ENTREGA:", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("El equipo se entregará funcionando en seis (6) meses a partir de la firma de contrato y recepción del anticipo establecido en el mismo.", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 20); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GARANTÍA DE EQUIPO O FABRICACIÓN", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Los equipos están cubiertos con una garantía de cinco (5) años contra defectos de fabricación...", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 20); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("GARANTÍA DE INSTALACIÓN Y MONTAJE", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Jalmeco Ltda., responsable de la instalación y montaje...", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  currentYPosition += 20;
  currentYPosition = checkAddPage(doc, currentYPosition, 20); // Verificar si se necesita nueva página
  doc.setFontSize(12).setFont("Helvetica", "bold").text("OBLIGACIONES DEL COMPRADOR", 20, currentYPosition);
  currentYPosition += 10;
  doc.setFontSize(12).setFont("Helvetica", "normal").text("Todas las obras civiles adecuadas para la instalación de los ascensores...", 20, currentYPosition, { maxWidth: 170, align: "justify" });

  // Devolver la última posición Y actualizada para que `Final` comience justo después
  return currentYPosition + 80;
};

export default TableComponent;

