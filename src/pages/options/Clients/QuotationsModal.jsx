import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const QuotationsModal = ({ clientId, onClose }) => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    loadQuotations();
  });

  const loadQuotations = async () => {
    try {
      const q = query(collection(db, 'quotations'), where('clientId', '==', clientId));
      const quotationsSnapshot = await getDocs(q);
      const quotationsList = quotationsSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        index: index + 1,
        ...doc.data(),
      }));
      setQuotations(quotationsList);
    } catch (error) {
      console.error('Error al cargar las cotizaciones: ', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Lista de Cotizaciones</h2>
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
                <td className="border px-4 py-2">{new Date(quotation.date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Generar PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationsModal;
