import React, { useState } from 'react';
import { advancedOptionsText } from '../../../components/common/Text/texts';
import FetchFieldFromCollection from '../../../components/common/FetchFieldFromCollection';
import FetchDocumentNames from '../../../components/common/FetchDocumentNames';
import FetchItemsFromDocument from '../../../components/common/FetchItemsFromDocument';

const AdvancedOptionsColumn = () => {
  const [elements, setElements] = useState([]);
  const [doors, setDoors] = useState([]);
  const [ardOptions, setArdOptions] = useState([]);
  const [cabinFinishOptions, setCabinFinishOptions] = useState([]);
  const [additionalMirrorOptions, setAdditionalMirrorOptions] = useState([]);
  const [horizontalFloorIndicatorOptions, setHorizontalFloorIndicatorOptions] = useState([]);
  const [cardReaderOptions, setCardReaderOptions] = useState([]);
  const [additionalHandrailOptions, setAdditionalHandrailOptions] = useState([]);
  const [floorOptions, setFloorOptions] = useState([]);
  const [subCeilingOptions, setSubCeilingOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [controlPanelOptions, setControlPanelOptions] = useState([]);
  const [cabinButtonsOptions, setCabinButtonsOptions] = useState([]);
  const [floorButtonsOptions, setFloorButtonsOptions] = useState([]);

  return (
    <div className="col-span-1 grid grid-cols-1 gap-4 overflow-y-auto max-h-full text-black">
      <label className="text-black font-bold">{advancedOptionsText.title}</label>

      <FetchFieldFromCollection 
        collectionName="elements" 
        fieldName="name" 
        onDataFetched={setElements} 
      />

      {elements.map((element, index) => (
        <div key={index}>
          <input type="checkbox" id={element} />
          <label htmlFor={element} className="ml-2">{element}</label>
        </div>
      ))}

      <div>
        <label htmlFor="doors" className="mb-2 font-semibold text-black">
          {advancedOptionsText.doors}
        </label>
        <select id="doors" className="p-2 border rounded focus:outline-none w-full mb-4">
          <FetchDocumentNames 
            collectionName="doors" 
            onDataFetched={setDoors} 
          />
          {doors.map((door, index) => (
            <option key={index} value={door}>
              {door}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="ARD" 
        campname="nombre" 
        onDataFetched={setArdOptions} 
      />
      <div>
        <label htmlFor="ard" className="mb-2 font-semibold text-black">
          {advancedOptionsText.ard}
        </label>
        <select id="ard" className="p-2 border rounded focus:outline-none w-full mb-4">
          {ardOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="Acabado puerta de cabina" 
        campname="nombre" 
        onDataFetched={setCabinFinishOptions} 
      />
      <div>
        <label htmlFor="cabinFinish" className="mb-2 font-semibold text-black">
          {advancedOptionsText.cabinFinish}
        </label>
        <select id="cabinFinish" className="p-2 border rounded focus:outline-none w-full mb-4">
          {cabinFinishOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="Espejo Adicional" 
        campname="nombre" 
        onDataFetched={setAdditionalMirrorOptions} 
      />
      <div>
        <label htmlFor="additionalMirror" className="mb-2 font-semibold text-black">
          {advancedOptionsText.additionalMirror}
        </label>
        <select id="additionalMirror" className="p-2 border rounded focus:outline-none w-full mb-4">
          {additionalMirrorOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="Indicador de piso horizontal" 
        campname="nombre" 
        onDataFetched={setHorizontalFloorIndicatorOptions} 
      />
      <div>
        <label htmlFor="horizontalFloorIndicator" className="mb-2 font-semibold text-black">
          {advancedOptionsText.horizontalFloorIndicator}
        </label>
        <select id="horizontalFloorIndicator" className="p-2 border rounded focus:outline-none w-full mb-4">
          {horizontalFloorIndicatorOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="Lector de tarjetas" 
        campname="nombre" 
        onDataFetched={setCardReaderOptions} 
      />
      <div>
        <label htmlFor="cardReader" className="mb-2 font-semibold text-black">
          {advancedOptionsText.cardReader}
        </label>
        <select id="cardReader" className="p-2 border rounded focus:outline-none w-full mb-4">
          {cardReaderOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="Pasamanos adicional" 
        campname="nombre" 
        onDataFetched={setAdditionalHandrailOptions} 
      />
      <div>
        <label htmlFor="additionalHandrail" className="mb-2 font-semibold text-black">
          {advancedOptionsText.additionalHandrail}
        </label>
        <select id="additionalHandrail" className="p-2 border rounded focus:outline-none w-full mb-4">
          {additionalHandrailOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="Piso" 
        campname="nombre" 
        onDataFetched={setFloorOptions} 
      />
      <div>
        <label htmlFor="floor" className="mb-2 font-semibold text-black">
          {advancedOptionsText.floor}
        </label>
        <select id="floor" className="p-2 border rounded focus:outline-none w-full mb-4">
          {floorOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="SubTecho" 
        campname="nombre" 
        onDataFetched={setSubCeilingOptions} 
      />
      <div>
        <label htmlFor="subCeiling" className="mb-2 font-semibold text-black">
          {advancedOptionsText.subCeiling}
        </label>
        <select id="subCeiling" className="p-2 border rounded focus:outline-none w-full mb-4">
          {subCeilingOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="Tipo" 
        campname="nombre" 
        onDataFetched={setTypeOptions} 
      />
      <div>
        <label htmlFor="type" className="mb-2 font-semibold text-black">
          {advancedOptionsText.type}
        </label>
        <select id="type" className="p-2 border rounded focus:outline-none w-full mb-4">
          {typeOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="Tipo de botonera" 
        campname="nombre" 
        onDataFetched={setControlPanelOptions} 
      />
      <div>
        <label htmlFor="controlPanel" className="mb-2 font-semibold text-black">
          {advancedOptionsText.controlPanel}
        </label>
        <select id="controlPanel" className="p-2 border rounded focus:outline-none w-full mb-4">
          {controlPanelOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="Tipo de botones en cabina" 
        campname="nombre" 
        onDataFetched={setCabinButtonsOptions} 
      />
      <div>
        <label htmlFor="cabinButtons" className="mb-2 font-semibold text-black">
          {advancedOptionsText.cabinButtons}
        </label>
        <select id="cabinButtons" className="p-2 border rounded focus:outline-none w-full mb-4">
          {cabinButtonsOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FetchItemsFromDocument 
        collectionName="groups" 
        documentName="Tipo de botones en piso" 
        campname="nombre" 
        onDataFetched={setFloorButtonsOptions} 
      />
      <div>
        <label htmlFor="floorButtons" className="mb-2 font-semibold text-black">
          {advancedOptionsText.floorButtons}
        </label>
        <select id="floorButtons" className="p-2 border rounded focus:outline-none w/full mb-4">
          {floorButtonsOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        
      <div>
        <label htmlFor="locks" className="mb-2 font-semibold text-black">
          {advancedOptionsText.locks}
        </label>
        <select id="locks" className="p-2 border rounded focus:outline-none w-full mb-4">
          {[...Array(16).keys()].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

    </div>
    </div>
  );
};

export default AdvancedOptionsColumn;