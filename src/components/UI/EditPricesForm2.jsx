import React, { useState } from 'react';

const EditPricesForm2 = ({ pisos, asc4To6, asc8To10, asc12To14, onClose, onSave }) => {
  const [price4to6, setPrice4to6] = useState(asc4To6);
  const [price8to10, setPrice8to10] = useState(asc8To10);
  const [price12to14, setPrice12to14] = useState(asc12To14);

  const handleSave = () => {
    const updatedPrices = {
      'ASC. 4 - 6': price4to6,
      'ASC. 8 - 10': price8to10,
      'ASC. 12 - 14': price12to14,
    };
    onSave(updatedPrices); // Devuelve todos los precios editados
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar precios para el piso {pisos}</h2>
        <div className="mb-4">
          <label className="block text-gray-700">ASC. 4 - 6</label>
          <input
            type="text"
            value={price4to6}
            onChange={(e) => setPrice4to6(e.target.value)}
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">ASC. 8 - 10</label>
          <input
            type="text"
            value={price8to10}
            onChange={(e) => setPrice8to10(e.target.value)}
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">ASC. 12 - 14</label>
          <input
            type="text"
            value={price12to14}
            onChange={(e) => setPrice12to14(e.target.value)}
            className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPricesForm2;
