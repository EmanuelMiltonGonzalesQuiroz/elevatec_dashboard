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

const Calculation = ({ formData, allData, setFormData }) => {
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

  useEffect(() => {
    try {
      if (allData && allData.price_table && allData.price_table["price table"]) {
        const priceTableItems = allData.price_table["price table"].items;
        const formDataKeys = Object.keys(formData);

        let updatedFormDataCopy = { ...formData };

        // Actualiza los datos basados en la tabla de precios
        priceTableItems.forEach(item => {
          const key = formDataKeys.find(key => areStringsSimilar(key, item.name));
          if (key) {
            updatedFormDataCopy[key] = {
              ...updatedFormDataCopy[key],
              VOLUMEN_EN_M3_X_PIEZA: item.volumen_x_pieza_m3 || 0,
              PRECIO_UNITARIO: item.precio_unitario || 0,
              ...(item.unidades > 0 && { UNIDADES: item.unidades }),  // Solo asigna UNIDADES si es mayor que 0
            };
          }
        });

        const calculatedValues = calculateValues(updatedFormDataCopy, allData);
        const valor4 = calculatedValues.valor4 || 0;

        // Aplica los cálculos para los grupos
        updatedFormDataCopy = updateGrupo1(updatedFormDataCopy, valor4, allData);
        updatedFormDataCopy = updateGrupo2(updatedFormDataCopy, valor4, allData);
        updatedFormDataCopy = updateGrupo3(updatedFormDataCopy, valor4, allData);
        updatedFormDataCopy = updateGrupo4(updatedFormDataCopy, valor4, allData);
        updatedFormDataCopy = updateGrupo5(updatedFormDataCopy, valor4, allData);
        updatedFormDataCopy = updateGrupo6(updatedFormDataCopy, valor4, allData);
        updatedFormDataCopy = updateGrupo7(updatedFormDataCopy, valor4, allData);
        updatedFormDataCopy = updateGrupo8(updatedFormDataCopy, valor4, allData);
        updatedFormDataCopy = updateGrupoCustom(updatedFormDataCopy, valor4, allData);

        // Compara el formData original con el actualizado para detectar cambios
        const updatedFormDataString = JSON.stringify(updatedFormDataCopy);
        if (updatedFormDataString !== previousFormData) {
          setFormData(updatedFormDataCopy);
          setUpdatedFormData(updatedFormDataCopy);
          setPreviousFormData(updatedFormDataString);
        }
      }
      setShowActionModal(true);
    } catch (error) {
      console.error("Error al calcular valores:", error);
    }
  }, [allData, formData, previousFormData, setFormData]);

  const handleConfirm = () => {
    const values = calculateValues(updatedFormData, allData);
    
    setModalContent(
      <SaveClientData 
        formData={updatedFormData} 
        additionalData={values} 
      />
    );
    setShowProcedureModal(true);
    setShowActionModal(false);
  };

  const handleCancel = () => {
    setShowActionModal(false);
  };

  const handleViewPDF = () => {
    const values = calculateValues(updatedFormData, allData);
    setModalContent(<PDFContent formData={updatedFormData} values={values} type="sin_membrete" />);
    setShowProcedureModal(true);
  };

  const handleViewPDFjalmeco = () => {
    const values = calculateValues(updatedFormData, allData);
    setModalContent(<PDFContent formData={updatedFormData} values={values} type="con_membretado_Jalmeco" />);
    setShowProcedureModal(true);
  };
  const handleViewPDFtecnolif = () => {
    const values = calculateValues(updatedFormData, allData);
    setModalContent(<PDFContent formData={updatedFormData} values={values} type="con_membretado_Tecnolift" />);
    setShowProcedureModal(true);
  };
  
  const handleViewProcedure = () => {
    setModalContent(
      <div>
        <h2 className="text-xl font-bold">Valores Calculados</h2>
        <RenderCalculatedValuesTable calculatedValues={calculateValues(updatedFormData, allData)} />

        <h2 className="text-xl font-bold">Campos Específicos de FormData</h2>
        <RenderFormDataFieldsTable formData={updatedFormData} fields={specificFields} />

        <h2 className="text-xl font-bold">Campos Complejos</h2>
        <RenderComplexFieldsTable formData={updatedFormData} />
      </div>
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
        onCancel={handleCancel}
        onViewPDFNoHeader={handleViewPDF}  // Nuevo manejador
        onViewPDFtecnolif={handleViewPDFtecnolif} 
        onViewPDFjalmeco={handleViewPDFjalmeco}  // Nuevo manejador
        onViewProcedure={handleViewProcedure}
      />

      <Modal show={showProcedureModal} onClose={closeProcedureModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Calculation;
