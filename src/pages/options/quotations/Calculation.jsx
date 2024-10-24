import React, { useEffect, useState } from 'react';
import calculateValues from './Calculation/calculateValues';
import RenderCalculatedValuesTable from './Calculation/RenderCalculatedValuesTable';
import RenderFormDataFieldsTable from './Calculation/RenderFormDataFieldsTable';
import RenderComplexFieldsTable from './Calculation/RenderComplexFieldsTable';
import Modal from './Calculation/Modal';
import ActionModal from './Calculation/ActionModal';
import PDFContent from './PDFGenerator/PDFContent';
import SaveClientData from './Calculation/SaveClientData';
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

const Calculation = ({ formData, allData, setFormData, handleCloseModal }) => {
  const [previousFormData, setPreviousFormData] = useState(JSON.stringify(formData));
  const [showActionModal, setShowActionModal] = useState(true); 
  const [showProcedureModal, setShowProcedureModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [updatedFormData, setUpdatedFormData] = useState(formData);

  const specificFields = [
    '02_CLIENTE', '03_PERSONAS', '01_PARADAS', '03_RECORRIDO',
    '06_Foso', '04_Frente', '05_ProfundidadR', '07_Huida',
    '08_Número de ascensores', '09_PISOS A ANTENDER'
  ];

  // Para actualizar múltiples cotizaciones
  useEffect(() => {
    try {
      if (allData && allData.price_table && allData.price_table["price table"]) {
        const priceTableItems = allData.price_table["price table"].items;

        const updatedFormDataArray = formData.map((quotationData) => {
          let updatedQuotationData = { ...quotationData };

          // Actualiza los datos basados en la tabla de precios
          Object.keys(quotationData).forEach(key => {
            const priceItem = priceTableItems.find(item => areStringsSimilar(key, item.name));
            if (priceItem) {
              updatedQuotationData[key] = {
                ...updatedQuotationData[key],
                VOLUMEN_EN_M3_X_PIEZA: priceItem.volumen_x_pieza_m3 || 0,
                PRECIO_UNITARIO: priceItem.precio_unitario || 0,
                ...(priceItem.unidades > 0 && { UNIDADES: priceItem.unidades }),  // Solo asigna UNIDADES si es mayor que 0
              };
            }
          });

          // Aplicar los cálculos de valores
          const calculatedValues = calculateValues(updatedQuotationData, allData);
          const valor4 = calculatedValues.valor4 || 0;

          // Aplica los cálculos para los grupos
          updatedQuotationData = updateGrupo1(updatedQuotationData, valor4, allData);
          updatedQuotationData = updateGrupo2(updatedQuotationData, valor4, allData);
          updatedQuotationData = updateGrupo3(updatedQuotationData, valor4, allData);
          updatedQuotationData = updateGrupo4(updatedQuotationData, valor4, allData);
          updatedQuotationData = updateGrupo5(updatedQuotationData, valor4, allData);
          updatedQuotationData = updateGrupo6(updatedQuotationData, valor4, allData);
          updatedQuotationData = updateGrupo7(updatedQuotationData, valor4, allData);
          updatedQuotationData = updateGrupo8(updatedQuotationData, valor4, allData);
          updatedQuotationData = updateGrupoCustom(updatedQuotationData, valor4, allData);

          return updatedQuotationData;
        });

        // Comparar el formData original con el actualizado para detectar cambios
        const updatedFormDataString = JSON.stringify(updatedFormDataArray);
        if (updatedFormDataString !== previousFormData) {
          setFormData(updatedFormDataArray);
          setUpdatedFormData(updatedFormDataArray);
          setPreviousFormData(updatedFormDataString);
        }
      }
      setShowActionModal(true);
    } catch (error) {
      console.error("Error al calcular valores:", error);
    }
  }, [allData, formData, previousFormData, setFormData]);

  const handleConfirm = () => {
    const valuesArray = updatedFormData.map((quotationData) => calculateValues(quotationData, allData));

    setModalContent(
      updatedFormData.map((quotationData, index) => (
        <SaveClientData 
          key={index}
          formData={updatedFormData}  // Pasar todo el array de formData para guardar múltiples cotizaciones
          additionalData={valuesArray}  // Pasar todos los valores calculados para múltiples cotizaciones
        />
      ))
    );
    setShowProcedureModal(true);
    setShowActionModal(false);
  };

  const handleViewPDF = () => {
    const valuesArray = updatedFormData.map((quotationData) => calculateValues(quotationData, allData));
    
    setModalContent(
      updatedFormData.map((quotationData, index) => (
        <PDFContent 
          key={index} 
          formData={quotationData} 
          values={valuesArray[index]} 
          type="sin_membrete" 
        />
      ))
    );
    setShowProcedureModal(true);
  };

  const handleViewPDFjalmeco = () => {
    const valuesArray = updatedFormData.map((quotationData) => calculateValues(quotationData, allData));
    
    setModalContent(
      updatedFormData.map((quotationData, index) => (
        <PDFContent 
          key={index} 
          formData={quotationData} 
          values={valuesArray[index]} 
          type="con_membretado_Jalmeco" 
        />
      ))
    );
    setShowProcedureModal(true);
  };

  const handleViewPDFtecnolif = () => {
    const valuesArray = updatedFormData.map((quotationData) => calculateValues(quotationData, allData));
    
    setModalContent(
      updatedFormData.map((quotationData, index) => (
        <PDFContent 
          key={index} 
          formData={quotationData} 
          values={valuesArray[index]} 
          type="con_membretado_Tecnolift" 
        />
      ))
    );
    setShowProcedureModal(true);
  };

  const handleViewProcedure = () => {
    setModalContent(
      updatedFormData.map((quotationData, index) => (
        <div key={index}>
          <h2 className="text-xl font-bold">Cotización {index + 1} - Valores Calculados</h2>
          <RenderCalculatedValuesTable calculatedValues={calculateValues(quotationData, allData)} />

          <h2 className="text-xl font-bold">Campos Específicos de FormData</h2>
          <RenderFormDataFieldsTable formData={quotationData} fields={specificFields} />

          <h2 className="text-xl font-bold">Campos Complejos</h2>
          <RenderComplexFieldsTable formData={quotationData} />
        </div>
      ))
    );
    setShowProcedureModal(true);
  };

  const closeProcedureModal = () => { 
    setShowProcedureModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ActionModal
        show={showActionModal}
        onClose={() => setShowActionModal(false)}
        onConfirm={handleConfirm}
        onViewPDFNoHeader={handleViewPDF}  
        onViewPDFtecnolif={handleViewPDFtecnolif} 
        onViewPDFjalmeco={handleViewPDFjalmeco}  
        onViewProcedure={handleViewProcedure}
        handleCloseModal={handleCloseModal}
      />

      <Modal show={showProcedureModal} onClose={closeProcedureModal}>
        {modalContent}
      </Modal>
    </div> 
  );
};

export default Calculation;
