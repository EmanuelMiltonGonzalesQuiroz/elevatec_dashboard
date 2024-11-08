import React, { useState, useEffect } from 'react';
import AssignmentForm from './AssignmentForm';
import AssignmentTable from './AssignmentTable';
import AssignmentFilter from './AssignmentFilter'; // Agregar filtro
import { db } from '../../../connection/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';  // Asumiendo que tienes un contexto de autenticación
import DirectionsModal from '../Location/DirectionsModal';

const Assignment = () => {
  const { currentUser } = useAuth();  // Obtenemos el usuario actual
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false); // Estado para el modal de direcciones
  const [selectedLocationForDirections, setSelectedLocationForDirections] = useState(null); // Estado para la ubicación seleccionada


  // Cargar asignaciones desde Firebase al inicio
  useEffect(() => {
    const fetchAssignments = async () => {
      const querySnapshot = await getDocs(collection(db, 'assignments'));
      const assignmentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Si el usuario es Trabajador, filtramos las asignaciones
      if (currentUser?.role === 'Trabajador') {
        const workerAssignments = assignmentList.filter(
          (assignment) => assignment.workerId === currentUser.id
        );
        setAssignments(workerAssignments);
        setFilteredAssignments(workerAssignments);
      } else {
        // Si es Administrador o Gerencia, mostramos todas
        setAssignments(assignmentList);
        setFilteredAssignments(assignmentList);
      }
    };

    fetchAssignments();
  }, [currentUser]);

  // Función para añadir una nueva asignación al estado
  const handleNewAssignment = (newAssignment) => {
    setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
    setFilteredAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
  };

  // Función para filtrar asignaciones por cliente y trabajador
  const handleFilter = ({ clientId, workerId }) => {
    let filtered = [...assignments];

    if (clientId) {
      filtered = filtered.filter((assignment) => assignment.clientId === clientId);
    }
    if (workerId) {
      filtered = filtered.filter((assignment) => assignment.workerId === workerId);
    }

    setFilteredAssignments(filtered);
  };
  const handleShowDirections = (location) => {
    setSelectedLocationForDirections(location);
    setShowDirectionsModal(true);
  };

  return (
    <div className="flex flex-col p-6 rounded-lg shadow-lg w-full text-black space-y-4">
      {/* Mostrar el formulario y el filtro solo si el rol es Administrador o Gerencia */}
      {['Administrador', 'Gerencia'].includes(currentUser?.role) && (
        <>
          <AssignmentForm onNewAssignment={handleNewAssignment} />
          <AssignmentFilter onFilter={handleFilter} />
        </>
      )}

      {/* Mostrar la tabla de asignaciones */}
      <AssignmentTable assignments={filteredAssignments} onShowDirections={handleShowDirections}/>
      {showDirectionsModal && selectedLocationForDirections && (
        <DirectionsModal
          location={selectedLocationForDirections}
          onClose={() => setShowDirectionsModal(false)}
        />
      )}
    </div>
  );
};

export default Assignment;
