import React from 'react';
import { useAuth } from '../../../../context/AuthContext';

const ActionModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  onViewProcedure, 
  onViewPDFNoHeader, 
  onViewPDFjalmeco, 
  onViewPDFtecnolif, 
  onViewPDFjalmecoSin, 
  onViewPDFtecnolifSin, 
  onViewWord, 
  handleCloseModal 
}) => {
  const { currentUser } = useAuth();
  if (!show) {
    return null;
  }
   // Obtener currentUser


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        <div className="p-4 flex flex-col items-center">
          
          <button
            className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-green-700 transition w-full"
            onClick={onViewPDFNoHeader}  // PDF sin membrete
          >
            Ver PDF
          </button> 

          <button
            className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-green-700 transition w-full"
            onClick={onViewPDFjalmeco}
          >
            Ver PDF Jalmeco
          </button>

          <button
            className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-green-700 transition w-full"
            onClick={onViewPDFtecnolif}
          >
            Ver PDF Tecnolift
          </button>

          <button
            className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-green-700 transition w-full"
            onClick={onViewPDFjalmecoSin}
          >
            Ver PDF Jalmeco Sin Membretado
          </button>

          <button
            className="bg-blue-500 text-white py-2 px-4 mb-4 rounded hover:bg-green-700 transition w-full"
            onClick={onViewPDFtecnolifSin}
          >
            Ver PDF Tecnolift Sin Membretado
          </button>
          {['Administrador'].includes(currentUser.role) && (
               <button
                className="bg-green-500 text-white py-2 px-4 mb-4 rounded hover:bg-green-700 transition w-full"
                onClick={onViewProcedure}
              >
                Ver Procedimiento
              </button>
          )}
          <button
            className="bg-green-500 text-white py-2 px-4 mb-4 rounded hover:bg-green-700 transition w-full"
            onClick={onConfirm}
          >
            Confirmar
          </button>

          <button
            className="bg-red-500 text-white py-2 px-4 mb-4 rounded hover:bg-red-700 transition w-full"
            onClick={() => { 
              onClose();  // Llama a la función que cierra el modal
              handleCloseModal();  // Establece isGenerated: false
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
