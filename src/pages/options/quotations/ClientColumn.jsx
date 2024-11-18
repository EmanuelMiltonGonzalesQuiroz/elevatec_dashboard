import React, { useEffect, useState } from 'react';
import CustomSelect from '../../../components/UI/CustomSelect';
import { clientColumnText } from '../../../components/common/Text/texts';
import NewClientModal from './NewClientModal';
import MapComponent from './ClientColumn/MapComponent';
import logo from '../../../assets/images/COTA LOGO/elevatec_logo_sin_fondo.png';
import { geocodeAddress } from '../../../components/layout/geocodeAddress';

const ClientColumn = ({
  formData,
  setFormData,
  handleGenerateQuotation,
  handleReset,
  handleClientChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [numCuotas, setNumCuotas] = useState(0); // Default is 1 cuota
  const [cuotas, setCuotas] = useState([{ nombre: '', porcentaje: 100 }]); 
  const [markerPosition, setMarkerPosition] = useState({ lat: -16.495543, lng: -68.133543 }); // Estado local para el marcador


  // Function to update formData
  const updateFormData = (field, value) => {
    setFormData({ [field]: value });
  };
  useEffect(() => {
    const fetchGeocoding = async () => {
      if (formData['Ubicacion_nombre']) {
        try {
          await geocodeAddress(formData['Ubicacion_nombre'], markerPosition, (newLocation) => {
            handleClientChange('Ubicacion', newLocation); // Actualizar en formData
            setMarkerPosition(newLocation); // Actualizar posición en el mapa
          });
        } catch (error) {
          setLocationError('Error al obtener la ubicación.');
        }
      }
    };
    fetchGeocoding();
  }, [formData['Ubicacion_nombre']]);

  

  // Shared field handlers
  const handleVendedorChange = (e) => {
    const vendedor = e.target.value;
    handleClientChange('Vendedor', vendedor); // Update shared field across all quotations
  };

  const handleClientSelect = (option) => {
    handleClientChange('02_CLIENTE', option.label); // Update shared field across all quotations
  };

  const handleStateCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    handleClientChange('Para_el_Estado', isChecked ? 'Sí' : 'No');
  };

  const handleStateValueChange = (e) => {
    const value = Math.max(0, e.target.value);
    handleClientChange('Estado', value);
  };

  const handleInterpisosCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    updateFormData('Interpisos', isChecked ? 'Sí' : 'No');
  };
  

  const handleMapClick = (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    handleClientChange('Ubicacion', location);
    setLocationError('');
  };
  

  const handleLocationNameChange = (e) => {
    const newName = e.target.value;
    handleClientChange('Ubicacion_nombre', newName);
  };

  const handleResetAll = () => {
    handleReset();
    setLocationError('');
    setIsButtonDisabled(false);
  };
// Manejar el cambio de número de cuotas
// Manejar el cambio de número de cuotas
const handleNumCuotasChange = (e) => {
  const value = parseInt(e.target.value, 10) || 1; // Si el campo está vacío, asigna 1

  // Limitar el valor de cuotas entre 1 y 30
  const cuotasNum = Math.max(1, Math.min(30, value));
  setNumCuotas(cuotasNum);

  // Actualizar cuotas según el número seleccionado
  if (cuotasNum === 1) {
    setCuotas([{ nombre: 'Descuento', porcentaje: 0 }]);
  } else {
    const cuotasArray = Array.from({ length: cuotasNum }, (_, i) => ({
      nombre: `Cuota ${i + 1}`,
      porcentaje: parseFloat((100 / cuotasNum).toFixed(2)),  // Inicializa los porcentajes con 2 decimales
    }));
    setCuotas(cuotasArray);
  }

  // Guardar el número de cuotas y las cuotas en formData
  handleClientChange('MetodoDePago', cuotas);
};


// Manejar el cambio de las cuotas
// Manejar el cambio de las cuotas
const handleCuotaChange = (index, field, value) => {
  const updatedCuotas = [...cuotas];
  updatedCuotas[index][field] =
    field === 'porcentaje'
      ? parseFloat(Math.max(0, Math.min(100, parseFloat(value) || 0)).toFixed(2))  // Asegura solo 2 decimales
      : value;

  setCuotas(updatedCuotas);

  // Guardar automáticamente los cambios en formData
  handleClientChange('MetodoDePago', updatedCuotas);
};


