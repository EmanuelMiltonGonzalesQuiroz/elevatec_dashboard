import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../connection/firebase';
import CustomSelect from '../../../../components/UI/CustomSelect';

const Selects = ({ handleAddItem }) => {
  const [liftsData, setLiftsData] = useState([]);
  const [carLiftsData, setCarLiftsData] = useState([]);
  const [forkliftsData, setForkliftsData] = useState([]);
  const [escalatorsData, setEscalatorsData] = useState([]);
  const [liftClasses, setLiftClasses] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedLiftClass, setSelectedLiftClass] = useState(null);
  const [selectedLiftFloor, setSelectedLiftFloor] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null); // Solo puede haber un plan seleccionado
  const [selectedCarLift, setSelectedCarLift] = useState(null);
  const [selectedForklift, setSelectedForklift] = useState(null);
  const [planesOptions, setPlanesOptions] = useState([]); // Para almacenar las opciones de planes
  const [selectedEscalator, setSelectedEscalator] = useState(null);
  const [otros, setOtros] = useState([]); // Para almacenar los elementos sin basePrice

  const fetchPlanesOptions = async () => {
    try {
      const planesCollection = collection(db, 'planes');
      const planesSnapshot = await getDocs(planesCollection);

      const fetchedPlanesOptions = planesSnapshot.docs.flatMap(doc => {
        const docData = doc.data();
        if (docData.data && Array.isArray(docData.data)) {
          return docData.data.map(plan => ({
            name: plan.name,
            note: plan.note,
          }));
        }
        return [];
      });

      setPlanesOptions(fetchedPlanesOptions); // Actualiza el estado con los planes
    } catch (error) {
      console.error('Error fetching planes: ', error);
    }
  };

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
      // Si no hay precio base, añadir a "otros"
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

  // Renderización de select con manejo de estado
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

  const handleClientChange = (selectedClient) => {
    setSelectedClient(selectedClient); // Actualizar el estado del cliente seleccionado
    handleAddItem({ type: 'Client', client: selectedClient }); // Añadir a la tabla el cliente seleccionado
  };

  useEffect(() => {
    fetchPlanesOptions(); // Cargar planes cuando el componente se monte
    fetchLiftsData();
    fetchCollectionData('car_lifts_m', setCarLiftsData, 'pisos', 'precios');
    fetchCollectionData('forklifts_m', setForkliftsData, 'pisos', 'precios');
    fetchCollectionData('escalator_m', setEscalatorsData, 'metros', 'precios');
  }, []);

  return (
    <div className="min-h-[85vh] max-h-[112vh] md:w-1/4 min-w-60 bg-white p-4 rounded-lg shadow-lg overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Seleccionar Datos</h2>
 
      <CustomSelect
        collectionName="clients"
        placeholder="Buscar Cliente"
        onChange={(option) => handleClientChange(option)}
        selectedValue={selectedClient}
      />

      <div className="mb-4">
        <label className="block mb-2 text-gray-700">Ascensor Clase</label>
        <select
          className="w-full p-2 border rounded text-black"
          onChange={(e) => {
            const selectedClass = e.target.value;
            setSelectedLiftClass(selectedClass);
            addItemToTable('Ascensor Clase', null, 0, selectedClass); // Añadir a la tabla con el nombre de clase
          }}
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
          const selectedItem = carLiftsData.find((item) => item.item === parseInt(selectedCarLift));
          const price = selectedItem?.price || 0;
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
