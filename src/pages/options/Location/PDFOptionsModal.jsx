import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import CustomModal from '../../../components/UI/CustomModal';
import PDFContentM from '../Maintenance/MaintenanceList/PDFGenerator/PDFContent';  // PDF para mantenimiento
import PDFContentQ from '../quotations/PDFGenerator/PDFContent';  // PDF para cotizaciones
import Modal from '../quotations/Calculation/Modal';


const PDFOptionsModal = ({ show, onClose, documentId }) => {
    const [documentType, setDocumentType] = useState(null);  // Determina el tipo de documento
    const [isLoading, setIsLoading] = useState(true);
    const [documentData, setDocumentData] = useState(null); // Datos del documento seleccionado
    const [selectedPDFOption, setSelectedPDFOption] = useState(null); // Se asegura de que selectedPDFOption esté definido
    const [showPDFModal, setShowPDFModal] = useState(false); // Estado para mostrar el modal del PDF

    useEffect(() => {
        const fetchDocumentData = async () => {
            try {
                setIsLoading(true);

                const maintenanceDocRef = doc(db, 'list of maintenance', documentId);
                const quotationsDocRef = doc(db, 'list of quotations', documentId);

                const [maintenanceSnapshot, quotationsSnapshot] = await Promise.all([ 
                    getDoc(maintenanceDocRef), 
                    getDoc(quotationsDocRef), 
                ]);

                if (maintenanceSnapshot.exists()) {
                    setDocumentType('maintenance');
                    setDocumentData(maintenanceSnapshot.data());
                } else if (quotationsSnapshot.exists()) {
                    setDocumentType('quotation');
                    setDocumentData(quotationsSnapshot.data());
                } else {
                    console.warn('Documento no encontrado en ninguna colección.');
                    setDocumentType(null);
                }
            } catch (error) {
                console.error('Error al obtener datos del documento:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (documentId) fetchDocumentData();
    }, [documentId]);

    // Maneja la opción seleccionada y muestra el PDF correspondiente
    const handlePDFOption = (option) => {
        setSelectedPDFOption({ option });  // Definir el estado de selectedPDFOption
        setShowPDFModal(true);  // Mostrar el modal con el PDF
    };

    if (isLoading) {
        return <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>;
    }

    return (
        <CustomModal show={show} onClose={onClose}>
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4 text-center">Selecciona una opción de PDF</h2>
                {documentType ? (
                    <div className="grid grid-cols-2 gap-4">
                        {/* 5 opciones de PDF siempre disponibles */}
                        <button
                            className="col-span-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full text-center"
                            onClick={() => handlePDFOption('sin_membretado')}
                        >
                            Ver PDF
                        </button>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full text-center"
                            onClick={() => handlePDFOption('con_membretado_Jalmeco')}
                        >
                            Ver PDF con membretado Jalmeco
                        </button>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full text-center"
                            onClick={() => handlePDFOption('con_membretado_Tecnolift')}
                        >
                            Ver PDF con membretado Tecnolift
                        </button>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full text-center"
                            onClick={() => handlePDFOption('sin_membretado_Jalmeco')}
                        >
                            Ver PDF Jalmeco sin membretado
                        </button>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full text-center"
                            onClick={() => handlePDFOption('sin_membretado_Tecnolift')}
                        >
                            Ver PDF Tecnolift sin membretado
                        </button>
                    </div>
                ) : (
                    <p className="text-red-500">Documento no encontrado en las colecciones especificadas.</p>
                )}
                <button
                    className="bg-gray-500 text-white py-2 px-4 mt-4 rounded hover:bg-gray-700 transition w-[140px] text-center"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>

            {/* Modal para mostrar el PDF según el tipo */}
            {showPDFModal && (
                <Modal show={showPDFModal} onClose={() => setShowPDFModal(false)}>
                    {documentType === 'maintenance' ? (
                        <PDFContentM
                            recipe={documentData}
                            type={selectedPDFOption?.option || ''}
                        />
                    ) : (
                        <PDFContentQ
                            formData={documentData?.quotationDetails}
                            values={documentData?.calculatedValues}
                            timestamp={documentData?.timestamp}
                            type={selectedPDFOption?.option || ''}
                        />
                    )}
                </Modal>
            )}
        </CustomModal>
    );
};

export default PDFOptionsModal;
