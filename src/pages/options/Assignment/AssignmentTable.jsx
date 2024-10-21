import React, { useState } from 'react';
import ClientInfoModal from './ClientInfoModal'; // Importa el modal

const AssignmentTable = ({ assignments }) => {
  const [selectedClientId, setSelectedClientId] = useState(null);

  const handleInfoClick = (clientId) => {
    setSelectedClientId(clientId); // Guardar el ID del cliente seleccionado
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Asignaciones Creadas</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Cliente</th>
            <th className="py-2">Trabajador</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={index} className="text-center border-b">
              <td className="py-2">{assignment.clientName}</td>
              <td className="py-2">{assignment.workerName}</td>
              <td className="py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleInfoClick(assignment.clientId)} // Pasar el ID del cliente
                >
                  Info
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mostrar el modal si un cliente ha sido seleccionado */}
      {selectedClientId && (
        <ClientInfoModal clientId={selectedClientId} onClose={() => setSelectedClientId(null)} />
      )}
    </div>
  );
};

export default AssignmentTable;
