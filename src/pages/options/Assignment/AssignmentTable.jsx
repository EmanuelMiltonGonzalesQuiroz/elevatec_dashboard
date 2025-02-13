import React, { useState, useEffect } from 'react';
import ClientInfoModal from './ClientInfoModal';
import EditAssignmentModal from './EditAssignmentModal';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import { useAuth } from '../../../context/AuthContext';

const AssignmentTable = ({ assignments: initialAssignments = [], onDelete, onShowDirections }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const { currentUser } = useAuth();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [workerNames, setWorkerNames] = useState({});
  const [clientNames, setClientNames] = useState({});

  // Cargar datos iniciales
  useEffect(() => {
    setAssignments(initialAssignments);
  }, [initialAssignments]);

  // Cargar nombres de trabajadores y clientes
  useEffect(() => {
    const fetchNames = async () => {
      const workerIds = [...new Set(assignments.map((assignment) => assignment.workerId))];
      const clientIds = [...new Set(assignments.map((assignment) => assignment.clientId))];

      try {
        const workersSnapshot = await Promise.all(
          workerIds.map((id) => getDoc(doc(db, 'login firebase', id)))
        );
        const workersData = {};
        workersSnapshot.forEach((doc) => {
          if (doc.exists()) {
            workersData[doc.id] = doc.data().username || 'Trabajador desconocido';
          }
        });
        setWorkerNames(workersData);

        const clientsSnapshot = await Promise.all(
          clientIds.map((id) => getDoc(doc(db, 'clients', id)))
        );
        const clientsData = {};
        clientsSnapshot.forEach((doc) => {
          if (doc.exists()) {
            clientsData[doc.id] = doc.data().name || 'Cliente desconocido';
          }
        });
        setClientNames(clientsData);
      } catch (error) {
        console.error('Error al cargar nombres de trabajadores o clientes:', error);
      }
    };

    if (assignments.length > 0) fetchNames();
  }, [assignments]);

  // Agrupar asignaciones por trabajador
  const assignmentsByWorker = assignments.reduce((acc, assignment) => {
    const workerName = workerNames[assignment.workerId] || 'Trabajador desconocido';
    const clientName = clientNames[assignment.clientId] || 'Cliente desconocido';

    if (!acc[workerName]) {
      acc[workerName] = [];
    }
    acc[workerName].push({
      clientName,
      clientId: assignment.clientId,
      workerId: assignment.workerId,
      assignmentId: assignment.id
    });
    return acc;
  }, {});

  const sortedWorkers = Object.keys(assignmentsByWorker).sort();

  const handleInfoClick = (clientId, workerId) => {
    setSelectedClientId(clientId);
    setSelectedWorkerId(workerId);
  };

  const handleEditClick = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
  };

  const handleDelete = async (assignmentId) => {
    try {
      await deleteDoc(doc(db, 'assignments', assignmentId));
      setAssignments((prevAssignments) => prevAssignments.filter((assignment) => assignment.id !== assignmentId));
      if (onDelete) {
        onDelete(assignmentId); // Llamar a la función de eliminación si está proporcionada
      }
    } catch (error) {
      console.error('Error al eliminar la asignación:', error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Asignaciones Creadas</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Usuario</th>
            <th className="py-2">Clientes</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedWorkers.map((workerName, index) => (
            <React.Fragment key={index}>
              <tr className="bg-gray-100 border-t-4 border-gray-300">
                <td className="py-2 font-semibold text-center" rowSpan={assignmentsByWorker[workerName].length + 1}>
                  {workerName}
                </td>
              </tr>
              {assignmentsByWorker[workerName].map((client, clientIndex) => (
                <tr key={clientIndex} className="text-center border-b border-gray-200">
                  <td className="py-2">{client.clientName}</td>
                  <td className="py-2">
                    <div className="grid grid-cols-1 gap-2 mx-auto justify-items-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded w-[150px]"
                        onClick={() => handleInfoClick(client.clientId, client.workerId)}
                      >
                        Info
                      </button>
                      {(currentUser.role === 'Administrador' || currentUser.role === 'Gerencia'|| currentUser.role === 'Super Usuario') && (
                        <div className="flex flex-col gap-2">
                          <button
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded w-[150px]"
                            onClick={() => handleEditClick(client.assignmentId)}
                          >
                            Editar
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded w-[150px]"
                            onClick={() => handleDelete(client.assignmentId)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {selectedClientId && selectedWorkerId && (
        <ClientInfoModal
          clientId={selectedClientId}
          workerId={selectedWorkerId}
          onClose={() => {
            setSelectedClientId(null);
            setSelectedWorkerId(null);
          }}
          onShowDirections={onShowDirections}
        />
      )}
      {selectedAssignmentId && (
        <EditAssignmentModal
          assignmentId={selectedAssignmentId}
          onClose={() => setSelectedAssignmentId(null)}
        />
      )}
    </div>
  );
};

export default AssignmentTable;
