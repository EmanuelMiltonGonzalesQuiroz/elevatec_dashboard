import React, { useState } from 'react';
import EditDataForm from './EditDataForm';
import AddDataForm from './AddDataForm';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { collectionNameMapping } from '../../../utils/collectionNames';
import { formatTitle } from '../../../utils/formatTitle';
import { columnOrders } from '../../../utils/columnOrders';

const RouteTable = ({ data, activeCollection, onDataUpdate }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [currentData, setCurrentData] = useState({});

  const handleOpenEditModal = (itemIndex, item) => {
    setCurrentItemIndex(itemIndex);
    setCurrentData(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (docId, itemIndex) => {
    try {
      const docRef = doc(db, activeCollection, docId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();
        const dataArray = docData.data;

        // Eliminar solo el elemento en el índice específico del array
        if (Array.isArray(dataArray) && dataArray.length > itemIndex) {
          const updatedDataArray = dataArray.filter((_, index) => index !== itemIndex);
          
          // Actualizar el documento en Firestore con el array modificado
          await updateDoc(docRef, { data: updatedDataArray });
          
          // Actualizar la tabla después de eliminar
          onDataUpdate();
        } else {
          console.error('El índice no es válido o el array de datos está vacío');
        }
      } else {
        console.error('El documento no existe');
      }
    } catch (error) {
      console.error('Error al eliminar el elemento:', error);
    }
  };

  const extractHeaders = (dataArray, activeCollection) => {
    if (dataArray.length > 0) {
      const headers = Object.keys(dataArray[0]);
      const orderedHeaders = columnOrders[activeCollection] || headers;
      return orderedHeaders.filter((header) => headers.includes(header));
    }
    return [];
  };

  const formatIntervaloEspera = (value) => {
    if (Array.isArray(value)) {
      return value.join(' - ');
    }
    return value;
  };

  return (
    <div className="overflow-auto max-h-[130vh] max-w-[155vw]">
      <h2 className="text-2xl font-bold mb-6">
        Ajustes de Recorrido - {collectionNameMapping[activeCollection]}
      </h2>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-700 transition"
        onClick={handleOpenAddModal}
      >
        Agregar Registro
      </button>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="text-black font-bold">
            <th className="border px-4 py-2">
              {activeCollection === 'configuraciones_de_pisos' ? 'Pisos' : '#'}
            </th>
            {data.length > 0 && data[0].data && extractHeaders(data[0].data, activeCollection).map((header) => (
              <th key={header} className="border px-4 py-2">
                {formatTitle(header)}
              </th>
            ))}
            <th className="border px-4 py-2" style={{ width: '160px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((dataItem, index) =>
            dataItem.data.map((item, subIndex) => (
              <tr key={`${index}-${subIndex}`} className="text-black">
                <td className="border px-4 py-2">
                  {activeCollection === 'configuraciones_de_pisos' ? item.pisos : subIndex + 1}
                </td>
                {extractHeaders(dataItem.data, activeCollection).map((header) => (
                  <td key={header} className="border px-4 py-2">
                    {header === 'intervalo de espera seg.' ? formatIntervaloEspera(item[header]) : item[header]}
                  </td>
                ))}
                <td className="border px-4 py-2 flex flex-col items-center space-y-2" style={{ width: '160px' }}>
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition w-full"
                    onClick={() => handleOpenEditModal(subIndex, item)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full"
                    onClick={() => handleDelete(dataItem.id, subIndex)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isEditModalOpen && (
        <EditDataForm
          docId={activeCollection}
          itemIndex={currentItemIndex}
          collectionName={activeCollection}
          data={currentData}
          onClose={handleCloseEditModal}
          onSuccess={onDataUpdate}
        />
      )}

      {isAddModalOpen && (
        <AddDataForm
          collectionName={activeCollection}
          onClose={handleCloseAddModal}
          onSuccess={onDataUpdate}
        />
      )}
    </div>
  );
};

export default RouteTable;
