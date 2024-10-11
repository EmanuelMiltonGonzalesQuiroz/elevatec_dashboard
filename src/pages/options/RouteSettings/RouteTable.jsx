import React, { useState } from 'react';
import EditDataForm from './EditDataForm';
import { collectionNameMapping } from '../../../utils/collectionNames';
import { formatTitle } from '../../../utils/formatTitle';
import { columnOrders } from '../../../utils/columnOrders';

const RouteTable = ({ data, activeCollection, onDataUpdate }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState({});

  const handleOpenModal = (itemIndex, item) => {
    setCurrentItemIndex(itemIndex);
    setCurrentData(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const extractHeaders = (dataArray, activeCollection) => {
    if (dataArray.length > 0) {
      const headers = Object.keys(dataArray[0]);
      const orderedHeaders = columnOrders[activeCollection] || headers;
      return orderedHeaders.filter((header) => headers.includes(header));
    }
    return [];
  };

  return (
    <div className="overflow-auto max-h-full max-w-[155vh]">
      <h2 className="text-2xl font-bold mb-6">
        Ajustes de Recorrido - {collectionNameMapping[activeCollection]}
      </h2>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="text-black font-bold">
            {/* Usar 'Pisos' como encabezado si la colección activa es 'configuraciones_de_pisos' */}
            <th className="border px-4 py-2">
              {activeCollection === 'configuraciones_de_pisos' ? 'Pisos' : '#'}
            </th>
            {data.length > 0 && data[0].data && extractHeaders(data[0].data, activeCollection).map((header) => (
              <th key={header} className="border px-4 py-2">
                {formatTitle(header)}
              </th>
            ))}
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((dataItem, index) =>
            dataItem.data.map((item, subIndex) => (
              <tr key={`${index}-${subIndex}`} className="text-black">
                {/* Mostrar el valor de 'pisos' en lugar del subíndice si la colección es 'configuraciones_de_pisos' */}
                <td className="border px-4 py-2">
                  {activeCollection === 'configuraciones_de_pisos' ? item.pisos : subIndex + 1}
                </td>
                {extractHeaders(dataItem.data, activeCollection).map((header) => (
                  <td key={header} className="border px-4 py-2">{item[header]}</td>
                ))}
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                    onClick={() => handleOpenModal(subIndex, item)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <EditDataForm
          docId={activeCollection} // Usamos el nombre de la colección como docId
          itemIndex={currentItemIndex}
          collectionName={activeCollection}
          data={currentData}
          onClose={handleCloseModal}
          onSuccess={onDataUpdate} // Pasamos onDataUpdate para actualizar los datos
        />
      )}
    </div>
  );
};

export default RouteTable;
