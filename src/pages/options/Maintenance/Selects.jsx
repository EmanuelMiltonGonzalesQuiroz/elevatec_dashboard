import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const Selects = ({ handleAddItem }) => {
  const [liftsData, setLiftsData] = useState([]);
  const [carLifts, setCarLifts] = useState([]);
  const [forklifts, setForklifts] = useState([]);
  const [escalators, setEscalators] = useState([]);
  const [liftClasses, setLiftClasses] = useState([]);
  const [selectedLiftClass, setSelectedLiftClass] = useState(null);
  const [selectedLiftFloor, setSelectedLiftFloor] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCarLift, setSelectedCarLift] = useState(null);
  const [selectedForklift, setSelectedForklift] = useState(null);
  const [selectedEscalator, setSelectedEscalator] = useState(null);

  const planesOptions = [
    'Trimensual',
    'Bimensual',
    'Mensual',
    'Bimestral',
    'Trimestral',
  ]; // Opciones para el select de planes

  const fetchLiftsData = async () => {
    const liftsCollection = collection(db, 'lifts_m');
    const liftSnapshot = await getDocs(liftsCollection);

    const data = {};
    const classes = new Set(); // Almacena las clases únicas

    liftSnapshot.docs.forEach(doc => {
      const liftType = doc.id; // Tipo de ascensor (ASC. 4-6, ASC. 8-10, etc.)
      classes.add(liftType); // Agrega la clase
      const items = doc.data().items || [];
      items.forEach(item => {
        const { pisos, precio } = item;
        if (!data[pisos]) {
          data[pisos] = {};
        }
        data[pisos][liftType] = { price: precio, liftType, docId: doc.id, index: item.index };
      });
    });

    const sortedData = Object.keys(data)
      .sort((a, b) => a - b)
      .map(piso => ({
        pisos: piso,
        ...data[piso],
      }));

    setLiftsData(sortedData);
    setLiftClasses([...classes]); // Establece las clases únicas
  };

  const fetchCollectionData = async (collectionName, setData, itemKey) => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const data = [];

    snapshot.docs.forEach((doc) => {
      const docData = doc.data();
      data.push(docData[itemKey]);
    });

    setData([...new Set(data)].sort((a, b) => a - b));
  };

  const renderSelectField = (label, options, value, setValue, handleAdd, isAddButton = true, isDisabled = false) => (
    <div className="mb-4">
      <label className="block mb-2 text-gray-700">{label}</label>
      <div className="flex">
        <select
          className="w-full p-2 border rounded text-black"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          disabled={isDisabled}
        >
          <option value="">Seleccione una opción</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        {isAddButton && (
          <button
            className={`px-4 py-2 rounded ml-2 ${!value ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
            onClick={handleAdd}
            disabled={!value}
          >
            +
          </button>
        )}
      </div>
    </div>
  );

  const addItemToTable = (type, floor, price) => {
    handleAddItem({ type, floor, basePrice: price, finalPrice: price });
  };

  useEffect(() => {
    fetchLiftsData(); // Obtiene los datos de "lifts_m"
    fetchCollectionData('car_lifts_m', setCarLifts, 'pisos'); // Llamada para car_lifts_m
    fetchCollectionData('forklifts_m', setForklifts, 'pisos'); // Llamada para forklifts_m
    fetchCollectionData('escalator_m', setEscalators, 'metros'); // Llamada para escalator_m
  }, []);

  return (
    <div className="min-h-[85vh] max-h-[86vh] w-1/4 bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Seleccionar Datos</h2>

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Ascensor Clase</label>
        <select
          className="w-full p-2 border rounded text-black"
          onChange={(e) => setSelectedLiftClass(e.target.value)}
          value={selectedLiftClass}
        >
          <option value="">Seleccione una clase</option>
          {liftClasses.map((liftClass, index) => (
            <option key={index} value={liftClass}>
              {liftClass}
            </option>
          ))}
        </select>
      </div>

      {renderSelectField(
        'Ascensor Pisos',
        liftsData.map(item => item.pisos),
        selectedLiftFloor,
        setSelectedLiftFloor,
        () => {
          const selectedItem = liftsData.find(item => item.pisos === selectedLiftFloor);
          const price = selectedItem[selectedLiftClass]?.price || 0;
          addItemToTable('ASC', selectedLiftFloor, price);
        },
        true,
        !selectedLiftClass
      )}

      {renderSelectField(
        'Monta Coches Pisos',
        carLifts,
        selectedCarLift,
        setSelectedCarLift,
        () => addItemToTable('MCS', selectedCarLift, 1000), // Ejemplo de precio
        true
      )}

      {renderSelectField(
        'Montacargas Pisos',
        forklifts,
        selectedForklift,
        setSelectedForklift,
        () => addItemToTable('MCG', selectedForklift, 800), // Ejemplo de precio
        true
      )}

      {renderSelectField(
        'Escalera Mecánica Metros',
        escalators,
        selectedEscalator,
        setSelectedEscalator,
        () => addItemToTable('ESM', selectedEscalator, 1200), // Ejemplo de precio
        true
      )}

      <div className="mb-4">
        <label className="block mb-2 font-bold text-gray-700">Planes</label>
        <select
          className="w-full p-2 border rounded text-black"
          onChange={(e) => setSelectedPlan(e.target.value)}
          value={selectedPlan}
        >
          <option value="">Seleccione un plan</option>
          {planesOptions.map((plan, index) => (
            <option key={index} value={plan}>
              {plan}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Selects;
