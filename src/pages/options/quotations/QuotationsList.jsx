import React, { useState, useEffect } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { homeText } from '../../../components/common/Text/texts';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Asegúrate de tener Firebase configurado

const QuotationList = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    // Función para obtener datos de Firestore
    const fetchQuotations = async () => {
      const db = getFirestore();
      const quotationsCol = collection(db, 'list of quotations');
      const quotationSnapshot = await getDocs(quotationsCol);
      const quotationList = quotationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuotations(quotationList);
    };

    fetchQuotations();
  }, []);

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
    // Aquí podrías añadir lógica adicional si necesitas filtrar las cotizaciones por cliente seleccionado
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full text-black">
      <h1 className="text-xl font-bold mb-4">{homeText.listOfQuotations}</h1>
      
      {/* Sección de selección de cliente */}
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
                <button className="bg-blue-500 text-white p-2 rounded">Generar PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuotationList;
