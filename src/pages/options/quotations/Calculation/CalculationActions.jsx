import React from 'react';

const CalculationActions = ({ onConfirm, onCancel, onViewPDF, onViewProcedure }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="flex justify-between w-full mb-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          onClick={onViewPDF}
        >
          Ver PDF
        </button>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          onClick={onViewProcedure}
        >
          Ver Procedimiento
        </button>
      </div>
      
      <div className="flex justify-between w-full mt-4">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          onClick={onConfirm}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default CalculationActions;
