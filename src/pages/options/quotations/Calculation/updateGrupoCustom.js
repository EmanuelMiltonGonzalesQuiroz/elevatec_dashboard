
import areStringsSimilar from './areStringsSimilar.js';
const updateGrupoCustom = (formData, valor3, allData) => {
  const elements = allData.elements?.items || [];

  const findElementValue = (name) => {
    const element = elements.find(el => areStringsSimilar(el.name, name));
    return element ? element.value : 0;
  };

  // Función para buscar el gearleesPrecio según la clase de velocidad y el número de personas
  const findGearleesPrecio = (velocidadNombre, personas) => {
    const motorData = allData.motors[velocidadNombre];
    if (!motorData || !Array.isArray(motorData.items)) {
      console.error("No se encontraron items para la velocidad especificada en motors.");
      return 0; // Retornar 0 si no se encuentran datos
    }

    const motor = motorData.items.find(item => {
      const personasNumeros = [item.personas, item.personas]; // Cambiado para manejar `personas` como número

      return (
        personas >= personasNumeros[0] && personas <= personasNumeros[1]
      );
    });

    return motor ? motor.gearleesPrecio : 0;
  };

  // Convertir la velocidad a la clave correspondiente en allData.motors
  const velocidadClave = formData['Velocidad'].nombre.replace('/', '_').toLowerCase();
  const personas = formData['03_PERSONAS'] || 0;

  const descriptions = {
    "Pernos_de_motor": 4,
    "Corredizas_de_cabina": 4,
    "Corredizas_de_contrapeso": 4,
    "Motor": 1,
    "Maniobra": 1,
    "Regla": 1
  };

  Object.keys(descriptions).forEach(description => {
    const key = Object.keys(formData).find(
      key => areStringsSimilar(key, description)
    );

    if (key && formData[key]) {
      const unidades = descriptions[description];
      let precioUnitario = findElementValue(description) || formData[key].PRECIO_UNITARIO || 0;

      // Si estamos en la descripción de Motor, usar el gearleesPrecio
      if (description === "Motor") {
        precioUnitario = findGearleesPrecio(velocidadClave, personas);
      }

      const volumenTotalM3 = unidades * (formData[key].VOLUMEN_EN_M3_X_PIEZA || 0);
      const transporte = (valor3 || 0) * volumenTotalM3;
      const aduana = ((unidades * precioUnitario) + transporte) * 0.3;
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
