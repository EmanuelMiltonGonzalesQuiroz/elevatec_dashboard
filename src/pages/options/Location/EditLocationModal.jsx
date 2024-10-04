import React, { useState, useEffect } from 'react';
import { updateDoc, collection, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const typeOptions = {
  CONSTRUCCION: [
    { id: 'CA', label: 'C. ASCENSORES' },
    { id: 'CM', label: 'C. MONTA COCHES' },
    { id: 'CE', label: 'C. ESCALERAS MECANIMAS' },
    { id: 'C.MC', label: 'C. MONTA CARGAS' },
  ],
  MANTENIMIENTO: [
    { id: 'MA', label: 'M. ASCENSORES' },
    { id: 'MM', label: 'M. MONTA COCHES' },
    { id: 'ME', label: 'M. ESCALERAS MECANIMAS' },
    { id: 'M.MC', label: 'M. MONTA CARGAS' },
  ],
  MODERNIZACION: [
    { id: 'MMA', label: 'M. ASCENSORES' },
    { id: 'MMM', label: 'M. MONTA COCHES' },
    { id: 'MME', label: 'M. ESCALERAS MECANIMAS' },
    { id: 'ME.MC', label: 'M. MONTA CARGAS' },
  ],
};

const EditLocationModal = ({ location, onClose }) => {
  const [formData, setFormData] = useState({
    Tipo0: location.Tipo ? location.Tipo[0] : '',
    Tipo1: location.Tipo ? location.Tipo[1] : '',
    Tipo2: location.Tipo ? location.Tipo[2] : '',
    client: location.client || '',
    Direccion: location.Direccion || '',
    state: location.state || '',
  });

  const [locationDocId, setLocationDocId] = useState(null);
  const [locationStates, setLocationStates] = useState([]);
  const [stateColors, setStateColors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationDocument = async () => {
      try {
        const q = query(collection(db, 'locations'), where('id', '==', location.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          setLocationDocId(docSnapshot.id);
          setFormData({
            Tipo0: docSnapshot.data().Tipo[0],
            Tipo1: docSnapshot.data().Tipo[1],
            Tipo2: docSnapshot.data().Tipo[2],
            client: docSnapshot.data().client,
            Direccion: docSnapshot.data().Direccion,
            state: docSnapshot.data().state,
          });
        } else {
          console.error('No se encontró ningún documento con el id proporcionado.');
        }
      } catch (error) {
        console.error('Error al buscar el documento:', error);
      }
    };

    const fetchLocationStates = async () => {
      const statesCol = collection(db, 'locationStates');
      const statesSnapshot = await getDocs(statesCol);
      const activeStates = statesSnapshot.docs
        .filter((doc) => doc.data().state === true)
        .map((doc) => ({
          id: doc.id,
          color: doc.data().color,
        }));
      setLocationStates(activeStates);
      const colors = {};
      activeStates.forEach((state) => {
        colors[state.id] = state.color;
      });
      setStateColors(colors);
      setLoading(false);
    };

    fetchLocationDocument();
    fetchLocationStates();
  }, [location.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === 'Tipo2' && {
        Tipo1: typeOptions[formData.Tipo0]?.find((option) => option.label === value)?.id || '',
      }),
    }));
  };

  const handleSave = async () => {
    try {
      if (locationDocId) {
        const locationRef = doc(db, 'locations', locationDocId);
        await updateDoc(locationRef, {
          Tipo: [formData.Tipo0, formData.Tipo1, formData.Tipo2],
          client: formData.client,
          Direccion: formData.Direccion,
          state: formData.state,
        });
        onClose();
      } else {
        console.error('No se encontró el ID del documento para actualizar.');
      }
    } catch (error) {
      console.error('Error al actualizar la ubicación:', error);
    }
  };
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[50vh] max-h-[70vh] text-black overflow-auto">
        <h2 className="text-xl font-bold mb-4">Editar Ubicación</h2>

        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            {/* Select del primer tipo */}
            <div className="mb-4">
              <label className="block text-black">Tipo</label>
              <select
                name="Tipo0"
                value={formData.Tipo0}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="" disabled>
                  Selecciona un tipo
                </option>
                {Object.keys(typeOptions).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Segundo select oculto */}
            <div className="hidden">
              <select
                name="Tipo1"
                value={formData.Tipo1}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                {typeOptions[formData.Tipo0]?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Tercer select basado en el segundo tipo */}
            {formData.Tipo0 && (
              <div className="mb-4">
                <label className="block text-black">Descripción</label>
                <select
                  name="Tipo2"
                  value={formData.Tipo2}
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                >
                  <option value="" disabled>
                    Selecciona una descripción
                  </option>
                  {typeOptions[formData.Tipo0]?.map((option) => (
                    <option key={option.id} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Edición del cliente */}
            <div className="mb-4">
              <label className="block text-black">Cliente</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              />
            </div>

            {/* Edición de la dirección */}
            <div className="mb-4">
              <label className="block text-black">Dirección</label>
              <input
                type="text"
                name="Direccion"
                value={formData.Direccion}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              />
            </div>

            {/* Edición del estado con color */}
            <div className="mb-4">
              <label className="block text-black">Estado</label>
              <div className="flex items-center">
                <select
                  name="state"
                  value={formData.state} 
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                >
                  <option value="" disabled>
                    Selecciona un estado
                  </option>
                  {locationStates.map((state) => (
                    <option key={state.id} value={state.id}>
                      
                      {state.id=== 'Cotizacion_A' 
                      ? 'Cotización Ascensor' 
                      : state.id === 'Cotizacion_M' 
                      ? 'Cotización Mantenimiento' 
                      : state.id}
                    </option>
                  ))}
                </select>
                {formData.state && (
                  <div
                    className="w-4 h-4 rounded-full ml-2"
                    style={{ backgroundColor: stateColors[formData.state] || 'black' }}
                  ></div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Guardar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditLocationModal;
