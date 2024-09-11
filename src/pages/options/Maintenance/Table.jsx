import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const Table = ({ selectedItems, setSelectedItems }) => {
  const [directPercentage, setDirectPercentage] = useState(10);
  const [approvalPercentage, setApprovalPercentage] = useState(10);
  const { currentUser } = useAuth();
  const userRole = currentUser?.role || JSON.parse(localStorage.getItem('user'))?.role || 'Usuario';

  // Función para calcular los totales
  const calculateTotals = () => {
    const totalBasePrice = selectedItems.reduce((sum, item) => {
      const basePrice = parseFloat(item.type?.basePrice || item.basePrice || 0);
      return sum + basePrice;
    }, 0);

    // Calcular el precio final (primero = precio base, el resto con 30% descuento)
    const totalFinalPrice = selectedItems.reduce((sum, item, index) => {
      let finalPrice = parseFloat(item.basePrice || item.type?.basePrice || 0);
      if (index > 0) {
        finalPrice = finalPrice * 0.7; // Aplicar el 30% descuento
      }
      return sum + finalPrice;
    }, 0);

    return {
      totalBasePrice,
      totalFinalPrice,
    };
  };

  // Función para ordenar por precio base
  const sortItemsByPrice = (items) => {
    return [...items].sort((a, b) => {
      const priceA = parseFloat(a.type?.basePrice || a.basePrice || 0);
      const priceB = parseFloat(b.type?.basePrice || b.basePrice || 0);
      return priceB - priceA; // Ordenar de mayor a menor precio
    });
  };

  // Función para agregar el índice del tipo (ASC, MCS, etc.)
  const assignTypeIndexes = (items) => {
    const typeCounters = {}; // Contador por tipo

    return items.map((item) => {
      const type = item.type?.type || item.type || 'N/A';

      // Si no existe el tipo en el contador, inicializar en 0
      if (!typeCounters[type]) {
        typeCounters[type] = 1;
      } else {
        typeCounters[type] += 1; // Incrementar el contador del tipo
      }

      return {
        ...item,
        displayType: `${type}.${typeCounters[type]}`, // Añadir el índice al tipo
      };
    });
  };

  // Ordenar y asignar el índice de tipo
  const sortedAndIndexedItems = assignTypeIndexes(sortItemsByPrice(selectedItems));

  const { totalBasePrice, totalFinalPrice } = calculateTotals();

  // Función para calcular el total final aplicando % Directo y % Aprob. Gerencia
  const calculateFinalTotal = () => {
    const totalDiscount = directPercentage + approvalPercentage;
    const finalDiscountFactor = (100 - totalDiscount) / 100;
    return totalFinalPrice * finalDiscountFactor;
  };

  // Función para borrar todos los datos
  const clearTable = () => {
    setSelectedItems([]);
  };

  // Función para borrar un ítem específico
  const removeItem = (indexToRemove) => {
    setSelectedItems(selectedItems.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="h-[57vh] bg-white rounded-lg shadow-lg p-4 overflow-auto">
      <div className="mt-4 flex justify-between">
        <h2 className="text-xl font-bold mb-4 text-black">Tabla de Seleccionados</h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={clearTable}
        >
          Borrar Todos
        </button>
      </div>
      <table className="min-w-full border-collapse border border-gray-300 text-black">
        <thead>
          <tr>
            <th className="border px-4 py-2">TIPO</th>
            <th className="border px-4 py-2">PRECIO BASE</th>
            <th className="border px-4 py-2">PRECIO FINAL</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedAndIndexedItems.length === 0 ? (
            <tr>
              <td className="border px-4 py-2">-</td>
              <td className="border px-4 py-2">Bs0.00</td>
              <td className="border px-4 py-2">Bs0.00</td>
              <td className="border px-4 py-2">-</td>
            </tr>
          ) : (
            sortedAndIndexedItems.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.displayType}</td>
                <td className="border px-4 py-2">Bs{parseFloat(item.basePrice?.toFixed(2)) || parseFloat(item.type?.basePrice || 0).toFixed(2)}</td>
                <td className="border px-4 py-2">
                  Bs{index === 0 
                    ? parseFloat(item.basePrice?.toFixed(2)) || parseFloat(item.type?.basePrice || 0).toFixed(2)
                    : (parseFloat(item.basePrice) * 0.7)?.toFixed(2) || (parseFloat(item.type?.basePrice || 0) * 0.7).toFixed(2)}
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => removeItem(index)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))
          )}
          {sortedAndIndexedItems.length > 0 && (
            <tr className="bg-green-100 font-bold">
              <td className="border px-4 py-2">Precio Total</td>
              <td className="border px-4 py-2">Bs{totalBasePrice.toFixed(2)}</td>
              <td className="border px-4 py-2">Bs{totalFinalPrice.toFixed(2)}</td>
              <td className="border px-4 py-2"></td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center bg-green-500 text-white p-2 rounded-lg">
            <p>Precio Total según plan</p>
            <p>{totalBasePrice.toFixed(2)}</p>
          </div>
          <div className="text-center bg-yellow-500 text-black p-2 rounded-lg">
            <p>% Directo</p>
            <input
              type="number"
              value={directPercentage}
              onChange={(e) => setDirectPercentage(Math.max(0, Math.min(100, parseInt(e.target.value, 10))))}
              className="w-full text-center bg-white border border-gray-300 rounded-md"
              min="0"
              max="100"
            />
          </div>
          {userRole === 'Administrador' && (
            <div className="text-center bg-red-500 text-white p-2 rounded-lg">
              <p>% Aprob. Gerencia</p>
              <input
                type="number"
                value={approvalPercentage}
                onChange={(e) => setApprovalPercentage(Math.max(0, Math.min(100, parseInt(e.target.value, 10))))}
                className="w-full text-center bg-white border border-gray-300 rounded-md"
                min="0"
                max="100"
              />
            </div>
          )}
          <div className="text-center bg-green-500 text-white p-2 rounded-lg">
            <p>Total</p>
            <p>{calculateFinalTotal().toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