// Validar que la suma de porcentajes sea 100
const validateCuotas = () => {
  const totalPercentage = cuotas.reduce(
    (sum, cuota) => sum + parseFloat(cuota.porcentaje.toFixed(2)),
    0
  );
  return Math.abs(100 - totalPercentage) <= 0.02;
};
const handleBuildingNameChange = (e) => {
  const buildingName = e.target.value;
  handleClientChange('NombreEdificio', buildingName);
};

const handleWarrantyTimeChange = (e) => {
  const warrantyTime = Math.max(0, parseInt(e.target.value, 10) || 0); // Ensure positive integer
  handleClientChange('TiempoGarantia', warrantyTime);
  console.log(formData)
};


  return (
    <div className="flex flex-col ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow overflow-auto max">
        {/* Left Column */}
        <div className="flex flex-col">
          <img src={logo} alt="Logo" className="w-full" />

          {/* Vendedor (Seller) - Shared Field */}
          <label htmlFor="vendedorName" className="mb-2 font-semibold text-black mt-4">
            {clientColumnText.seller}
          </label>
          <input
            type="text"
            placeholder={clientColumnText.seller}
            value={formData['Vendedor'] || ''}
            onChange={handleVendedorChange}
            className="p-3 border-2 border-gray-300 rounded-lg w-full"
          />
 
          {/* Payment Method - Independent Field */}
          <label htmlFor="paymentMethod" className="mt-4 font-semibold text-black">
            Forma de Pago
          </label>
          <div className="flex flex-col space-y-2">
          <label htmlFor="numCuotas" className="font-semibold text-black">
            Número de cuotas:
          </label>
          <input
            type="number"
            id="numCuotas"
            placeholder={1}
            value={numCuotas}
            onChange={handleNumCuotasChange}
            className="p-2 border-2 border-gray-300 rounded-lg"
            min="1"
            max="30"
          />

          {cuotas.map((cuota, index) => (
            <div key={index} className="flex items-center mt-2">
              {/* Número de cuota */}
              <span className="mr-2">{index + 1}.</span>

              {/* Nombre de la cuota */}
              <input
                type="text"
                placeholder={`Nombre de la cuota ${index + 1}`}
                value={cuota.nombre}
                onChange={(e) => handleCuotaChange(index, 'nombre', e.target.value)}
                className="p-2 border-2 border-gray-300 rounded-lg w-full mr-2"
              />

              {/* Porcentaje */}
              <input
                type="number"
                step="0.01"  // Permitir decimales
                placeholder="Porcentaje"
                value={cuota.porcentaje}  // No redondear aquí
                onChange={(e) => handleCuotaChange(
                  index,
                  'porcentaje',
                  cuota.nombre.toLowerCase() === 'descuento' ? e.target.value : Math.max(0, Math.min(100, e.target.value))
                )}
                className="p-2 border-2 border-gray-300 rounded-lg w-20"
                min={cuota.nombre.toLowerCase() === 'descuento' ? undefined : "0"}
                max={cuota.nombre.toLowerCase() === 'descuento' ? undefined : "100"}
              />
              <span className="ml-1">%</span>
            </div>
          ))}

          {/* Condición para mostrar el mensaje según el número de cuotas */}
          {cuotas.length > 1 ? (
            <div className={`mt-4 font-bold ${validateCuotas() ? 'text-green-600' : 'text-red-600'}`}>
              Suma total de porcentajes:
              {(() => {
                const totalPercentage = cuotas.reduce(
                  (sum, cuota) => sum + parseFloat(cuota.porcentaje),
                  0
                );
                return Math.abs(100 - totalPercentage) <= 0.01 ? '100.00' : totalPercentage.toFixed(2);
              })()}%
            </div>
          ) : (
            numCuotas!==0 && (
              <div className="mt-4 font-bold text-red-600">
                Se está descontando {cuotas[0].porcentaje}% del costo final
              </div>
            )
          )}

        </div>
          {/* State Checkbox - Independent Field */}
          <label className="mt-4 text-black font-semibold">
            <input
              type="checkbox"
              checked={formData['Para_el_Estado'] === 'Sí'}
              onChange={handleStateCheckboxChange}
              className="mr-2"
            />
            Etiquetar únicamente si la cotización es para una identidad estatal
          </label>

          {formData['Para_el_Estado'] === 'Sí' && (
            <input
              type="number"
              min="0"
              value={formData['Estado'] || ''}
              onChange={handleStateValueChange}
              className="mt-2 p-3 border-2 border-gray-300 rounded-lg w-full"
              placeholder="Ingrese un valor mayor a 0"
            />
          )}

          {/* Interpisos Checkbox - Independent Field */}
          <label className="mt-4 text-black font-semibold">
            <input
              type="checkbox"
              checked={formData['Interpisos'] === 'Sí'}
              onChange={handleInterpisosCheckboxChange}
              className="mr-2"
            />
            Controlador de pisos
          </label>
        </div>

        {/* Middle Column */}
        <div className="flex flex-col">
          {/* Cliente (Client) - Shared Field */}
          <label htmlFor="clientName" className="mb-2 font-semibold text-black">
            {clientColumnText.searchClient}
          </label>
          <div className="flex items-center">
            <CustomSelect
              collectionName="clients"
              placeholder={clientColumnText.searchClient}
              onChange={handleClientSelect}
              selectedValue={{ label: formData['02_CLIENTE'] || '' }}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-4 rounded hover:bg-green-700 transition"
              style={{ height: '39px', borderRadius: '0 4px 4px 0', marginLeft: '-2px' }}
            >
              +
            </button>
          </div>

          {/* Generate Quotation and Reset Buttons */}
          <div className="flex flex-col mt-4">
            <button
              onClick={() => handleGenerateQuotation()}
              className={`py-2 mb-2 w-full rounded transition ${
                isButtonDisabled ? 'bg-gray-500 opacity-50 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'
              } text-white`}
              disabled={isButtonDisabled}
            >
              {clientColumnText.generateQuotation}
            </button>
            <button
              onClick={handleResetAll}
              className="bg-red-500 text-white py-2 w-full rounded hover:bg-red-700 transition"
            >
              {clientColumnText.resetData}
            </button>

            {/* Location Name - Independent Field */}
            <div className="flex flex-col mt-4">
              {locationError ? (
                <div className="mt-2 text-red-500 font-semibold">{locationError}</div>
              ) : (
                <>
                  <label htmlFor="locationName" className="mt-2 font-semibold text-black text-lg">
                    Nombre de la ubicación:
                  </label>
                  <input
                    type="text"
                    id="locationName"
                    value={formData['Ubicacion_nombre'] || ''}
                    onChange={handleLocationNameChange}
                    className="mt-1 p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </>
              )}
            </div>
            <label htmlFor="buildingName" className="mt-4 font-semibold text-black">
              Nombre del Edificio:
            </label>
            <input
              type="text"
              id="buildingName"
              placeholder="Ingrese el nombre del edificio"
              value={formData['NombreEdificio'] || ''}
              onChange={(e) => handleBuildingNameChange(e)}
              className="p-3 border-2 border-gray-300 rounded-lg w-full"
            />

            {/* Tiempo de Garantía */}
            <label htmlFor="warrantyTime" className="mt-4 font-semibold text-black">
              Tiempo de Garantía (en meses):
            </label>
            <input
              type="number"
              id="warrantyTime"
              placeholder="Ingrese el tiempo de garantía en meses"
              value={formData['TiempoGarantia'] || ''}
              onChange={(e) => handleWarrantyTimeChange(e)}
              className="p-3 border-2 border-gray-300 rounded-lg w-full"
              min="0"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full h-[60vh]">
          <MapComponent
            mapCenter={markerPosition} // Posición actual del mapa
            markerPosition={markerPosition} // Posición actual del marcador
            handleMapClick={handleMapClick}
            setButtonDisabled={setIsButtonDisabled}
            address={formData['Ubicacion_nombre']}
          />
        </div>
      </div>

      {showMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-black p-2 rounded shadow-lg">
          {showMessage}
        </div>
      )}

      {isModalOpen && <NewClientModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default React.memo(ClientColumn);
