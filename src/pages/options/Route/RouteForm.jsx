import React, { useState, useEffect } from 'react';
import { fetchAllCollectionsData } from './fetchAllCollectionsData';
import ClientInfo from './RouteForm/ClientInfo';
import BuildingFields from './RouteForm/BuildingFields';
import AdditionalFields from './RouteForm/AdditionalFields';
import Results from './RouteForm/Results';

const collections = [
  'configuraciones_de_ascensor',
  'puertas_tiempo_total',
  'puertas_datos',
  'velocidades_tiempos',
  'valores_de_salto',
  'puertas_info',
  'configuraciones_de_pisos',
  'configuraciones_de_edificios',
];

const RouteForm = () => {
  const [allData, setAllData] = useState({});
  const [buildingNames, setBuildingNames] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [formFields, setFormFields] = useState({});
  const [additionalFields, setAdditionalFields] = useState({
    Pasajeros: '',
    'Detencion Puertas': '',
  });
  const [vendor, setVendor] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [routeData, setRouteData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllCollectionsData(collections);
        setAllData(data);
        const edificiosData = data['configuraciones_de_edificios']?.[0]?.data || [];
        setBuildingNames(edificiosData.map((building) => building.Nombre));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleVendorChange = (value) => {
    setVendor(value);
    updateRouteData('cliente', value);
  };

  const handleClientPhoneChange = (value) => {
    setClientPhone(value);
    updateRouteData('clientPhone', value);
  };

  const handleBuildingSelect = (e) => {
    const buildingName = e.target.value;
    setSelectedBuilding(buildingName);

    const selectedBuildingInfo = allData['configuraciones_de_edificios']?.[0]?.data.find(
      (building) => building.Nombre === buildingName
    );

    setRouteData((prev) => {
      const updatedData = Array.isArray(prev) ? [...prev] : [];
      const existingBuildingIndex = updatedData.findIndex(
        (building) => building.TipoDeEdificio?.selectedBuilding === buildingName
      );

      const updatedBuildingData = {
        TipoDeEdificio: { selectedBuilding: buildingName, ...selectedBuildingInfo },
      };

      if (existingBuildingIndex !== -1) {
        updatedData[existingBuildingIndex] = { ...updatedData[existingBuildingIndex], ...updatedBuildingData };
      } else {
        updatedData[0] = updatedBuildingData; // Reemplazar siempre el primer elemento
      }

      return updatedData;
    });

    generateFields(buildingName);
  };

  const updateRouteData = (key, value) => {
    setRouteData((prev) => {
      const updatedData = Array.isArray(prev) ? [...prev] : [];
      if (updatedData.length > 0) {
        updatedData[0] = { ...updatedData[0], [key]: value }; // Reemplazar el valor en el primer elemento
      } else {
        updatedData[0] = { [key]: value }; // Crear la entrada si no existe
      }
      return updatedData;
    });
  };

  const generateFields = (buildingName) => {
    let fields = {};
    let requiredFields = [];

    if (
      ['Oficinas Centricas', 'Oficinas Suburbios', 'Edificio empresarial', 'Edificio del gobierno'].includes(
        buildingName
      )
    ) {
      fields = { PISOS: '', AREAS: '', OFICINAS: '' };
      requiredFields = ['PISOS', 'AREAS', 'OFICINAS'];
    } else if (['Departamentos Centricos', 'Departamentos Suburbios'].includes(buildingName)) {
      fields = { PISOS: '', DEPARTAMENTOS: '', HABITACIONES: '' };
      requiredFields = ['PISOS', 'DEPARTAMENTOS', 'HABITACIONES'];
    } else if (['Hospital privado', 'Hospital publico'].includes(buildingName)) {
      fields = { PISOS: '', HABITACIONES: '', CAMAS: '' };
      requiredFields = ['PISOS', 'HABITACIONES', 'CAMAS'];
    } else if (
      ['Hotel centrico', 'Hotel vacacional', 'Hotel economico', 'Hotel economico vacacional'].includes(buildingName)
    ) {
      fields = { PISOS: '', HABITACIONES: '' };
      requiredFields = ['PISOS', 'HABITACIONES'];
    } else if (buildingName === 'Estacionamiento') {
      fields = { PISOS: '', AUTOMOVILES: '' };
      requiredFields = ['PISOS', 'AUTOMOVILES'];
    }

    setFormFields(fields);
    setRouteData((prev) => {
      const updatedData = Array.isArray(prev) ? [...prev] : [];
      if (updatedData.length > 0) {
        updatedData[0].TipoDeEdificio = {
          ...updatedData[0].TipoDeEdificio,
          ...fields,
        };
        updatedData[0].requiredFields = requiredFields;
      }
      return updatedData;
    });
  };

  const handleFieldChange = (name, value) => {
    setFormFields((prev) => ({ ...prev, [name]: value }));
    updateRouteData(name, value);
  };

  const handleAdditionalFieldChange = (name, value) => {
    setAdditionalFields((prev) => ({ ...prev, [name]: value }));
    updateRouteData(name, value);
  };

  const handleCalculate = () => {
    console.log(routeData)
    // Implementar la lógica de cálculo aquí
  };

  return (
    <div className="flex flex-col p-6 rounded-lg shadow-lg w-full">
      <div className="flex flex-wrap w-full mb-4">
        <div className="md:w-1/3 w-full p-2">
          <ClientInfo
            buildingNames={buildingNames}
            selectedBuilding={selectedBuilding}
            setSelectedBuilding={setSelectedBuilding}
            vendor={vendor}
            setVendor={handleVendorChange}
            clientPhone={clientPhone}
            setClientPhone={handleClientPhoneChange}
            handleBuildingSelect={handleBuildingSelect}
          />
        </div>
        <div className="md:w-1/3 w-full p-2">
          <BuildingFields formFields={formFields} handleFieldChange={handleFieldChange} />
        </div>
        <div className="md:w-1/3 w-full p-2">
          <AdditionalFields
            additionalFields={additionalFields}
            handleAdditionalFieldChange={handleAdditionalFieldChange}
          />
        </div>
      </div>

      <div className="w-full p-4">
        <Results
          onCalculate={handleCalculate}
          routeData={routeData}
          setRouteData={setRouteData}
          allData={allData}
        />
      </div>
    </div>
  );
};

export default RouteForm;
