import React from 'react';

const ClientList = ({ clients, filteredClients, handleOpenModal, handleOpenQuotationsModal, handleDeleteClient, currentUser }) => (
  <div className="overflow-auto">
    <table className="min-w-full bg-white border">
      <thead>
        <tr className='text-black font-bold'>
          <th className="border px-4 py-2">#</th>
          <th className="border px-4 py-2">Nombre</th>
          <th className="border px-4 py-2">CI/NIT</th>
          <th className="border px-4 py-2">Teléfono</th>
          <th className="border px-4 py-2">Correo</th>
          <th className="border px-4 py-2">Dirección</th>
          <th className="border px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {filteredClients.map((client) => (
          <tr key={client.id} className='text-black'>
            <td className="border px-4 py-2">{client.index}</td>
            <td className="border px-4 py-2">{client.name}</td>
            <td className="border px-4 py-2">{client.ciNIT}</td>
            <td className="border px-4 py-2">{client.phone}</td>
            <td className="border px-4 py-2">{client.email}</td>
            <td className="border px-4 py-2">{client.address}</td>
            <td className="border px-4 py-2">
              <div className="flex justify-center items-center">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition mx-2"
                  onClick={() => handleOpenModal(client)}
                >
                  Editar
                </button>
                {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia') && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition mx-2"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ClientList;
