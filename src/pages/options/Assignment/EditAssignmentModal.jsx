import React, { useState, useEffect } from 'react';
import { db } from '../../../connection/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

const EditAssignmentModal = ({ assignmentId, onClose }) => {
  const [clientInfo, setClientInfo] = useState(null);
  const [workerInfo, setWorkerInfo] = useState(null);
  const [clientProjects, setClientProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        const assignmentDoc = await getDoc(doc(db, 'assignments', assignmentId));
        if (assignmentDoc.exists()) {
          const assignmentData = assignmentDoc.data();
          
          setSelectedProjects(assignmentData.projectIds);
          await loadClientAndWorkerInfo(assignmentData.clientId, assignmentData.workerId);
          await loadClientProjects(assignmentData.clientId, assignmentData.projectIds);
        }
      } catch (error) {
        console.error('Error fetching assignment data:', error);
      }
    };

    fetchAssignmentData();
  }, [assignmentId]);

  const loadClientAndWorkerInfo = async (clientId, workerId) => {
    const clientDoc = await getDoc(doc(db, 'clients', clientId));
    const workerDoc = await getDoc(doc(db, 'login firebase', workerId));

    if (clientDoc.exists()) setClientInfo(clientDoc.data());
    if (workerDoc.exists()) setWorkerInfo(workerDoc.data());
  };

  const loadClientProjects = async (clientId, assignedProjectIds) => {
    try {
      const projectsQuery = query(collection(db, 'locations'), where('clientId', '==', clientId));
      const projectsSnapshot = await getDocs(projectsQuery);

      const projectsList = projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setClientProjects(projectsList.map((project) => ({
        ...project,
        assigned: assignedProjectIds.includes(project.id),
      })));
    } catch (error) {
      console.error('Error loading client projects:', error);
    }
  };

  const handleProjectToggle = (projectId) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const handleSaveChanges = async () => {
    try {
      await updateDoc(doc(db, 'assignments', assignmentId), { projectIds: selectedProjects });
      alert('Asignación actualizada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/2 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500 font-bold">X</button>
        <h2 className="text-2xl font-bold mb-4">Editar Asignación de Proyectos</h2>

        {clientInfo && workerInfo ? (
          <>
            <p><strong>Cliente:</strong> {clientInfo.name}</p>
            <p><strong>Trabajador:</strong> {workerInfo.username}</p>
            <div className="mt-4 w-full overflow-auto h-[30vh] mb-4">
              <table className="table-auto w-full bg-white shadow-md rounded-lg border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-6 text-left">Tipo</th>
                    <th className="py-3 px-6 text-left">Dirección</th>
                    <th className="py-3 px-6 text-left">Estado</th>
                    <th className="py-3 px-6 text-left">Asignado</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {clientProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left">{project.id}</td>
                      <td className="py-3 px-6 text-left">{project.Tipo || 'Sin Tipo'}</td>
                      <td className="py-3 px-6 text-left">{project.Direccion || 'Sin Dirección'}</td>
                      <td className="py-3 px-6 text-left">{project.state}</td>
                      <td className="py-3 px-6 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.id)}
                          onChange={() => handleProjectToggle(project.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveChanges}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Guardar Cambios
              </button>
            </div>
          </>
        ) : (
          <p>Cargando datos de la asignación...</p>
        )}
      </div>
    </div>
  );
};

export default EditAssignmentModal;
