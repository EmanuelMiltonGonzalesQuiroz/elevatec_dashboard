import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import Modal from '../quotations/Calculation/Modal'; // Asegúrate de importar el componente Modal
import PDFContent from '../quotations/PDFGenerator/PDFContent'; // Asegúrate de importar el componente PDFContent

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

  const loadQuotations = useCallback(async () => {
    try {
      const quotationsSnapshot = await getDocs(collection(db, 'list of quotations'));

      const quotationsList = quotationsSnapshot.docs
        .filter(doc => doc.id.startsWith(clientId))  // Filtra los documentos que comiencen con el ID del cliente
        .map((doc, index) => {
          const data = doc.data();
          const total = data.calculatedValues?.valor8
            ? data.calculatedValues.valor8.toFixed(2)
            : 'N/A';
          const date = formatDateFromDocId(doc.id);

          return {
            id: doc.id,
            index: index + 1,
            clientName: data.quotationDetails?.['02_CLIENTE'] || 'N/A',
            clientPhone: data.quotationDetails?.['02_TELÉFONO'] || 'N/A',
            city: data.quotationDetails?.['02_CIUDAD'] || 'N/A',
            quotedBy: 'Default Quoter', // Ajusta según sea necesario
            total: total,
            date: date,
            quotationDetails: data.quotationDetails,
            calculatedValues: data.calculatedValues,
          };
        });

      setQuotations(quotationsList);
    } catch (error) {
      console.error('Error al cargar las cotizaciones: ', error);
    }
  }, [clientId]);

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  const handleViewPDF = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Lista de Cotizaciones para {clientId}</h2>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition absolute top-2 right-2"
        >
          Cerrar
        </button>
        <table className="min-w-full bg-white border mt-4">
          <thead>
            <tr className='text-black font-bold'>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Tel. Cliente</th>
              <th className="border px-4 py-2">Ciudad</th>
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

        {showModal && (
          <Modal show={showModal} onClose={() => setShowModal(false)}>
            <PDFContent formData={selectedQuotation.quotationDetails} values={selectedQuotation.calculatedValues} />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default QuotationsModal;
