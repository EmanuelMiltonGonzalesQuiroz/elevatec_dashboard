import React, { useState, useEffect } from 'react';

const MainFormColumn2 = ({ formData, setFormData, allData }) => {
  const [options, setOptions] = useState({
    Cabina: [],
    Ciudad: [],
    Embarque: [],
    EnergiaElectrica: [],
    IndicadorCabinaPiso: [],
    IndicadorPisoBoton: [],
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
        IndicadorCabinaPiso: allData.groups['Indicador de cabina_piso']?.items || [],
        IndicadorPisoBoton: allData.groups['Indicador de piso con botón Integrado']?.items || [],
        MaquinaTraccion: allData.groups['Maquina de tracción']?.items || [],
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
  const renderSelectForGroup = (fieldName, label, options, className) => (
    <div key={fieldName}>
      <label htmlFor={fieldName} className="mb-2 font-semibold text-black">
        {label}
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
      {renderSelectForGroup('Cabina', 'Cabina', options.Cabina, 'Cabina')}
      {renderSelectForGroup('Ciudad', 'Ciudad', options.Ciudad, 'Ciudad')}
      {renderSelectForGroup('Embarque', 'Embarque', options.Embarque, 'Embarque')}
      {renderSelectForGroup('EnergiaElectrica', 'Energía Eléctrica', options.EnergiaElectrica, 'Energia Electrica')}
      {renderSelectForGroup('IndicadorCabinaPiso', 'Indicador de cabina/piso', options.IndicadorCabinaPiso, 'Indicador de cabina_piso')}
      {renderSelectForGroup('IndicadorPisoBoton', 'Indicador de piso con botón Integrado', options.IndicadorPisoBoton, 'Indicador de piso con botón Integrado')}
      {renderSelectForGroup('MaquinaTraccion', 'Máquina de tracción', options.MaquinaTraccion, 'Maquina de tracción')}
      {renderSelectForGroup('Traccion', 'Tracción', options.Traccion, 'Traccion')}
      {renderSelectForGroup('Velocidad', 'Velocidad', options.Velocidad.map(speed => ({ nombre: speed })), 'Velocidad')}
    </div>
  );
};

export default MainFormColumn2;
