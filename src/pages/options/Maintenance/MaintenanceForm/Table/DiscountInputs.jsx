import React, { useEffect, useState } from 'react';

const DiscountInputs = ({
  totalFinalPrice,
  plan,
  userRole,
  setDirectPercentage,
  setApprovalPercentage,
  setTotalPriceByPlan,
  setFinalTotal,
  totalPriceByPlan,
  finalTotal
}) => {
  const [localDirectPercentage, setLocalDirectPercentage] = useState(0);
  const [localApprovalPercentage, setLocalApprovalPercentage] = useState(0);

  useEffect(() => {
    const calculateTotalM = () => {
      let multiplier = 1; // Por defecto, mensual
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
          multiplier = 1;
          break;
      }
      const totalByPlan = totalFinalPrice * multiplier;
      setTotalPriceByPlan(totalByPlan.toFixed(2));  // Actualiza el valor en el componente padre
      return totalByPlan;
    };

    const calculateFinalTotal = () => {
      const totalDiscount = localDirectPercentage + localApprovalPercentage;
      const discountFactor = totalDiscount / 100;
      const totalWithPlan = calculateTotalM();
      const finalTotalValue = totalWithPlan - totalWithPlan * discountFactor;
      setFinalTotal(finalTotalValue.toFixed(2)); // Actualiza el valor en el componente padre
    };

    calculateFinalTotal();
  }, [localDirectPercentage, localApprovalPercentage, plan, totalFinalPrice, setTotalPriceByPlan, setFinalTotal]);

  return (
    <div className="w-full grid grid-cols-4 gap-4">
      {/* Precio Total según Plan */}
      <div className="text-center bg-green-500 text-white p-2 rounded-lg">
        <p>Precio Total según plan</p>
        <p>{totalPriceByPlan}</p> {/* Muestra el precio calculado según el plan */}
      </div>

      {/* Descuento Directo */}
      <div className="text-center bg-yellow-500 text-black p-2 rounded-lg w-full">
        <p>% Directo</p>
        <input
          type="number"
          value={localDirectPercentage}
          onChange={(e) => {
            const value = Math.max(0, Math.min(10, Number(e.target.value)));
            setLocalDirectPercentage(value);
            setDirectPercentage(value);
          }}
          className="w-full text-center bg-white border border-gray-300 rounded-md"
          min="0"
          max="10"
        />
      </div>

      {/* Descuento Aprobación Gerencia, solo visible para ciertos roles */}
      {(userRole === 'Administrador' || userRole === 'Gerencia') && (
        <div className="text-center bg-red-500 text-white p-2 rounded-lg w-full">
          <p>% Aprob. Gerencia</p>
          <input
            type="number"
            value={localApprovalPercentage}
            onChange={(e) => {
              const value = Math.max(0, Math.min(10, Number(e.target.value)));
              setLocalApprovalPercentage(value);
              setApprovalPercentage(value);
            }}
            className="w-full text-center bg-white border border-gray-300 rounded-md text-black"
            min="0"
            max="10"
          />
        </div>
      )}

      {/* Total Final */}
      <div className="text-center bg-green-500 text-white p-2 rounded-lg">
        <p>Total</p>
        <p>{finalTotal}</p> {/* Muestra el total final calculado con descuentos */}
      </div>
    </div>
  );
};

export default DiscountInputs;
