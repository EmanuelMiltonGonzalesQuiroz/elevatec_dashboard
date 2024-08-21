import React from 'react';

const ConfigurableTable = ({ data, onEdit, columns }) => {
  return (
    <div className="p-4 bg-gray-100 text-black overflow-x-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">{columns.title}</h2>
        <table className="min-w-full bg-white border table-fixed">
          <thead>
            <tr className="text-black font-bold">
              {columns.headers.map((header, index) => (
                <th key={index} className="border px-2 py-2 text-center">{header}</th>
              ))}
              <th className="border px-2 py-2 text-center w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-black">
                {columns.keys.map((key, idx) => (
                  <td key={idx} className="border px-2 py-2 text-center truncate">{item[key]}</td>
                ))}
                <td className="border px-2 py-2 text-center">
                  <div className="flex justify-center items-center bg-white w-20 h-10 mx-auto rounded-lg shadow">
                    <button
                      className="bg-yellow-500 text-white w-full h-full rounded hover:bg-yellow-700 transition"
                      onClick={() => onEdit(item)}
                    >
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfigurableTable;
