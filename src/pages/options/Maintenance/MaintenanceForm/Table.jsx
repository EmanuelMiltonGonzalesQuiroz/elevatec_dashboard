import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import saveToFirestore from './Table/SaveMaintenance';  
import DiscountInputs from './Table/DiscountInputs';
import { getDoc, doc, setDoc } from 'firebase/firestore';  // Importar setDoc para guardar en Firestore
import { db } from '../../../../connection/firebase'; 

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
  const [client, setClient] = useState(null);  
  const [message, setMessage] = useState(''); 
  const [percentage, setPercentage] = useState(30);  // Valor predeterminado de porcentaje si no está en la BD
  const [newPercentage, setNewPercentage] = useState(percentage);  // Estado para el input del nuevo porcentaje

  // Obtener el porcentaje desde Firebase Firestore
  useEffect(() => {
    const fetchPercentage = async () => {
      try {
        const docRef = doc(db, 'percentage', 'percentage');  // Cambia el path según la estructura de tu BD
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const percentageData = docSnap.data().percentage || 30; // Valor predeterminado si no existe
          setPercentage(percentageData);
          setNewPercentage(percentageData); // Inicializar el valor del input con el porcentaje actual
        } else {
          console.log("No se encontró el porcentaje en la base de datos.");
        }
      } catch (error) {
        console.error("Error al obtener el porcentaje:", error);
      }
    };

    fetchPercentage();
  }, []);

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
      setClient(clientItem.type.client);  
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
        const finalPrice = index === 0 ? basePrice : basePrice * (1 - (percentage / 100));  // Usar el porcentaje de la BD
        return { ...item, finalPrice };
    });

    if (JSON.stringify(updatedItems) !== JSON.stringify(selectedItems)) {
        setSelectedItems(updatedItems);
    }
  }, [selectedItems, setSelectedItems, percentage]);  

  const calculateTotals = () => {
    const totalFinalPrice = selectedItems.reduce((sum, item) => sum + parseFloat(item.finalPrice || 0), 0);
    return { totalFinalPrice };
  };

  const { totalFinalPrice } = calculateTotals();

  const clearTable = () => setSelectedItems([]);
  const removeItem = (indexToRemove) => setSelectedItems(selectedItems.filter((_, index) => index !== indexToRemove));

  const handleSaveData = async () => {
    const filteredItems = assignTypeIndexes(selectedItems).filter(item => item.type?.type !== 'Plan');

    let missingFields = [];
    if (!plan) missingFields.push('Plan');
    if (!buildingName) missingFields.push('Nombre del Edificio');
    if (!location) missingFields.push('Ubicación');
    if (!client) missingFields.push('Cliente');  
    if (!totalPriceByPlan) missingFields.push('Precio Total según Plan');
    if (!finalTotal) missingFields.push('Total Final');
    if (!filteredItems.length) missingFields.push('Items seleccionados');

    if (missingFields.length > 0) {
      setMessage(`Faltan los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }

    setMessage('Guardando...');  

    const responseMessage = await saveToFirestore({
      plan,
      buildingName,
      location,
      filteredItems,
      totalPriceByPlan,
      directPercentage,
      approvalPercentage,
      finalTotal,
      client,
      currentUser 
    });

    setMessage(responseMessage);  
  };

  // Función para guardar el nuevo porcentaje en Firebase
  const handleSavePercentage = async () => {
    try {
      const docRef = doc(db, 'percentage', 'percentage');
      await setDoc(docRef, { percentage: newPercentage });
      setPercentage(newPercentage);  // Actualizar el porcentaje en el estado
      setMessage("Porcentaje actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar el porcentaje:", error);
      setMessage("Error al actualizar el porcentaje");
    }
  };

  const sortedAndIndexedItems = assignTypeIndexes(selectedItems);

  return (
    <div className="h-[57vh] bg-white rounded-lg shadow-lg p-4 overflow-auto min-w-80">
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-4 text-black">Tabla de Seleccionados</h2>
        <div className="flex justify-between">
          {userRole === 'Administrador' || userRole === 'Gerencia' ? (
            <div className="flex items-center">
            <input
              type="number"
              value={newPercentage}
              onChange={(e) => setNewPercentage(Number(e.target.value))}
              className="border rounded px-2 py-1 mr-2 w-16 font-bold"
            />
            <p className="font-bold mr-[20px]">%</p> {/* Separación de 5px */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSavePercentage}
            >
              Guardar Porcentaje
            </button>
          </div>
          
          ) : <p className="text-xl mb-4 text-black">{percentage}%</p>}
          
          <div className="flex space-x-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSaveData}
            >
              Guardar Mantenimiento
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={clearTable}
            >
              Borrar Todos
            </button>
          </div>
        </div>
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