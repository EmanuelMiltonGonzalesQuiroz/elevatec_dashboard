import areStringsSimilar from './areStringsSimilar.js';
import SearchValue from './SearchValue.jsx'; // Asegúrate de importar SearchValue

const updateGrupoCustom = (formData, valor3, allData) => {
  

  const elements = allData.elements?.items || [];

  const findElementValue = (name) => {
    const element = elements.find(el => areStringsSimilar(el.name, name));
    return element ? element.value : 0;
  };
  

  // Función para buscar el gearleesPrecio según la clase de velocidad y el número de personas
  const findGearleesPrecio = (velocidadNombre, personas) => {
    const motorData = allData.motors[velocidadNombre];
    const maquina_de_traccion = formData['MaquinaTraccion']?.nombre || '';
    
    if (!motorData || !Array.isArray(motorData.items)) {
      return 0;
    }
  
    // Encontrar el motor cuyo valor en personas sea mayor o igual al valor ingresado
    const motor = motorData.items.find(item => item.personas >= personas);
  
    if (maquina_de_traccion.toLowerCase().includes("gearlees")) {
      return motor ? motor.gearleesPrecio : 0;
    } else if (maquina_de_traccion.toLowerCase().includes("reductor")) {
      return motor ? motor.conReducPrecio : 0;
    } else {
      return 0;
    }
  };

  // Convertir la velocidad a la clave correspondiente en allData.motors
  const velocidadClave = formData['Velocidad'].nombre.replace('/', '_').toLowerCase();
  const personas = formData['03_PERSONAS'] || 0;

  const findInternalConfigPrice = (configKey, velocidadNombre) => {
    const configData = allData.internal_config[configKey]?.items || [];
    const velocidadNumero = parseFloat(velocidadNombre);

    const configItem = configData.find(item => parseFloat(item["velocidad m/s"]) === velocidadNumero);
    return configItem ? configItem.precio : 0;
  };

  // Descriptions ahora buscarán unidades desde la tabla de precios usando SearchValue
  const descriptions = {
    "Pernos_de_motor": SearchValue(allData.price_table, "Pernos de motor", "unidades"),
    "Corredizas_de_cabina": SearchValue(allData.price_table, "Corredizas de cabina", "unidades"),
    "Corredizas_de_contrapeso": SearchValue(allData.price_table, "Corredizas de contrapeso", "unidades"),
    "Motor": SearchValue(allData.price_table, "Motor", "unidades"),
    "Maniobra": SearchValue(allData.price_table, "Maniobra", "unidades"),
    "Regla": SearchValue(allData.price_table, "Regla", "unidades"),
    "Señalizacion_Luminosas_de_Pisos": SearchValue(allData.price_table, "Señalizacion Luminosas de Pisos", "unidades"),
    "Amortiguador": SearchValue(allData.price_table, "Amortiguador", "unidades"),
    "Encoder": SearchValue(allData.price_table, "Encoder", "unidades"),
  };

  Object.keys(descriptions).forEach(description => {
    const key = Object.keys(formData).find(
      key => areStringsSimilar(key, description)
    );

    if (key && formData[key]) {
      const unidades = descriptions[description] || formData[key].UNIDADES || 0;
      let precioUnitario = findElementValue(description) || formData[key].PRECIO_UNITARIO || 0;

      // Si estamos en la descripción de Motor, usar el gearleesPrecio
      if (description === "Motor") {
        precioUnitario = findGearleesPrecio(velocidadClave, personas);
      }

      // Para Corredizas_de_cabina y Corredizas_de_contrapeso, buscar el precio en internal_config según la velocidad
      if (description === "Corredizas_de_cabina") {
        precioUnitario = findInternalConfigPrice("corredizas de cabina", formData['Velocidad'].nombre.replace('m/s', '').trim());
      } else if (description === "Corredizas_de_contrapeso") {
        precioUnitario = findInternalConfigPrice("corredizas de contrapeso", formData['Velocidad'].nombre.replace('m/s', '').trim());
      }else if (description === "Amortiguador") {
        precioUnitario = findInternalConfigPrice("amortiguador", formData['Velocidad'].nombre.replace('m/s', '').trim());
      }

      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3 *0.5;
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

export default updateGrupoCustom;
