import React, { useState, useEffect } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { homeText } from '../../../components/common/Text/texts';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import PDFContent from './PDFGenerator/PDFContent';
import CustomModal from '../../../components/UI/CustomModal';

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

const QuotationList = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedPDFOption, setSelectedPDFOption] = useState(null);

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
            return null;
          }

          const clientQuery = collection(db, 'clients');
          const clientSnapshot = await getDocs(clientQuery);
          const clientDoc = clientSnapshot.docs.find(
            (clientDoc) => clientDoc.data().name === clientName
          );

          let clientData = {};
          if (clientDoc) {
            clientData = clientDoc.data();
          }

          const total = data.calculatedValues?.valor8
            ? data.calculatedValues.valor8.toFixed(2)
            : 'N/A';

          const date = formatDateFromDocId(doc.id);

          return {
            id: doc.id,
            ...data,
            clientName: clientName,
            clientPhone: clientData.phone || 'N/A',
            city: clientData.address || 'N/A',
            quotedBy: 'Default Quoter',
            total: total,
            date: date,
          };
        })
      );

      setQuotations(quotationList.filter(Boolean));
      setFilteredQuotations(quotationList.filter(Boolean));
    };

    fetchQuotations();
  }, []);

  useEffect(() => {
    const filtered = quotations.filter((quotation) => {
      const matchesClient = selectedClient
        ? quotation.clientName === selectedClient.label
        : true;
      const matchesDate = selectedDate
        ? quotation.date === formatDate(selectedDate)
        : true;
      return matchesClient && matchesDate;
    });
    setFilteredQuotations(filtered);
  }, [selectedClient, selectedDate, quotations]);

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleViewPDF = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  const handlePDFOption = (option) => {
    setSelectedPDFOption(option);
    console.log(`Generar PDF opción: ${option}`);
    setShowModal(false); // Cerrar el modal al seleccionar una opción
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.getMonth();
    const year = String(dateObj.getFullYear()).slice(-2);
    const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
    return `${day}/${monthNames[month]}/${year}`;
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg max-h-[75vh] text-black">
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
        <input
          type="date"
          id="date"
          className="p-2 border rounded"
          onChange={handleDateChange}
        />
      </div>
      <div className="overflow-auto">
        <table className="bg-white">
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
          {filteredQuotations.map((quotation, index) => (
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
          <div className="max-w-[180px] mx-auto">
            <h2 className="text-xl font-bold mb-4">Selecciona una opción de PDF</h2>
            
            <button
              className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700 transition w-[140px]"
              onClick={() => handlePDFOption('sin_membretado')}
              >
                Ver PDF sin membretado
              </button>
  
              <button
                className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700 transition w-[140px]"
                onClick={() => handlePDFOption('con_membretado_halmeco')}
              >
                Ver PDF con membretado Halmeco
              </button>
  
              <button
                className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-blue-700 transition w-[140px]"
                onClick={() => handlePDFOption('con_membretado_elevatec')}
              >
                Ver PDF con membretado Elevatec
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
      </div>
    );
  };
  
  export default QuotationList;
  
