import React from 'react';
import deleteMaintenance from './deleteMaintenance'; // Asegúrate de que la ruta sea correcta

const MaintenanceTable = ({ maintenanceList, handleViewPDF, updateMaintenanceStatus, currentUser, showDeleted }) => {
  return (
    <div className="overflow-auto">
      <table className="bg-white w-full">
        <thead>
          <tr>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">#</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Cliente</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Dirección</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Cotizado por</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Teléfono Cliente</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Plan</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Precio Total</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Fecha</th>
            <th className="text-left py-2 px-4 bg-gray-200 text-black font-bold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceList
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Ordenar por fecha
            .map((maintenance, index) => (
              <tr key={maintenance.id} className="bg-gray-100">
                <td className="py-2 px-4 text-black">{index + 1}</td>
                <td className="py-3 px-6 text-left">{maintenance.client?.name || 'Cliente desconocido'}</td>
                <td className="py-2 px-4 text-black">{maintenance.buildingName}</td>
                <td className="py-2 px-4 text-black">{maintenance.createdBy}</td>
                <td className="py-2 px-4 text-black">{maintenance.client?.phone}</td>
                <td className="py-2 px-4 text-black">{maintenance.plan}</td>
                <td className="py-2 px-4 text-black">{maintenance.finalTotal}</td>
                <td className="py-2 px-4 text-black">{maintenance.date}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button className="bg-blue-500 text-white p-2 rounded" onClick={() => handleViewPDF(maintenance)}>
                    Ver PDF
                  </button>
                  {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia' || currentUser.role === 'Super Usuario'|| currentUser.role === 'Usuario') && (
                    showDeleted ? (
                      <>
                        <button className="bg-green-500 text-white p-2 rounded" onClick={() => updateMaintenanceStatus(maintenance.id, 'active')}>
                          Restaurar
                        </button>
                        <button className="bg-red-700 text-white p-2 rounded" onClick={() => deleteMaintenance(maintenance.id)}>
                          Eliminar Definitivamente
                        </button>
                      </>
                    ) : (
                      <button className="bg-red-500 text-white p-2 rounded" onClick={() => updateMaintenanceStatus(maintenance.id, 'deleted')}>
                        Eliminar
                      </button>
                    )
                  )}
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTable;
