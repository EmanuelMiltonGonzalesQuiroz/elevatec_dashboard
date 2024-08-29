import React, { useEffect, useState } from 'react';
import calculateValues from './Calculation/calculateValues';
import RenderCalculatedValuesTable from './Calculation/RenderCalculatedValuesTable';
import RenderFormDataFieldsTable from './Calculation/RenderFormDataFieldsTable';
import RenderComplexFieldsTable from './Calculation/RenderComplexFieldsTable';
import areStringsSimilar from './Calculation/areStringsSimilar';
import updateGrupo1 from './Calculation/updateGrupo1';
import updateGrupo2 from './Calculation/updateGrupo2';
import updateGrupo3 from './Calculation/updateGrupo3';
import updateGrupo4 from './Calculation/updateGrupo4';
import updateGrupo5 from './Calculation/updateGrupo5';
import updateGrupo6 from './Calculation/updateGrupo6';
import updateGrupo7 from './Calculation/updateGrupo7';
import updateGrupo8 from './Calculation/updateGrupo8';
import updateGrupoCustom from './Calculation/updateGrupoCustom';

const Calculation = ({ formData, allData, setFormData }) => {
  const [previousFormData, setPreviousFormData] = useState(JSON.stringify(formData));

  useEffect(() => {
    try {
      if (allData && allData.price_table && allData.price_table["price table"]) {
        const priceTableItems = allData.price_table["price table"].items;
        const formDataKeys = Object.keys(formData);

        let updatedFormData = { ...formData }; // Hacemos una copia del formData

        // Actualiza los datos basados en la tabla de precios
        priceTableItems.forEach(item => {
          const key = formDataKeys.find(key => areStringsSimilar(key, item.name));
          if (key) {
            updatedFormData[key] = {
              ...updatedFormData[key],
              VOLUMEN_EN_M3_X_PIEZA: item.volumen_x_pieza_m3 || 0,
              PRECIO_UNITARIO: item.precio_unitario || 0,
            };
          }
        });

        const calculatedValues = calculateValues(updatedFormData);
        const valor3 = calculatedValues.valor3 || 0;

        // Aplica los cálculos para los grupos
        updatedFormData = updateGrupo1(updatedFormData, valor3);
        updatedFormData = updateGrupo2(updatedFormData, valor3);
        updatedFormData = updateGrupo3(updatedFormData, valor3);
        updatedFormData = updateGrupo4(updatedFormData, valor3, allData);
        updatedFormData = updateGrupo5(updatedFormData, valor3, allData);
        updatedFormData = updateGrupo6(updatedFormData, valor3);
        updatedFormData = updateGrupo7(updatedFormData, valor3, allData);
        updatedFormData = updateGrupo8(updatedFormData, valor3, allData);
        updatedFormData = updateGrupoCustom(updatedFormData, valor3, allData);

        // Compara el formData original con el actualizado para detectar cambios
        const updatedFormDataString = JSON.stringify(updatedFormData);
        if (updatedFormDataString !== previousFormData) {
          setFormData(updatedFormData);
          setPreviousFormData(updatedFormDataString); // Guarda el formData actualizado para futuras comparaciones
        }
      }
    } catch (error) {
      console.error("Error al calcular valores:", error);
    }
  }, [allData, formData, previousFormData, setFormData]); // Eliminamos previousFormData como dependencia

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
