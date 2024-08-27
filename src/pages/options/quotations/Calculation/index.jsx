import React, { useEffect, useState } from 'react';
import calculateValues from './calculateValues';
import RenderCalculatedValuesTable from './RenderCalculatedValuesTable';
import RenderFormDataFieldsTable from './RenderFormDataFieldsTable';
import RenderComplexFieldsTable from './RenderComplexFieldsTable';
import areStringsSimilar from './areStringsSimilar';

const Calculation = ({ formData, allData, setFormData }) => {
  const [previousFormData, setPreviousFormData] = useState(null);

  useEffect(() => {
    if (allData && allData.price_table && allData.price_table["price table"]) {
      const priceTableItems = allData.price_table["price table"].items;
      const formDataKeys = Object.keys(formData);

      const updatedFormData = { ...formData }; // Hacemos una copia del formData

      priceTableItems.forEach(item => {
        const key = formDataKeys.find(key => areStringsSimilar(key, item.name));
        if (key) {
          updatedFormData[key] = {
            ...updatedFormData[key],
            VOLUMEN_EN_M3_X_PIEZA: item.volumen_x_pieza_m3,
            PRECIO_UNITARIO: item.precio_unitario,
          };
        }
      });

      if (JSON.stringify(updatedFormData) !== JSON.stringify(previousFormData)) {
        setFormData(updatedFormData); // Solo actualiza si hay cambios
        setPreviousFormData(updatedFormData); // Guarda el formData actualizado para futuras comparaciones
      }
    }
  }, [allData, formData, previousFormData, setFormData]);

  const calculatedValues = calculateValues(formData);
  const specificFields = [
    '02_CLIENTE', '03_PERSONAS', '01_PARADAS', '03_RECORRIDO',
    '06_Foso', '04_Frente', '05_ProfundidadR', '07_Huida',
    '08_Número de ascensores', '09_PISOS A ANTENDER'
  ];

  return (
    <div>
      <h2 className="text-xl font-bold">Valores Calculados</h2>
      <RenderCalculatedValuesTable calculatedValues={calculatedValues} />

      <h2 className="text-xl font-bold">Campos Específicos de FormData</h2>
      <RenderFormDataFieldsTable formData={formData} fields={specificFields} />

      <h2 className="text-xl font-bold">Campos Complejos</h2>
      <RenderComplexFieldsTable formData={formData} />
    </div>
  );
};

export default Calculation;
