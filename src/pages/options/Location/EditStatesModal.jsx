import React, { useState, useEffect } from 'react';
import { db } from '../../../connection/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';

const colorOptions = [
  { name: 'red', color: '#FF0000', label: 'Rojo' },       // Eliminar (Red)
  { name: 'green', color: '#008000', label: 'Verde' },    // Construcción (Green)
  { name: 'blue', color: '#0000FF', label: 'Azul' },      // Cotización M (Blue)
  { name: 'yellow', color: '#FBBC04', label: 'Amarillo' },// Mantenimiento (Yellow)
  { name: 'gray', color: '#808080', label: 'Gris' },      // Competencia (Gray)
  { name: 'white', color: '#FFFFFF', label: 'Blanco' },   // Default (White)
  { name: 'skyblue', color: '#ADD8E6', label: 'Celeste' },// Cotización A (Light Blue)
  { name: 'purple', color: '#800080', label: 'Púrpura' },  // Modernización (Purple)
  { name: 'magenta', color: '#FF00FF', label: 'Magenta' },// Additional
  { name: 'cyan', color: '#00FFFF', label: 'Cian' },      // Additional
  { name: 'olive', color: '#808000', label: 'Oliva' },    // Additional
  { name: 'skyblue', color: '#87CEEB', label: 'Celeste' },// Cotización A
  { name: 'purple', color: '#800080', label: 'Púrpura' }
];


const EditStatesModal = ({ onClose }) => {
  const [locationStates, setLocationStates] = useState([]);
  const [newState, setNewState] = useState({ id: '', color: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesCol = collection(db, 'locationStates');
        const statesSnapshot = await getDocs(statesCol);

        const statesData = statesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLocationStates(statesData);
      } catch (error) {
        console.error('Error fetching location states: ', error);
        setError('Error al cargar los estados');
      }
    };

    fetchStates();
  }, []);

  // Filter available colors
  const getAvailableColors = (currentColor) => {
    return colorOptions.filter(
      (option) => !locationStates.some((state) => state.color === option.color) || option.color === currentColor
    );
  };

  const handleStateChange = (id, key, value) => {
    if (key === 'color' && locationStates.some((state) => state.color === value && state.id !== id)) {
      setError('El color ya está asignado a otro estado');
      return;
    }

    setLocationStates((prevStates) =>
      prevStates.map((state) => (state.id === id ? { ...state, [key]: value } : state))
    );
    setError(''); // Reset error
  };

  const handleSave = async () => {
    try {
      for (let state of locationStates) {
        const stateRef = doc(db, 'locationStates', state.id);
        await updateDoc(stateRef, { state: state.state, color: state.color });
      }
      onClose();
    } catch (error) {
      console.error('Error saving states: ', error);
      setError('Error al guardar los estados');
    }
  };

  const handleAddState = async () => {
    if (!newState.id || !newState.color) {
      setError('Por favor completa ambos campos');
      return;
    }

    const colorExists = locationStates.some((state) => state.color === newState.color);
    if (colorExists) {
      setError('El color ya está asignado a otro estado');
      return;
    }

    try {
      const newStateRef = doc(db, 'locationStates', newState.id);
      await setDoc(newStateRef, { state: true, color: newState.color });

      setLocationStates((prevStates) => [
        ...prevStates,
        { id: newState.id, color: newState.color, state: true },
      ]);
      setNewState({ id: '', color: '' });
      setError('');
    } catch (error) {
      console.error('Error adding new state: ', error);
      setError('Error al agregar el nuevo estado');
    }
  };

  const handleDeleteState = async (id) => {
    try {
      await deleteDoc(doc(db, 'locationStates', id));
      setLocationStates((prevStates) => prevStates.filter((state) => state.id !== id));
    } catch (error) {
      console.error('Error deleting state: ', error);
      setError('Error al eliminar el estado');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex sm:items-center sm:justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-[45vh] sm:max-w-[80vh] space-y-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-4">Editar Estados</h2>
          <button className="text-red-500" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* State Edit Table */}
        <div className="max-h-[50vh] overflow-auto">
          <table className="table-auto w-full mb-4">
            <thead>
              <tr className="text-left text-lg">
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Activo</th>
                <th className="px-4 py-2">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {locationStates
                .filter((state) => state.id !== 'default') // Excluir el estado 'default'
                .map((state) => (
                  <tr key={state.id}>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={
                          state.id === 'Cotizacion_A'
                            ? 'Cotización Ascensor'
                            : state.id === 'Cotizacion_M'
                            ? 'Cotización Mantenimiento'
                            : state.id
                        }
                        disabled
                        className="p-2 border rounded w-full"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <select
                        value={state.color}
                        onChange={(e) => handleStateChange(state.id, 'color', e.target.value)}
                        className="p-2 border rounded w-full"
                        style={{
                          backgroundColor: colorOptions.find((opt) => opt.color === state.color)?.color,
                          border: '1px solid black',
                          color: 'black',
                        }}
                      >
                        {getAvailableColors(state.color).map((option) => (
                          <option
                            key={option.name}
                            value={option.color}
                            style={{ backgroundColor: option.color, color: 'black' }}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={state.state}
                        onChange={(e) => handleStateChange(state.id, 'state', e.target.checked)}
                        className="p-2"
                      />
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteState(state.id)}
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mb-2">Agregar nuevo estado</h3>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Nombre del estado"
            value={newState.id}
            onChange={(e) => setNewState({ ...newState, id: e.target.value })}
            className="p-2 border rounded w-1/2"
          />
          <select
            value={newState.color}
            onChange={(e) => setNewState({ ...newState, color: e.target.value })}
            className="p-2 border rounded w-1/2"
            style={{
              backgroundColor: colorOptions.find((opt) => opt.color === newState.color)?.color,
              border: '1px solid black',
              color: 'black',
            }}
          >
            <option value="" disabled>
              Selecciona un color
            </option>
            {getAvailableColors().map((option) => (
              <option key={option.color} value={option.color} style={{ backgroundColor: option.color, color: 'black' }}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-between space-x-4">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Guardar cambios
          </button>
          <button
            onClick={handleAddState}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Agregar estado
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStatesModal;
