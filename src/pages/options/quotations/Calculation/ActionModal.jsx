import React from 'react';

const ActionModal = ({ show, onClose, onConfirm, onCancel, onViewPDF, onViewProcedure }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        <div className="p-4 flex flex-col items-center">
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
        <div className="p-4 bg-gray-100 text-right">
          <button
            className="text-gray-600 hover:text-gray-900 transition"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
