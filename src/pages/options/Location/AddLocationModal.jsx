import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { db } from '../../../connection/firebase'; // Importar Firestore
import { doc, setDoc, collection, getDocs } from 'firebase/firestore'; // Importar funciones de Firestore
import CustomSelect from '../../../components/UI/CustomSelect';
import MapComponent from '../../../components/UI/MapComponent';

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

const AddLocationModal = ({ onClose }) => {
  const [description, setDescription] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: -16.495543, lng: -68.133543 });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [distanceWarning, setDistanceWarning] = useState('');
  const [lowestAvailableId, setLowestAvailableId] = useState(null);

  const [formData, setFormData] = useState({
    Tipo0: '',
    Tipo1: '',
    Tipo2: '',
  });

  const handleMapClick = (clickedLocation) => {
    setMarkerPosition(clickedLocation);
  };

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

  const getLowestAvailableId = async () => {
    const locationsCol = collection(db, 'locations');
    const locationsSnapshot = await getDocs(locationsCol);

    const usedIds = locationsSnapshot.docs
      .map((doc) => parseInt(doc.data().id))
      .filter((id) => !isNaN(id));

    let lowestId = 1;
    while (usedIds.includes(lowestId)) {
      lowestId++;
    }
    setLowestAvailableId(lowestId.toString());
  };

  useEffect(() => {
    getLowestAvailableId();
  }, []);

  const handleSaveLocation = async () => {
    if (!selectedClient || !description || !formData.Tipo0 || !formData.Tipo1 || !formData.Tipo2) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().replace(/[:.]/g, '_');
      const locationId = `${selectedClient.label}_${formattedDate}`;

      await setDoc(doc(db, 'locations', locationId), {
        client: selectedClient.label,
        id: lowestAvailableId,
        Direccion: description,
        location: {
          lat: markerPosition.lat,
          lng: markerPosition.lng,
        },
        Tipo: [formData.Tipo0, formData.Tipo1, formData.Tipo2],
        state: 'Construccion',
        createdAt: currentDate,
      });

      onClose();
    } catch (error) {
      console.error('Error al guardar la ubicación:', error);
      alert('Ocurrió un error al guardar la ubicación. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] h-[90%] text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Agregar Ubicación</h2>
          <button className="text-red-500" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div>
          <label>Seleccionar Cliente</label>
          <CustomSelect
            collectionName="clients"
            onChange={(option) => setSelectedClient(option)}
            selectedValue={selectedClient}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label className="mb-2 font-semibold text-black">Dirección</label>
          <input
            className="p-2 border rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

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

        <div className="bg-white p-6 rounded-lg shadow-lg h-[20%] text-black">
          <MapComponent
            mapCenter={markerPosition}
            markerPosition={markerPosition}
            handleMapClick={handleMapClick}
            setButtonDisabled={setIsButtonDisabled}
          />
        </div>

        {distanceWarning && <p className="text-red-500">{distanceWarning}</p>}

        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4"
          disabled={isButtonDisabled}
          onClick={handleSaveLocation}
        >
          Guardar Ubicación
        </button>
      </div>
    </div>
  );
};

export default React.memo(AddLocationModal);
