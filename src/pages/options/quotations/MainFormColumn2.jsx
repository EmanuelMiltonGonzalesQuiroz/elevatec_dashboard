import React, { useState, useEffect } from 'react';
import { mainFormColumn2Text } from '../../../components/common/Text/texts';
import InfoButton from '../../../components/common/InfoButton';

const MainFormColumn2 = ({ formData, setFormData, allData }) => {
  const [options, setOptions] = useState({
    Cabina: [],
    Ciudad: [],
    Embarque: [],
    EnergiaElectrica: [],
    IndicadorCabina: [],
    IndicadorPiso: [],
    MaquinaTraccion: [],
    Traccion: [],
    Velocidad: []
  });

  // Cargar opciones desde allData cuando esté disponible
  useEffect(() => {
    if (allData && allData.groups) {
      setOptions({
        Cabina: allData.groups.Cabina?.items || [],
        Ciudad: allData.groups.Ciudad?.items || [],
        Embarque: allData.groups.Embarque?.items || [],
        EnergiaElectrica: allData.groups['Energia Electrica']?.items || [],
        IndicadorCabina: allData.groups['Indicador de Cabina']?.items || [],
        IndicadorPiso: allData.groups['Indicador de Piso']?.items || [],
        MaquinaTraccion: allData.groups['Maquina de Tracción']?.items || [],
        Traccion: allData.groups.Traccion?.items || [],
        Velocidad: allData.motors ? Object.keys(allData.motors).map(speed => speed.replace('_', '/')) : []
      });
    }
  }, [allData]);

  // Función genérica para manejar los cambios en los selects de cualquier campo de groups
  const handleSelectChange = (fieldName, className, options, e) => {
    const selectedOptionName = e.target.value;
    const selectedOptionItem = options.find(option => option.nombre === selectedOptionName);

    if (selectedOptionItem) {
      // Buscar el ítem en la tabla de precios, comparando en minúsculas para asegurar coincidencia
      const priceTableItem = allData.price_table["price table"].items.find(
        item => item.name.toLowerCase() === className.toLowerCase()
      );

      // Si no existe el ítem en la tabla de precios, manejarlo adecuadamente
      const updatedFieldData = {
        UNIDADES: 1,
        VOLUMEN_TOTAL_M3: priceTableItem ? priceTableItem.volumen_x_pieza_m3 * 1 : 0,
        VOLUMEN_EN_M3_X_PIEZA: priceTableItem ? priceTableItem.volumen_x_pieza_m3 : 0,
        PRECIO_UNITARIO: priceTableItem ? priceTableItem.precio_unitario : 0,
        TRANSPORTE: 0,
        ADUANA: 0,
        COSTO_FINAL: priceTableItem ? priceTableItem.precio_unitario * 1 : 0,
        nombre: selectedOptionName,
        valor: selectedOptionItem.valor,
      };

      // Actualizar el formData
      setFormData(prev => ({
        ...prev,
        [fieldName]: updatedFieldData,
      }));
    }
  };

  // Función para renderizar un select para cualquier grupo
  const renderSelectForGroup = (fieldName, label, options, className, concept) => (
    <div key={fieldName}>
      <label htmlFor={fieldName} className="mb-2 font-semibold text-black">
        <InfoButton title={label} concept={concept} />
      </label>
      <select
        id={fieldName}
        className="p-2 border rounded focus:outline-none w-full mb-4"
        value={formData[fieldName]?.nombre || ''}
        onChange={(e) => handleSelectChange(fieldName, className, options, e)}
      >
        <option value="">Seleccione una opción</option>
        {options.map((option, index) => (
          <option key={index} value={option.nombre}>
            {option.nombre}
          </option>
        ))} 
      </select>
    </div>
  );

  return (
    <div className="col-span-1 gap-4 overflow-y-auto max-h-full">
      {renderSelectForGroup('Cabina', mainFormColumn2Text.cabin, options.Cabina, 'Cabina', mainFormColumn2Text.cabinConcept)}
      {renderSelectForGroup('Ciudad', mainFormColumn2Text.city, options.Ciudad, 'Ciudad', mainFormColumn2Text.cityConcept)}
      {renderSelectForGroup('Embarque', mainFormColumn2Text.embark, options.Embarque, 'Embarque', mainFormColumn2Text.embarkConcept)}
      {renderSelectForGroup('EnergiaElectrica', mainFormColumn2Text.electricity, options.EnergiaElectrica, 'Energia Electrica', mainFormColumn2Text.electricityConcept)}
      {renderSelectForGroup('Indicador_de_Cabina', mainFormColumn2Text.cabinIndicator, options.IndicadorCabina, 'Indicador de Cabina', mainFormColumn2Text.cabinIndicatorConcept)}
      {renderSelectForGroup('Indicador_de_piso', mainFormColumn2Text.floorIndicator, options.IndicadorPiso, 'Indicador de Piso', mainFormColumn2Text.floorIndicatorConcept)}
      {renderSelectForGroup('MaquinaTraccion', mainFormColumn2Text.tractionMachine, options.MaquinaTraccion, 'Maquina de tracción', mainFormColumn2Text.tractionMachineConcept)}
      {renderSelectForGroup('Traccion', mainFormColumn2Text.traction, options.Traccion, 'Traccion', mainFormColumn2Text.tractionConcept)}
      {renderSelectForGroup('Velocidad', mainFormColumn2Text.speed, options.Velocidad.map(speed => ({ nombre: speed })), 'Velocidad', mainFormColumn2Text.speedConcept)}

      <div className="p-4 mt-6 rounded-md" style={{ backgroundColor: '#ADD8E6', color: '#000' }}>
        <h3 className="font-semibold text-lg mb-2">{mainFormColumn2Text.note}</h3>
        <ul className="list-disc pl-6">
          {mainFormColumn2Text.noteDetails.map((detail, index) => (
            <li key={index} className="mb-2">
              {detail}
            </li>
          ))}
        </ul>
      </div>

    </div>
    
  );
};

export default MainFormColumn2;
