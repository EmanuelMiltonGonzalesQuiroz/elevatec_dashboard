// src/pages/options/quotations/QuotationList.jsx
import React from 'react';
import { homeText } from '../../../components/common/Text/texts';

const QuotationList = () => {
  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg w-full text-black">
      <h1 className="text-xl font-bold mb-4">{homeText.listOfQuotations}</h1>
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
          {/* Aquí irían los registros dinámicos de cotizaciones */}
          <tr className="bg-gray-100">
            <td className="py-2 px-4 text-black">1</td>
            <td className="py-2 px-4 text-black">Civilian Blg</td>
            <td className="py-2 px-4 text-black">8746132</td>
            <td className="py-2 px-4 text-black">La Paz</td>
            <td className="py-2 px-4 text-black">Zulma</td>
            <td className="py-2 px-4 text-black">49,571.2</td>
            <td className="py-2 px-4 text-black">Aug 16, 2024</td>
            <td className="py-2 px-4">
              <button className="bg-blue-500 text-white p-2 rounded">Generar PDF</button>
            </td>
          </tr>
          {/* Más registros */}
        </tbody>
      </table>
    </div>
  );
};

export default QuotationList;
