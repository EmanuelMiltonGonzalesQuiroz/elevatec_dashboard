import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore'; // Importa Firestore y la función para agregar documentos
import { db } from '../../../connection/firebase'; // Asegúrate de tener la configuración de Firebase

const Table = ({ selectedItems, setSelectedItems }) => {
    const [directPercentage, setDirectPercentage] = useState(0);
    const [approvalPercentage, setApprovalPercentage] = useState(0);
    const { currentUser } = useAuth();
    const userRole = currentUser?.role || JSON.parse(localStorage.getItem('user'))?.role || 'Usuario';
    const [plan, setPlan] = useState("");
    const [buildingName, setBuildingName] = useState(""); // Estado para "Nombre de edificio"
    const [location, setLocation] = useState(null); // Estado para "location"

    // Función para obtener la fecha actual
    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString(); // Devuelve la fecha en formato ISO
    };

    // Función para obtener el último 'Plan' del arreglo de selectedItems
    const getLastPlan = (items) => {
        const plans = items.filter(item => item.type?.type === 'Plan' || item.type === 'Plan');
        return plans.length > 0 ? plans[plans.length - 1] : null;
    };

    // Función para obtener el último item con 'name' y 'position'
    const getLastLocation = (items) => {
        const locations = items.filter(item => item.type?.name && item.type?.position);
        return locations.length > 0 ? locations[locations.length - 1] : null;
    };

    // useEffect para actualizar el plan y la ubicación cuando cambien los selectedItems
    useEffect(() => {
        const lastPlan = getLastPlan(selectedItems);
        setPlan(lastPlan && lastPlan.type && lastPlan.type.plan ? lastPlan.type.plan : "");

        // Actualizar "Nombre de edificio" y "location"
        const lastLocation = getLastLocation(selectedItems);
        if (lastLocation) {
            setBuildingName(lastLocation.type.name);
            setLocation(lastLocation.type.position);
        }
    }, [selectedItems]); // Solo se ejecutará cuando cambien los selectedItems

    // Función para asignar el índice del tipo (ASC, MCS, etc.)
    const assignTypeIndexes = (items) => {
        const typeCounters = {}; // Contador por tipo

        return items.map((item) => {
            const type = item.type?.type || item.type || 'N/A';

            if (!typeCounters[type]) {
                typeCounters[type] = 1;
            } else {
                typeCounters[type] += 1;
            }

            return {
                ...item,
                displayType: `${type}.${typeCounters[type]}`,
            };
        });
    };

    // Función para actualizar el precio final de todos los ítems en selectedItems
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

    // Función para calcular los totales
    const calculateTotals = () => {
        const totalFinalPrice = selectedItems.reduce((sum, item) => {
            return sum + parseFloat(item.finalPrice || 0);
        }, 0);

        return { totalFinalPrice };
    };

    const { totalFinalPrice } = calculateTotals();

    // Función para calcular el total final aplicando % Directo y % Aprob. Gerencia
    const calculateFinalTotal = () => {
        const totalDiscount = directPercentage + approvalPercentage;
        const finalDiscountFactor = totalDiscount / 100;
        return calculateTotalM().toFixed(2) - calculateTotalM().toFixed(2) * finalDiscountFactor;
    };

    // Función para calcular el precio total según el plan
    const calculateTotalM = () => {
        let multiplier = 1; // Valor por defecto para 'Mensual'

        // Verificar el valor del plan y asignar el multiplicador correspondiente
        switch (plan) {
            case 'Trimensual':
                multiplier = 1.5;
                break;
            case 'Bimensual':
                multiplier = 1.25;
                break;
            case 'Mensual':
                multiplier = 1;
                break;
            case 'Bimestral':
                multiplier = 1.5;
                break;
            case 'Trimestral':
                multiplier = 2;
                break;
            default:
                multiplier = 1; // Si no hay plan, tomar como 'Mensual'
                break;
        }

        // Multiplicar el precio final total por el multiplicador
        return totalFinalPrice * multiplier;
    };

    // Función para borrar todos los datos
    const clearTable = () => {
        setSelectedItems([]);
    };

    // Función para borrar un ítem específico
    const removeItem = (indexToRemove) => {
        setSelectedItems(selectedItems.filter((_, index) => index !== indexToRemove));
    };

    // Función para guardar los datos en Firestore
    const handleSaveData = async () => {
        const dataToSave = {
            plan,
            buildingName,
            location,
            totalPriceByPlan: calculateTotalM().toFixed(2),
            directPercentage,
            approvalPercentage,
            finalTotal: calculateFinalTotal().toFixed(2),selectedItems,
            date: getCurrentDate(),
            
        };

        try {
            await addDoc(collection(db, 'list of maintenance'), dataToSave);
        } catch (error) {
            console.error('Error al guardar los datos en Firebase:', error);
        }
    };

    const sortedAndIndexedItems = assignTypeIndexes(selectedItems);

    return (
        <div className="h-[57vh] bg-white rounded-lg shadow-lg p-4 overflow-auto">
            <div className="mt-4 flex justify-between">
                <h2 className="text-xl font-bold mb-4 text-black">Tabla de Seleccionados</h2>
                <button
                    className="bg-green-500 text-white px-4 py-2 ml-4 rounded"
                    onClick={handleSaveData} // Guardar datos al hacer clic
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
                                typeof item.type !== 'function' && 
                                !(item.type?.name && item.type?.position) // Excluye los elementos que tienen un 'name' y 'position'
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
            <div className="mt-4">
                <div className="w-full grid grid-cols-4 gap-4">
                    <div className="text-center bg-green-500 text-white p-2 rounded-lg">
                        <p>Precio Total según plan</p>
                        <p>{calculateTotalM().toFixed(2)}</p>
                    </div>
                    <div className="text-center bg-yellow-500 text-black p-2 rounded-lg w-full">
                        <p>% Directo</p>
                        <input
                            type="number"
                            value={directPercentage}
                            onChange={(e) => setDirectPercentage(Math.max(0, Math.min(10, parseInt(e.target.value, 0))))}
                            className="w-full text-center bg-white border border-gray-300 rounded-md"
                            min="0"
                            max="10"
                        />
                    </div>
                    {(userRole === 'Administrador' || userRole === 'Gerencia') && (
                        <div className="text-center bg-red-500 text-white p-2 rounded-lg w-full">
                            <p>% Aprob. Gerencia</p>
                            <input
                                type="number"
                                value={approvalPercentage}
                                onChange={(e) => setApprovalPercentage(Math.max(0, Math.min(10, parseInt(e.target.value, 0))))}
                                className="w-full text-center bg-white border border-gray-300 rounded-md text-black"
                                min="0"
                                max="10"
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
