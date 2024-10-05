import React from 'react';

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden min-w-[90%] max-w-[95%] max-h-[90vh] flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {children}
        </div>
        <div className="flex justify-end p-4 bg-gray-100">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
