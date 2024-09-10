import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { FaTimes } from 'react-icons/fa'; 
import PDFContent from '../quotations/PDFGenerator/PDFContent'; 
import CustomModal from '../../../components/UI/CustomModal'; // Asegúrate de importar el modal personalizado
import Modal from '../quotations/Calculation/Modal';

// Función para formatear la fecha a partir del ID del documento
const formatDateFromDocId = (docId) => {
  const parts = docId.split('_');
  
  if (parts.length < 4) return 'N/A';
  
  const year = parts[1];
  const month = parts[2];
  const day = parts[3].split('T')[0];
  
  const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
  const formattedMonth = monthNames[parseInt(month, 10) - 1];
  const formattedDate = `${day}/${formattedMonth}/${year.slice(-2)}`;

  return formattedDate;
};

const QuotationsModal = ({ clientId, onClose }) => {
  const [quotations, setQuotations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedPDFOption, setSelectedPDFOption] = useState(null);

  const loadClientPhone = useCallback(async (clientName) => {
    try {
      const clientQuery = query(collection(db, 'clients'), where('name', '==', clientName));
      const clientSnapshot = await getDocs(clientQuery);

      if (!clientSnapshot.empty) {
        const clientData = clientSnapshot.docs[0].data();
        return clientData.phone || 'N/A';
      }
    } catch (error) {
      console.error('Error al obtener el teléfono del cliente: ', error);
    }
    return 'N/A';
  }, []);

  const loadQuotations = useCallback(async () => {
    try {
      const quotationsSnapshot = await getDocs(collection(db, 'list of quotations'));

      const quotationsList = await Promise.all(quotationsSnapshot.docs
        .filter(doc => doc.id.startsWith(clientId))
        .map(async (doc, index) => {
          const data = doc.data();
          const clientName = data.quotationDetails?.['02_CLIENTE'] || 'N/A';
          const clientPhone = await loadClientPhone(clientName);

          const total = data.calculatedValues?.valor8
            ? data.calculatedValues.valor8.toFixed(2)
            : 'N/A';
          const date = formatDateFromDocId(doc.id);

          return {
            id: doc.id,
            data: data,
            index: index + 1,
            clientName: clientName,
            clientPhone: clientPhone,
            city: data.quotationDetails?.['Ciudad'].nombre || 'N/A',
            address: data.quotationDetails["Ubicacion_nombre"] || 'N/A',
            quotedBy: data.quotationDetails?.['Solicitante'] || 'Default Quoter',
            total: total,
            date: date,
            quotationDetails: data.quotationDetails,
            calculatedValues: data.calculatedValues,
          };
        })
      );

      setQuotations(quotationsList);
    } catch (error) {
      console.error('Error al cargar las cotizaciones: ', error);
    }
  }, [clientId, loadClientPhone]);

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  const handleViewPDF = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  const handlePDFOption = (quotationData, option) => {
    console.log(quotationData)
    setSelectedPDFOption({ data: quotationData, option });
    setShowModal(false);
    setShowPDFModal(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Lista de Cotizaciones para {clientId}</h2>
        <div className="overflow-auto">
        <table className="min-w-full bg-white border mt-4">
          <thead>
            <tr className='text-black font-bold'>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Tel. Cliente</th>
              <th className="border px-4 py-2">Ciudad</th>
              <th className="border px-4 py-2">Ubicación</th>
              <th className="border px-4 py-2">Cotizado por</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quotation) => (
              <tr key={quotation.id} className='text-black'>
                <td className="border px-4 py-2">{quotation.index}</td>
                <td className="border px-4 py-2">{quotation.clientName}</td>
                <td className="border px-4 py-2">{quotation.clientPhone}</td>
                <td className="border px-4 py-2">{quotation.city}</td>
                <td className="py-2 px-4 text-black">{quotation.address}</td>
                <td className="border px-4 py-2">{quotation.quotedBy}</td>
                <td className="border px-4 py-2">{quotation.total}</td>
                <td className="border px-4 py-2">{quotation.date}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => handleViewPDF(quotation)}
                  >
                    Ver PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {showModal && (
          <CustomModal show={showModal} onClose={() => setShowModal(false)}>
            <div className="flex flex-col items-center mx-auto">
              <h2 className="text-xl font-bold mb-4">Selecciona una opción de PDF</h2>

              <button
                className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700 transition w-[140px]"
                onClick={() => handlePDFOption(selectedQuotation.data, 'sin_membretado')}
              >
                Ver PDF
              </button>

              <button
                className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700 transition w-[140px]"
                onClick={() => handlePDFOption(selectedQuotation.data, 'con_membretado_Jalmeco')}
              >
                Ver PDF Jalmeco
              </button>

              <button
                className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700 transition w-[140px]"
                onClick={() => handlePDFOption(selectedQuotation.data, 'con_membretado_Tecnolift')}
              >
                Ver PDF Tecnolift
              </button>

              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition w-[140px]"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </CustomModal>
        )}

        {showPDFModal && (
          <Modal show={showPDFModal} onClose={() => setShowPDFModal(false)}>
            <PDFContent
              formData={selectedPDFOption.data.quotationDetails}
              values={selectedPDFOption.data.calculatedValues}
              timestamp={selectedPDFOption.data.timestamp}
              type={selectedPDFOption.option}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default QuotationsModal;
