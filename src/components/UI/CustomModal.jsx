import React from 'react';

const CustomModal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end sm:items-center sm:justify-center ">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[45vh] sm:max-h-[40vh] ms:max-w-[90%] mx-auto">
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
