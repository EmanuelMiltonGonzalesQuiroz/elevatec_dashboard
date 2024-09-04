const updateGrupo1 = (formData, valor3, allData) => {
  const getValorPesoPersona = (allData) => {
    const items = allData.basic_config["basic config"].items;
  
    // Buscar el objeto que tiene el name 'Peso persona'
    const pesoPersonaItem = items.find(item => item.name === 'Peso persona');
  
    // Si se encuentra el objeto, retornar su valor, de lo contrario retornar undefined
    return pesoPersonaItem ? pesoPersonaItem.valor : undefined;
  };
  
  // Ejemplo de uso:
  

  const descriptions = [
    "Estructura_de_cabina",
    "Estructura_de_contrapeso",
    "Estructura_de_foso",
    "SubTecho",
    "Cabina",
    "Hormigones",
    "Estructura_de_motor",
    "Piso",
    "Transporte_interno",
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
        const peso_Persona = getValorPesoPersona(allData)
        const potencia = peso_Persona*formData['03_PERSONAS']
        unidades = Math.ceil((potencia * 1.5) / 30);

      }

      let precioUnitario = formData[key].PRECIO_UNITARIO || formData[key].valor || 0;

      // Asegurar que el valor de 'Piso' se utilice como PRECIO_UNITARIO
      let aduana =0;
      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      if (description.toLowerCase() === 'piso') {
        precioUnitario = formData['Piso'].valor || 0;
        aduana = ((unidades * precioUnitario) + transporte) * 0.3;
      }
      


      // Calcular aduana y actualizar precio unitario para Transporte_interno
      if (["Transporte_interno", "Comision_INTERNA_EMPRESA", "Mano_de_obra_produccion", "Mano_de_obra_instalaciones", "Costo_de_seguridad_agencias_transportes_internos", "Comision_del_banco_intermediario"].includes(key)) {
        if (description === 'Transporte_interno') {
          // Obtener el precio unitario de formData['Ciudad'].valor
          precioUnitario = formData['Ciudad'].valor || precioUnitario;

          // Forzar las unidades a 1 para Transporte_interno
          unidades = 1;
          
        }
        
      aduana = ((unidades * precioUnitario) + transporte) * 0.3;
      }

      
      const costoFinal = aduana + transporte + (precioUnitario * unidades);

      formData[key].UNIDADES = unidades;
      formData[key].PRECIO_UNITARIO = precioUnitario;
      formData[key].VOLUMEN_TOTAL_M3 = volumenTotalM3;
      formData[key].TRANSPORTE = transporte;
      formData[key].ADUANA = aduana;
      formData[key].COSTO_FINAL = costoFinal;
    }
  });

  return formData;
};

export default updateGrupo1;
