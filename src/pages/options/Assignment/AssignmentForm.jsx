import React, { useState } from 'react';
import CustomSelectUsses from '../../../components/UI/CustomSelectUsses';
import { db } from '../../../connection/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

const AssignmentForm = ({ onNewAssignment }) => {
  const initialState = {
    selectedClient: null,
    selectedWorker: null,
  };

  const [assignmentFields, setAssignmentFields] = useState(initialState);
  const [clientProjects, setClientProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [allProjectsAssigned, setAllProjectsAssigned] = useState(false);

  const handleClientChange = async (selectedClient) => {
    setAssignmentFields((prev) => ({
      ...prev,
      selectedClient,
    }));
    setSelectedProjects([]);

    if (selectedClient) {
      try {
        const projectsQuery = query(
          collection(db, 'locations'),
          where('clientId', '==', selectedClient.value),
          where('state', 'in', [
            'Competencia',
            'Construccion',
            'Cotizacion_A',
            'Cotizacion_M',
            'Mantenimiento',
            'Modernizacion'
          ])
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsList = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        setClientProjects(projectsList);
        setAllProjectsAssigned(projectsList.length === 0);
      } catch (error) {
        console.error('Error cargando proyectos:', error);
      }
    } else {
      setClientProjects([]);
    }
  };

  const handleWorkerChange = (selectedWorker) => {
    setAssignmentFields((prev) => ({
      ...prev,
      selectedWorker,
    }));
  };

  const handleProjectSelect = (project) => {
    setSelectedProjects((prev) => {
      if (prev.find((p) => p.id === project.id)) {
        return prev.filter((p) => p.id !== project.id);
      } else {
        return [...prev, project];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm('¿Estás seguro de asignar estos proyectos?')) {
      return;
    }

    const newAssignment = {
      clientId: assignmentFields.selectedClient?.value,
      workerId: assignmentFields.selectedWorker?.value,
      projectIds: selectedProjects.map((project) => project.id),
    };

    try {
      const docRef = await addDoc(collection(db, 'assignments'), newAssignment);
      console.log('Asignación añadida con ID: ', docRef.id);
      onNewAssignment(newAssignment);
    } catch (error) {
      console.error('Error al crear la asignación: ', error);
    }
  };

  return (
    <div className="flex flex-col p-6 rounded-lg shadow-lg w-full text-black">
      <h1 className="text-2xl font-bold mb-4">Asignación de Cliente</h1>
      
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="client">
            Cliente
          </label>
          <CustomSelectUsses
            collectionName="clients"
            placeholder="Selecciona un cliente"
            selectedValue={assignmentFields.selectedClient}
            onChange={handleClientChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="worker">
            Trabajador
          </label>
          <CustomSelectUsses
            collectionName="login firebase"
            role="Trabajador"
            placeholder="Selecciona un trabajador"
            selectedValue={assignmentFields.selectedWorker}
            onChange={handleWorkerChange}
          />
        </div>

        {assignmentFields.selectedClient && (
          <div className="w-full overflow-auto h-[30vh] mb-4">
            {allProjectsAssigned ? (
              <p className="text-center text-gray-500">Todos los proyectos de este cliente han sido asignados</p>
            ) : (
              <table className="table-auto w-full bg-white shadow-md rounded-lg border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-6 text-left">Tipo</th>
                    <th className="py-3 px-6 text-left">Dirección</th>
                    <th className="py-3 px-6 text-left">Estado</th>
                    <th className="py-3 px-6 text-center">Seleccionar</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {clientProjects.map((project) => (
                    <tr
                      key={project.id}
                      className={`border-b border-gray-200 hover:bg-gray-100 ${
                        selectedProjects.some((p) => p.id === project.id) ? 'bg-green-200' : ''
                      }`}
                    >
                      <td className="py-3 px-6 text-left">{project.id}</td>
                      <td className="py-3 px-6 text-left">{project.Tipo || 'Sin Tipo'}</td>
                      <td className="py-3 px-6 text-left">{project.Direccion || 'Sin Dirección'}</td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <span>
                            {project.state === 'Cotizacion_A' 
                              ? 'Cotización Ascensor' 
                              : project.state === 'Cotizacion_M' 
                              ? 'Cotización Mantenimiento' 
                              : project.state}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <input
                          type="checkbox"
                          className="w-6 h-6"
                          checked={selectedProjects.some((p) => p.id === project.id)}
                          onChange={() => handleProjectSelect(project)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Asignar Proyectos
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
