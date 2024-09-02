import React, { useState, useEffect } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { homeText } from '../../../components/common/Text/texts';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Modal from './Calculation/Modal'; // Asegúrate de importar Modal
import PDFContent from './PDFGenerator/PDFContent'; // Asegúrate de importar PDFContent

const QuotationList = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  useEffect(() => {
    const fetchQuotations = async () => {
      const db = getFirestore();
      const quotationsCol = collection(db, 'list of quotations');
      const quotationSnapshot = await getDocs(quotationsCol);

      const quotationList = await Promise.all(
        quotationSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const quotationDetails = data.quotationDetails || {};
          const clientName = quotationDetails['02_CLIENTE'];

          if (!clientName) {
            return null; // Saltar cotizaciones que no tienen cliente
          }

          // Buscar los detalles del cliente en la colección 'clients'
          const clientQuery = collection(db, 'clients');
          const clientSnapshot = await getDocs(clientQuery);
          const clientDoc = clientSnapshot.docs.find(
            (clientDoc) => clientDoc.data().name === clientName
          );

          let clientData = {};
          if (clientDoc) {
            clientData = clientDoc.data();
          }

          return {
            id: doc.id,
            ...data,
            clientName: clientName,
            clientPhone: clientData.phone || 'N/A',
            city: clientData.address || 'N/A',
            quotedBy: 'Default Quoter', // Aquí puedes reemplazar con la información correcta
            total: data.calculatedValues?.total || 'N/A',
            date: quotationDetails?.date || 'N/A',
          };
        })
      );

      setQuotations(quotationList.filter(Boolean)); // Filtrar las cotizaciones nulas
    };

    fetchQuotations();
  }, []);

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
  };

  const handleViewPDF = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full text-black">
      <h1 className="text-xl font-bold mb-4">{homeText.listOfQuotations}</h1>
      
      <div className="mb-4">
        <label htmlFor="client" className="mr-2 text-black">{homeText.selectClient}</label>
        <CustomSelect
          collectionName="clients"
          placeholder={homeText.searchClient}
          onChange={handleClientChange}
          selectedValue={selectedClient}
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="date" className="mr-2 text-black">{homeText.selectDate}</label>
        <input type="date" id="date" className="p-2 border rounded" />
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.number}</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.client}</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.clientPhone}</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.city}</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.quotedBy}</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.total}</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.date}</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">{homeText.actions}</th>
          </tr>
        </thead>
        <tbody>
          {quotations.map((quotation, index) => (
            <tr key={quotation.id} className="bg-gray-100">
              <td className="py-2 px-4 text-black">{index + 1}</td>
              <td className="py-2 px-4 text-black">{quotation.clientName}</td>
              <td className="py-2 px-4 text-black">{quotation.clientPhone}</td>
              <td className="py-2 px-4 text-black">{quotation.city}</td>
              <td className="py-2 px-4 text-black">{quotation.quotedBy}</td>
              <td className="py-2 px-4 text-black">{quotation.total}</td>
              <td className="py-2 px-4 text-black">{quotation.date}</td>
              <td className="py-2 px-4">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleViewPDF(quotation)}
                >
                  Generar PDF
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
  );
};

export default QuotationList;
