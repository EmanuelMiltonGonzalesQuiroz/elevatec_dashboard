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
  const [vendor, setVendor] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [routeData, setRouteData] = useState([]);
  const [additionalFields, setAdditionalFields] = useState({
    Pasajeros: '',
    'Detencion Puertas': '',
    Garaje: false,
  });

  // Estados adicionales para manejar reset en componentes hijos
  const [resetBuildingFields, setResetBuildingFields] = useState(false);

  // Función para reiniciar los campos
  const resetFields = () => {
    setVendor('');
    setClientPhone('');
    setRouteData([]);
    setAdditionalFields({
      Pasajeros: '',
      'Detencion Puertas': '',
      Garaje: false,
    });
    setResetBuildingFields(true); // Indicar a BuildingFields que se reinicie
  };

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

  const updateRouteData = (key, value) => {
    setRouteData((prev) => {
      const updatedData = Array.isArray(prev) ? [...prev] : [];
      if (updatedData.length > 0) {
        if (value === null) {
          delete updatedData[0][key];
        } else {
          updatedData[0] = { ...updatedData[0], [key]: value };
        }
      } else {
        if (value !== null) {
          updatedData[0] = { [key]: value };
        }
      }
      return updatedData;
    });
  };

  const handleAdditionalFieldChange = (name, value) => {
    setAdditionalFields((prev) => ({ ...prev, [name]: value }));
    updateRouteData(name, value);
  };

  // Restablecer resetBuildingFields después de que BuildingFields haya sido reiniciado
  const handleBuildingFieldsReset = () => {
    setResetBuildingFields(false);
  };

  return (
    <div className="flex flex-col p-6 rounded-lg shadow-lg w-full">
      <div className="grid space-y-4">
        <div className="w-full p-2">
          <ClientInfo
            vendor={vendor}
            setVendor={handleVendorChange}
            clientPhone={clientPhone}
            setClientPhone={handleClientPhoneChange}
          />
        </div>
        <div className="w-full lg:flex grid gp-4">
          <BuildingFields
            formFields={{ PISOS: '', DEPARTAMENTOS: '' }}
            handleFieldChange={updateRouteData}
            buildingNames={buildingNames}
            allData={allData}
            routeData={routeData}
            reset={resetBuildingFields}
            onResetComplete={handleBuildingFieldsReset}
          />
          <AdditionalFields
            additionalFields={additionalFields}
            handleAdditionalFieldChange={handleAdditionalFieldChange}
          />
        </div>
      </div>

      <div className="w-full p-4">
        <Results
          routeData={routeData}
          setRouteData={setRouteData}
          allData={allData}
          resetFields={resetFields} // Pasamos resetFields a Results
        />
      </div>
    </div>
  );
};

export default RouteForm;
