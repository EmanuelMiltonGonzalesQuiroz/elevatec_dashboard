import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const Selects = ({ handleAddItem }) => {
  const [liftsData, setLiftsData] = useState([]);
  const [carLiftsData, setCarLiftsData] = useState([]);
  const [forkliftsData, setForkliftsData] = useState([]);
  const [escalatorsData, setEscalatorsData] = useState([]);
  const [liftClasses, setLiftClasses] = useState([]);
  const [selectedLiftClass, setSelectedLiftClass] = useState(null);
  const [selectedLiftFloor, setSelectedLiftFloor] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null); // Solo puede haber un plan seleccionado
  const [selectedCarLift, setSelectedCarLift] = useState(null);
  const [selectedForklift, setSelectedForklift] = useState(null);
  const [selectedEscalator, setSelectedEscalator] = useState(null);
  const [setOtros] = useState([]); // Para almacenar los elementos sin basePrice

  const planesOptions = [
    { name: 'Trimensual', note: 'Alta demanda de uso: Hosp.Publicos, Edif. Judiciales, Hoteles de Alta Rent.' },
    { name: 'Bimensual', note: 'Edif. Alto flujo, Bancos, Comerciales de Alta Rent, Edif. Gubernamentales, Univ.' },
    { name: 'Mensual', note: 'Todos los Edificios que superen el 61% de uso del Edif.' },
    { name: 'Bimestral', note: 'Edif. Que NO superen el 60% de uso del Edif.' },
    { name: 'Trimestral', note: 'Edif. Que NO supere el 30% de uso del edificio O no viva nadie en el.' },
  ];

  const fetchLiftsData = async () => {
    const liftsCollection = collection(db, 'lifts_m');
    const liftSnapshot = await getDocs(liftsCollection);

    const data = {};
    const classes = new Set();

    liftSnapshot.docs.forEach((doc) => {
      const liftType = doc.id;
      classes.add(liftType);
      const items = doc.data().items || [];
      items.forEach((item) => {
        const { pisos, precio } = item;
        if (!data[pisos]) {
          data[pisos] = {};
        }
        data[pisos][liftType] = { price: precio, liftType, class: liftType, docId: doc.id, index: item.index };
      });
    });

    const sortedData = Object.keys(data)
      .sort((a, b) => a - b)
      .map((piso) => ({
        pisos: piso,
        ...data[piso],
      }));

    setLiftsData(sortedData);
    setLiftClasses([...classes]);
  };

  const fetchCollectionData = async (collectionName, setData, itemKey, priceKey) => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const data = [];

    snapshot.docs.forEach((doc) => {
      const docData = doc.data();
      data.push({ item: docData[itemKey], price: docData[priceKey] });
    });

    setData([...data].sort((a, b) => a.item - b.item));
  };

  const addItemToTable = (type, floor, price, liftClass = null) => {
    if (!price || price === 0) {
      // Si no tiene basePrice, agregarlo a la variable otros
      setOtros((prevOtros) => [...prevOtros, { type, floor, class: liftClass }]);
    } else {
      handleAddItem({ type, floor, basePrice: price, finalPrice: price, class: liftClass });
    }
  };

  const handlePlanSelection = (planName) => {
    // Eliminar cualquier otro plan previamente seleccionado de selectedItems
    handleAddItem((prevItems) => prevItems.filter((item) => item.type !== 'Plan'));
    
    // Agregar el nuevo plan
    handleAddItem({ type: 'Plan', plan: planName });
    setSelectedPlan(planName);
  };

  // Definir renderSelectField para evitar el error de "no-undef"
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
            <option key={index} value={option.item}>
              {option.item}
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

  useEffect(() => {
    fetchLiftsData();
    fetchCollectionData('car_lifts_m', setCarLiftsData, 'pisos', 'precios');
    fetchCollectionData('forklifts_m', setForkliftsData, 'pisos', 'precios');
    fetchCollectionData('escalator_m', setEscalatorsData, 'metros', 'precios');
  }, []);

  return (
    <div className="min-h-[85vh] max-h-[86vh] w-1/4 bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Seleccionar Datos</h2>

      {/* Clase de Ascensor */}
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

      {/* Select para Ascensor Pisos */}
      {renderSelectField(
        'Ascensor Pisos',
        liftsData.map((item) => ({ item: item.pisos, price: item[selectedLiftClass]?.price })),
        selectedLiftFloor,
        setSelectedLiftFloor,
        () => {
          const selectedItem = liftsData.find((item) => item.pisos === selectedLiftFloor);
          const price = selectedItem?.[selectedLiftClass]?.price || 0;
          addItemToTable('ASC', selectedLiftFloor, price, selectedLiftClass);
        },
        true,
        !selectedLiftClass
      )}

      {/* Select para Monta Coches Pisos */}
      {renderSelectField(
        'Monta Coches Pisos',
        carLiftsData,
        selectedCarLift,
        setSelectedCarLift,
        () => {
            const selectedItem = carLiftsData.find((item) => item.item === parseInt(selectedCarLift)); // Busca en "item" y convierte a entero
            const price = selectedItem?.price || 0; // Valor predeterminado si no encuentra el precio

            addItemToTable('MCS', selectedCarLift, price);
        }
      )}

      {/* Select para Montacargas Pisos */}
      {renderSelectField(
        'Montacargas Pisos',
        forkliftsData,
        selectedForklift,
        setSelectedForklift,
        () => {
          const selectedItem = forkliftsData.find((item) => item.item === parseInt(selectedForklift));
          const price = selectedItem?.price || 0;
          addItemToTable('MCG', selectedForklift, price);
        }
      )}

      {/* Select para Escalera Mecánica Metros */}
      {renderSelectField(
        'Escalera Mecánica Metros',
        escalatorsData,
        selectedEscalator,
        setSelectedEscalator,
        () => {
          const selectedItem = escalatorsData.find((item) => item.item === parseInt(selectedEscalator));
          const price = selectedItem?.price || 0;
          addItemToTable('ESM', selectedEscalator, price);
        }
      )}

      {/* Select para Planes */}
      <div className="mb-4">
        <label className="block mb-2 font-bold text-gray-700">Planes</label>
        <div className="space-y-2">
          {planesOptions.map((plan, index) => (
            <div key={index} className="flex items-start">
              <input
                type="radio"
                id={`plan-${plan.name}`}
                name="plan"
                checked={selectedPlan === plan.name}
                onChange={() => handlePlanSelection(plan.name)}
                className="mr-2 mt-1"
              />
              <div>
                <label htmlFor={`plan-${plan.name}`} className="font-semibold text-gray-700">
                  {plan.name}
                </label>
                <p className="text-gray-500 text-sm">{plan.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Selects;
