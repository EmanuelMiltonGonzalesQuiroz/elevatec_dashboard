import React, { useState, useEffect } from 'react';
import { advancedOptionsText } from '../../../components/common/Text/texts';
import InfoButton from '../../../components/common/InfoButton';

const AdvancedOptionsColumn = ({ formData, setFormData, allData }) => {
  const [options, setOptions] = useState({
    elements: [],
    doors: [],
    ARD: [],
    AcabadoPuertaCabina: [],
    EspejoAdicional: [],
    Indicador_de_solo_botón: [],
    LectorTarjetas: [],
    PasamanosAdicional: [],
    Piso: [],
    SubTecho: [],
    Tipo: [],
    TipoBotonera: [],
    BotonesCabina: [],
    BotonesPiso: [],
  });

  useEffect(() => {
    if (allData) {
      const doorsOptions = [];
      if (allData.doors) {
        for (const doorType in allData.doors) {
          if (allData.doors[doorType].items) {
            allData.doors[doorType].items.forEach(item => {
              doorsOptions.push({
                nombre: `${doorType} - ${item.medida}`,
                data: item,
              }); 
            });
          }
        }
      }

      setOptions({
        elements: allData.elements?.elements?.items || [],
        doors: doorsOptions,
        ARD: allData.groups.ARD?.items || [],
        AcabadoPuertaCabina: allData.groups['Acabado Puerta de Cabina']?.items || [],
        EspejoAdicional: allData.groups['Espejo Adicional']?.items || [],
        LectorTarjetas: allData.groups['Lector de Tarjetas']?.items || [],
        PasamanosAdicional: allData.groups['Pasamanos Adicional']?.items || [],
        Piso: allData.groups.Piso?.items || [],
        SubTecho: allData.groups.SubTecho?.items || [],
        Tipo: allData.groups.Tipo?.items || [],
        TipoBotonera: allData.groups['Tipo de Botonera COP']?.items || [],
        BotonesCabina: allData.groups['Tipo de Botones en Cabina']?.items || [],
        BotonesPiso: allData.groups['Tipo de Botones en Piso']?.items || [],
      });
    }
  }, [allData]);

  const handleElementCheckboxChange = (element, checked) => {
    const priceTableItem = allData.price_table["price table"].items.find(
      item => item.name.toLowerCase() === element.name.toLowerCase()
    );

    const updatedFieldData = {
      UNIDADES: checked ? 1 : 0,
      VOLUMEN_TOTAL_M3: priceTableItem ? priceTableItem.volumen_x_pieza_m3 * (checked ? 1 : 0) : 0,
      VOLUMEN_EN_M3_X_PIEZA: priceTableItem ? priceTableItem.volumen_x_pieza_m3 : 0,
      PRECIO_UNITARIO: priceTableItem ? priceTableItem.precio_unitario : 0,
      TRANSPORTE: 0,
      ADUANA: 0,
      COSTO_FINAL: priceTableItem ? priceTableItem.precio_unitario * (checked ? 1 : 0) : 0,
      nombre: element.name,
      valor: checked ? element.value : 0,
    };

    setFormData(prev => ({
      ...prev,
      [element.name.replace(/\s+/g, '_')]: updatedFieldData,
    }));
  };

  const handleSelectChange = (fieldName, className, options, e) => {
    const selectedOptionName = e.target.value;
    const selectedOptionItem = options.find(option => option.nombre === selectedOptionName);

    if (selectedOptionItem) {
      const priceTableItem = allData.price_table["price table"].items.find(
        item => item.name.toLowerCase() === className.toLowerCase()
      );

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

      setFormData(prev => ({
        ...prev,
        [fieldName]: updatedFieldData,
      }));
    }
  };

  const handleLocksChange = (e) => {
    let selectedValue = parseInt(e.target.value, 10);
    
    // Asegurar que el valor ingresado sea un entero positivo o 0
    if (isNaN(selectedValue) || selectedValue < 0) {
      selectedValue = 0; // Si el valor no es válido, lo ponemos en 0
    }
  
    setFormData((prev) => ({
      ...prev,
      Llavines_con_llave: {
        ...prev.Llavines_con_llave,
        UNIDADES: selectedValue,
      },
    }));
  };

  const renderSelectForGroup = (fieldName, label, concept, options, className) => (
    <div key={fieldName} className="mb-4">
      <label htmlFor={fieldName} className="mb-2 font-semibold text-black">
        <InfoButton title={label} concept={concept} />
      </label>
      <select
        id={fieldName}
        className={`p-2 border rounded focus:outline-none w-full mb-4 ${
          !formData[fieldName]?.nombre ? 'bg-red-200' : '' // Se pone rojo si NO hay valor seleccionado
        }`}
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

  const renderCheckboxForElements = () => (
    <div className="mb-4">
      {options.elements.map((element, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={element.name}
            onChange={(e) => handleElementCheckboxChange(element, e.target.checked)}
          />
          <label htmlFor={element.name} className="ml-2">{element.name}</label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="col-span-1 gap-4 overflow-auto ">
      <label className="text-black font-bold">{advancedOptionsText.title}</label>

      {renderCheckboxForElements()}

      {renderSelectForGroup('doors', advancedOptionsText.doors, advancedOptionsText.doorsConcept, options.doors, 'Puertas')}
      {renderSelectForGroup('ARD', advancedOptionsText.ard, advancedOptionsText.ardConcept, options.ARD, 'ARD')}
      {renderSelectForGroup('AcabadoPuertaCabina', advancedOptionsText.cabinFinish, advancedOptionsText.cabinFinishConcept, options.AcabadoPuertaCabina, 'Acabado Puerta de Cabina')}
      {renderSelectForGroup('EspejoAdicional', advancedOptionsText.additionalMirror, advancedOptionsText.additionalMirrorConcept, options.EspejoAdicional, 'Espejo Adicional')}
      {renderSelectForGroup('LectorTarjetas', advancedOptionsText.cardReader, advancedOptionsText.cardReaderConcept, options.LectorTarjetas, 'Lector de Tarjetas')}
      {renderSelectForGroup('PasamanosAdicional', advancedOptionsText.additionalHandrail, advancedOptionsText.additionalHandrailConcept, options.PasamanosAdicional, 'Pasamanos Adicional')}
      {renderSelectForGroup('Piso', advancedOptionsText.floor, advancedOptionsText.floorConcept, options.Piso, 'Piso')}
      {renderSelectForGroup('SubTecho', advancedOptionsText.subCeiling, advancedOptionsText.subCeilingConcept, options.SubTecho, 'SubTecho')}
      {renderSelectForGroup('Tipo', advancedOptionsText.type, advancedOptionsText.typeConcept, options.Tipo, 'Tipo')}
      {renderSelectForGroup('TipoBotonera', advancedOptionsText.controlPanel, advancedOptionsText.controlPanelConcept, options.TipoBotonera, 'Tipo de Botonera COP')}
      {renderSelectForGroup('BotonesCabina', advancedOptionsText.cabinButtons, advancedOptionsText.cabinButtonsConcept, options.BotonesCabina, 'Tipo de Botones en Cabina')}
      {renderSelectForGroup('BotonesPiso', advancedOptionsText.floorButtons, advancedOptionsText.floorButtonsConcept, options.BotonesPiso, 'Tipo de Botones en Piso')}
      
      <div>
        <label htmlFor="locks" className="mb-2 font-semibold text-black">
          <InfoButton
            title={advancedOptionsText.locks}
            concept={advancedOptionsText.locksConcept}
          />
        </label>
        <input
          id="locks"
          type="number"
          min="0" // Asegura que el número sea positivo
          step="1" // Solo permite enteros
          className={`p-2 border rounded focus:outline-none w-full mb-4 `}
          onChange={handleLocksChange}
          value={formData["Llavines_con_llave"]?.UNIDADES || 0} // Muestra el valor actual o 0 si no está definido
        />
      </div>
    </div>
  );
};

export default AdvancedOptionsColumn;
