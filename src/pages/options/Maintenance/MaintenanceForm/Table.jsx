import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import saveToFirestore from './Table/SaveMaintenance';  // Importar la función de guardado
import DiscountInputs from './Table/DiscountInputs';

const Table = ({ selectedItems, setSelectedItems }) => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.role || JSON.parse(localStorage.getItem('user'))?.role || 'Usuario';
  const [plan, setPlan] = useState(''); 
  const [buildingName, setBuildingName] = useState(''); 
  const [location, setLocation] = useState(null); 
  const [directPercentage, setDirectPercentage] = useState(0); 
  const [approvalPercentage, setApprovalPercentage] = useState(0); 
  const [totalPriceByPlan, setTotalPriceByPlan] = useState(0); 
  const [finalTotal, setFinalTotal] = useState(0); 
  const [client, setClient] = useState(null);  // Estado para almacenar la información del cliente
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    const getLastPlan = (items) => {
      const plans = items.filter(item => item.type?.type === 'Plan' || item.type === 'Plan');
      return plans.length > 0 ? plans[plans.length - 1] : null;
    };
  
    const lastPlan = getLastPlan(selectedItems);
    setPlan(lastPlan?.type?.plan || ''); 
  
    const lastLocation = selectedItems.find(item => item.type?.name && item.type?.position);
    if (lastLocation) {
      setBuildingName(lastLocation.type.name);
      setLocation(lastLocation.type.position);
    }

    // Buscar el cliente en los elementos seleccionados
    const clientItem = selectedItems.find(item => item.type?.type === 'Client');
    if (clientItem) {
      setClient(clientItem.type.client);  // Guardamos la información del cliente
    }
  }, [selectedItems, plan]);

  const assignTypeIndexes = (items) => {
    const typeCounters = {};
    return items.map(item => {
      const type = item.type?.type || item.type || 'N/A';
      typeCounters[type] = (typeCounters[type] || 0) + 1;
      return { ...item, displayType: `${type}.${typeCounters[type]}` };
    });
  };
  useEffect(() => {
    const sortedItems = [...selectedItems].sort((a, b) => {
        const priceA = parseFloat(a.basePrice || a.type?.basePrice || 0);
        const priceB = parseFloat(b.basePrice || b.type?.basePrice || 0);
        return priceB - priceA;
    });

    const updatedItems = sortedItems.map((item, index) => {
        const basePrice = parseFloat(item.basePrice || item.type?.basePrice || 0);
        const finalPrice = index === 0 ? basePrice : basePrice * 0.7;
        return { ...item, finalPrice };
    });

    if (JSON.stringify(updatedItems) !== JSON.stringify(selectedItems)) {
        setSelectedItems(updatedItems);
    }
}, [selectedItems, setSelectedItems]);

  const calculateTotals = () => {
    const totalFinalPrice = selectedItems.reduce((sum, item) => sum + parseFloat(item.finalPrice || 0), 0);
    return { totalFinalPrice };
  };

  const { totalFinalPrice } = calculateTotals();

  const clearTable = () => setSelectedItems([]);
  const removeItem = (indexToRemove) => setSelectedItems(selectedItems.filter((_, index) => index !== indexToRemove));

  const handleSaveData = async () => {
    const filteredItems = assignTypeIndexes(selectedItems).filter(item => item.type?.type !== 'Plan');

    // Validar si faltan campos, incluyendo el cliente
    let missingFields = [];
    if (!plan) missingFields.push('Plan');
    if (!buildingName) missingFields.push('Nombre del Edificio');
    if (!location) missingFields.push('Ubicación');
    if (!client) missingFields.push('Cliente');  // Validación del cliente
    if (!totalPriceByPlan) missingFields.push('Precio Total según Plan');
    if (!finalTotal) missingFields.push('Total Final');
    if (!filteredItems.length) missingFields.push('Items seleccionados');

    if (missingFields.length > 0) {
      setMessage(`Faltan los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }

    setMessage('Guardando...');  // Mostrar mensaje de guardado en progreso

    // Llamar a la función de guardado
    const responseMessage = await saveToFirestore({
      plan,
      buildingName,
      location,
      filteredItems,
      totalPriceByPlan,
      directPercentage,
      approvalPercentage,
      finalTotal,
      client  // Pasamos el cliente al guardado
    });

    setMessage(responseMessage);  // Mostrar el resultado del guardado
  };

  const sortedAndIndexedItems = assignTypeIndexes(selectedItems);

  return (
    <div className="h-[57vh] bg-white rounded-lg shadow-lg p-4 overflow-auto">
      <div className="mt-4 flex justify-between">
        <h2 className="text-xl font-bold mb-4 text-black">Tabla de Seleccionados</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 ml-4 rounded"
          onClick={handleSaveData}
        >
          Guardar Mantenimiento
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={clearTable}>
          Borrar Todos
        </button>
      </div>

      {message && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-black p-2 rounded shadow-lg">
          {message}
        </div>
      )}
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
            sortedAndIndexedItems
              .filter(item => 
                item.type?.type !== 'Plan' && 
                item.type?.type !== 'Client' && 
                typeof item.type !== 'function' && 
                !(item.type?.name && item.type?.position)
              )
              .map((item, index) => (
                <tr key={index}>
                    <td className="border px-4 py-2">{item.displayType}</td>
                    <td className="border px-4 py-2">
                        Bs{parseFloat(item.basePrice?.toFixed(2)) || parseFloat(item.type?.basePrice || 0).toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">Bs{item.finalPrice?.toFixed(2)}</td>
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
              <td className="border px-4 py-2">TOTAL</td>
              <td className="border px-4 py-2"></td>
              <td className="border px-4 py-2">Bs{totalFinalPrice.toFixed(2)}</td>
              <td className="border px-4 py-2"></td>
            </tr>
          )}
        </tbody>
      </table>

      <DiscountInputs 
        totalFinalPrice={totalFinalPrice}
        plan={plan}
        userRole={userRole}
        setDirectPercentage={setDirectPercentage}
        setApprovalPercentage={setApprovalPercentage}
        setTotalPriceByPlan={setTotalPriceByPlan}
        setFinalTotal={setFinalTotal}
        totalPriceByPlan={totalPriceByPlan}
        finalTotal={finalTotal}
      />
    </div>
  );
};

export default Table;
