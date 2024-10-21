import React, { useState } from 'react';
import CustomSelectUsses from '../../../components/UI/CustomSelectUsses';
import { db } from '../../../connection/firebase';
import { collection, addDoc } from 'firebase/firestore';

const AssignmentForm = ({ onNewAssignment }) => {
  const initialState = {
    task: '',
    selectedClient: null,
    selectedWorker: null,
    deadline: '',
  };

  const [assignmentFields, setAssignmentFields] = useState(initialState);

  // Manejar la selección del cliente
  const handleClientChange = (selectedClient) => {
    setAssignmentFields((prev) => ({
      ...prev,
      selectedClient,
    }));
  };

  // Manejar la selección del trabajador
  const handleWorkerChange = (selectedWorker) => {
    setAssignmentFields((prev) => ({
      ...prev,
      selectedWorker,
    }));
  };

  // Manejar la creación de una nueva asignación
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAssignment = {
      task: assignmentFields.task,
      clientId: assignmentFields.selectedClient?.value || 'No seleccionado',
      workerId: assignmentFields.selectedWorker?.value || 'No seleccionado',
      deadline: assignmentFields.deadline,
      clientName: assignmentFields.selectedClient?.label || 'Cliente no seleccionado',
      workerName: assignmentFields.selectedWorker?.label || 'Trabajador no seleccionado',
    };

    try {
      // Guardar la nueva asignación en Firebase
      const docRef = await addDoc(collection(db, 'assignments'), newAssignment);
      console.log('Documento añadido con ID: ', docRef.id);
      
      // Notificar al componente padre que se ha añadido una nueva asignación
      onNewAssignment(newAssignment);

      resetFields();
    } catch (error) {
      console.error('Error al crear la asignación: ', error);
    }
  };

  // Función para resetear los campos del formulario
  const resetFields = () => {
    setAssignmentFields(initialState);
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

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Asignar
          </button>
          <button
            type="button"
            onClick={resetFields}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Resetear
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm;
