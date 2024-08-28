// Archivo: Calculation/updateGrupo1.js

const updateGrupo1 = (formData, valor3) => {

  const descriptions = [
    "Estructura_de_cabina",
    "Estructura_de_contrapeso",
    "Estructura_de_foso",
    "SubTecho",
    "Cabina",
    "Hormigones",
    "Estructura_de_motor",
    "Piso",
    "ciudad",
    "Comision_INTERNA_EMPRESA",
    "Mano_de_obra_produccion",
    "Mano_de_obra_instalaciones",
    "Costo_de_seguridad_agencias_transportes_internos",
    "Comision_del_banco_intermediario"
  ];

  descriptions.forEach((description) => {
    const key = Object.keys(formData).find(
      key => key.toLowerCase() === description.toLowerCase()
    );

    if (key && formData[key]) {
      let unidades = formData[key].UNIDADES || 1;
      
      // Asegurarse de que 'Hormigones' tenga 15 unidades
      if (description.toLowerCase() === 'hormigones') {
        unidades = 15;
      }

      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = 0; // No se calcula aduana para este grupo
      const costoFinal = aduana + transporte + ((formData[key].PRECIO_UNITARIO || formData[key].valor || 0) * unidades);

      formData[key].UNIDADES = unidades;
      formData[key].VOLUMEN_TOTAL_M3 = volumenTotalM3;
      formData[key].TRANSPORTE = transporte;
      formData[key].ADUANA = aduana;
      formData[key].COSTO_FINAL = costoFinal;
    }
  });

  return formData;
};

export default updateGrupo1;
