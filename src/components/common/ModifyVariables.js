const modifyVariables = (variables, allData) => {
  
    // Lista de objetos con la clase, nombre y grupo
    const dataToModify = [
      { nombre: "SEMPLICE", clase: "Cabina", grupo: "Cabina" }
    ];
  
    dataToModify.forEach((item) => {
      const { nombre, clase, grupo } = item;
  
      // Verifica si existe el grupo en allData
      if (allData.groups && allData.groups[grupo]) {
        const groupData = allData.groups[grupo].items;
  
        // Busca el item con el nombre correspondiente dentro de los items del grupo
        const matchedItem = groupData.find((groupItem) => groupItem.nombre === nombre);
  
        if (matchedItem) {
          // Si se encuentra, actualiza las variables basadas en la clase
          if (variables[clase]) {
            variables[clase].nombre = matchedItem.nombre;
            variables[clase].valor = matchedItem.valor;
            console.log(`Actualizado ${clase} con nombre: ${matchedItem.nombre} y valor: ${matchedItem.valor}`);
          } 
        } 
      } 
    });
  
    // Retorna las variables modificadas
    return variables;
  };
  
  export default modifyVariables;
  