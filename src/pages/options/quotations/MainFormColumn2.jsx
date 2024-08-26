import React, { useState } from 'react';
import FetchItemsFromDocument from '../../../components/common/FetchItemsFromDocument';
import FetchDocumentNames from '../../../components/common/FetchDocumentNames';

const MainFormColumn2 = () => {
  const [cabinOptions, setCabinOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [embarkOptions, setEmbarkOptions] = useState([]);
  const [electricityOptions, setElectricityOptions] = useState([]);
  const [cabinIndicatorOptions, setCabinIndicatorOptions] = useState([]);
  const [floorIndicatorOptions, setFloorIndicatorOptions] = useState([]);
  const [tractionMachineOptions, setTractionMachineOptions] = useState([]);
  const [tractionOptions, setTractionOptions] = useState([]);
  const [speedOptions, setSpeedOptions] = useState([]);

  return (
    <div className="col-span-1 gap-4 overflow-y-auto max-h-full">
      <div>
        <label htmlFor="cabin" className="mb-2 font-semibold text-black">
          Cabina
        </label>
        <select id="cabin" className="p-2 border rounded focus:outline-none w-full mb-4">
          <FetchItemsFromDocument 
            collectionName="groups" 
            documentName="Cabina" 
            campname="nombre" 
            onDataFetched={setCabinOptions} 
          />
          {cabinOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="mb-2 font-semibold text-black">
          Ciudad
        </label>
        <select id="city" className="p-2 border rounded focus:outline-none w-full mb-4">
          <FetchItemsFromDocument 
            collectionName="groups" 
            documentName="Ciudad" 
            campname="nombre" 
            onDataFetched={setCityOptions} 
          />
          {cityOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="embark" className="mb-2 font-semibold text-black">
          Embarque
        </label>
        <select id="embark" className="p-2 border rounded focus:outline-none w-full mb-4">
          <FetchItemsFromDocument 
            collectionName="groups" 
            documentName="Embarque" 
            campname="nombre" 
            onDataFetched={setEmbarkOptions} 
          />
          {embarkOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="electricity" className="mb-2 font-semibold text-black">
          Energía Eléctrica
        </label>
        <select id="electricity" className="p-2 border rounded focus:outline-none w-full mb-4">
          <FetchItemsFromDocument 
            collectionName="groups" 
            documentName="Energia Electrica" 
            campname="nombre" 
            onDataFetched={setElectricityOptions} 
          />
          {electricityOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cabinIndicator" className="mb-2 font-semibold text-black">
          Indicador de cabina/piso
        </label>
        <select id="cabinIndicator" className="p-2 border rounded focus:outline-none w-full mb-4">
          <FetchItemsFromDocument 
            collectionName="groups" 
            documentName="Indicador de cabina_piso" 
            campname="nombre" 
            onDataFetched={setCabinIndicatorOptions} 
          />
          {cabinIndicatorOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="floorIndicator" className="mb-2 font-semibold text-black">
          Indicador de piso con botón Integrado
        </label>
        <select id="floorIndicator" className="p-2 border rounded focus:outline-none w-full mb-4">
          <FetchItemsFromDocument 
            collectionName="groups" 
            documentName="Indicador de piso con botón Integrado" 
            campname="nombre" 
            onDataFetched={setFloorIndicatorOptions} 
          />
          {floorIndicatorOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tractionMachine" className="mb-2 font-semibold text-black">
          Máquina de tracción
        </label>
        <select id="tractionMachine" className="p-2 border rounded focus:outline-none w-full mb-4">
          <FetchItemsFromDocument 
            collectionName="groups" 
            documentName="Maquina de tracción" 
            campname="nombre" 
            onDataFetched={setTractionMachineOptions} 
          />
          {tractionMachineOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="traction" className="mb-2 font-semibold text-black">
          Tracción
        </label>
        <select id="traction" className="p-2 border rounded focus:outline-none w-full mb-4">
          <FetchItemsFromDocument 
            collectionName="groups" 
            documentName="Traccion" 
            campname="nombre" 
            onDataFetched={setTractionOptions} 
          />
          {tractionOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="doors" className="mb-2 font-semibold text-black">
          Velocidad
        </label>
        <select id="doors" className="p-2 border rounded focus:outline-none w-full mb-4">
          <FetchDocumentNames 
            collectionName="motors" 
            onDataFetched={setSpeedOptions} 
          />
          {speedOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 font-semibold text-black">Nota:</label>
        <div className="p-2 border rounded bg-cyan-400">
          <p>* Edificios {'<'} a 8 pisos velocidad 1m/s</p>
          <p>* Edificios entre 7 y 15 pisos velocidad 1.5m/s</p>
          <p>* Edificios {'>'} 15 pisos velocidad 1.75m/s</p>
          <p>* Edificios {'>'} 25 pisos velocidad 2m/s</p>
        </div>
      </div>
    </div>
  );
};

export default MainFormColumn2;