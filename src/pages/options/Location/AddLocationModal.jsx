import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import { db } from '../../../connection/firebase'; // Importar Firestore
import { doc, setDoc, collection, getDocs } from 'firebase/firestore'; // Importar funciones de Firestore
import CustomSelect from '../../../components/UI/CustomSelect';
import MapComponent from '../../../components/UI/MapComponent';
import { geocodeAddress } from '../../../components/layout/geocodeAddress';
 
const typeOptions = {
  Construccion: [
    { id: 'CA', label: 'C. ASCENSORES' },
    { id: 'CM', label: 'C. MONTA COCHES' },
    { id: 'CE', label: 'C. ESCALERAS MECANIMAS' },
    { id: 'C.MC', label: 'C. MONTA CARGAS' },
  ],
  Mantenimiento: [
    { id: 'MA', label: 'M. ASCENSORES' },
    { id: 'MM', label: 'M. MONTA COCHES' },
    { id: 'ME', label: 'M. ESCALERAS MECANIMAS' },
    { id: 'M.MC', label: 'M. MONTA CARGAS' },
  ],
  Modernizacion: [
    { id: 'MMA', label: 'M. ASCENSORES' },
    { id: 'MMM', label: 'M. MONTA COCHES' },
    { id: 'MME', label: 'M. ESCALERAS MECANIMAS' },
    { id: 'ME.MC', label: 'M. MONTA CARGAS' },
  ],
  Competencia: [
    { id: 'CO', label: 'COMPETENCIA' }, // Solo una opción para este tipo
  ],
};

const AddLocationModal = ({ onClose }) => {
  const [description, setDescription] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: -16.495543, lng: -68.133543 });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [distanceWarning, setDistanceWarning] = useState('');
  const [nextAvailableId, setNextAvailableId] = useState(null); // Renombrado para mayor claridad

  const [formData, setFormData] = useState({
    Tipo0: '',
    Tipo1: '',
    Tipo2: '',
  });

  useEffect(() => {
    const fetchGeocoding = async () => {
      try {
        await geocodeAddress(description, markerPosition, setMarkerPosition);
      } catch (error) {
      }
    };
    fetchGeocoding();
  }, [description, markerPosition, setMarkerPosition]);
  

  const handleMapClick = (clickedLocation) => {
    setMarkerPosition(clickedLocation);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === 'Tipo2' && {
        Tipo1: typeOptions[prevData.Tipo0]?.find((option) => option.label === value)?.id || '',
      }),
    }));
  };

  // Función corregida para obtener el siguiente ID disponible
  const getNextAvailableId = async () => {
    try {
      const locationsCol = collection(db, 'locations');
      const snapshot = await getDocs(locationsCol);
      const numericIds = snapshot.docs
        .map((doc) => doc.data().id)
        .filter((id) => typeof id === 'number');
      const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
      const proposedId = maxId + 1;
      setNextAvailableId(proposedId);
    } catch (e) {
      console.error("Error al obtener el siguiente ID disponible: ", e);
      alert("Error al obtener el siguiente ID disponible. Por favor, intenta nuevamente.");
    }
  };

  useEffect(() => {
    getNextAvailableId();
  }, []);

  const handleSaveLocation = async () => {
    if (!selectedClient || !description || !formData.Tipo0 || !formData.Tipo1 || !formData.Tipo2) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (nextAvailableId === null) {
      alert('No se ha podido obtener el ID disponible. Intenta nuevamente.');
      return;
    }

    try {
      // Buscar el clientId basado en el nombre del cliente seleccionado
      const clientsCollection = collection(db, 'clients');
      const clientsSnapshot = await getDocs(clientsCollection);

      // Encontrar el documento del cliente que coincide con el nombre seleccionado
      const clientDoc = clientsSnapshot.docs.find(
        (doc) => doc.data().name === selectedClient.label
      );

      if (!clientDoc) {
        alert('No se pudo encontrar el ID del cliente.');
        return;
      }

      const clientId = clientDoc.id; // Obtener el clientId del documento del cliente

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().replace(/[:.]/g, '_');
      const locationId = `${selectedClient.label}_${formattedDate}`;

      // Guardar la ubicación con el ID disponible
      await setDoc(doc(db, 'locations', locationId), {
        client: selectedClient.label,
        clientId: clientId, // Guardar el clientId en el documento de ubicación
        id: nextAvailableId, // Usar el ID numérico disponible
        Direccion: description,
        location: {
          lat: markerPosition.lat,
          lng: markerPosition.lng,
        },
        Tipo: [formData.Tipo0, formData.Tipo1, formData.Tipo2],
        state: formData.Tipo0 || 'Construccion', // Estado basado en el tipo
        createdAt: currentDate,
      });

      onClose();
    } catch (error) {
      console.error('Error al guardar la ubicación:', error);
      alert('Ocurrió un error al guardar la ubicación. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-top sm:items-center sm:justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[45vh] sm:max-w-[80vh] md:w-[90vh] h-[90vh] text-black overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold">Agregar Ubicación</h2>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg h-[45%] text-black">
        <MapComponent
          mapCenter={markerPosition}
          markerPosition={markerPosition}
          handleMapClick={handleMapClick}
          address={description}  // Aquí pasamos la dirección como prop
          setButtonDisabled={setIsButtonDisabled}
        />

        </div>

        {distanceWarning && <p className="text-red-500">{distanceWarning}</p>}

        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4 w-full sm:w-auto"
          disabled={isButtonDisabled || nextAvailableId === null}
          onClick={handleSaveLocation}
        >
          Guardar Ubicación
        </button>
      </div>
    </div>
  );
};

export default React.memo(AddLocationModal);
