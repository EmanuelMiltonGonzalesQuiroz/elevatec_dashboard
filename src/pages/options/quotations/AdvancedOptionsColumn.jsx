import React from 'react';

const AdvancedOptionsColumn = () => (
  <div className="col-span-1 grid grid-cols-1 gap-4">
    <label className="text-black font-bold">Opciones avanzadas</label>
    <div>
      <input type="checkbox" id="aire" />
      <label htmlFor="aire" className="ml-2">Aire acondicionado</label>
    </div>
    <div>
      <input type="checkbox" id="soloBoton" />
      <label htmlFor="soloBoton" className="ml-2">Indicador de solo botón</label>
    </div>
    <div>
      <input type="checkbox" id="pesacarga" />
      <label htmlFor="pesacarga" className="ml-2">Pesacarga</label>
    </div>
    <div>
      <input type="checkbox" id="prePuertas" />
      <label htmlFor="prePuertas" className="ml-2">Pre Apertura de puertas</label>
    </div>
    <div>
      <input type="checkbox" id="regenerador" />
      <label htmlFor="regenerador" className="ml-2">Regenerador de energía</label>
    </div>
    <div>
      <input type="checkbox" id="monitoreo" />
      <label htmlFor="monitoreo" className="ml-2">Sistema de monitoreo</label>
    </div>
    <div>
      <input type="checkbox" id="ventilacion" />
      <label htmlFor="ventilacion" className="ml-2">Ventilación</label>
    </div>
    <div>
      <label htmlFor="doors" className="mb-2 font-semibold text-black">
        Puertas
      </label>
      <select id="doors" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="AP.LAT 2 HOJAS 800mm">AP.LAT 2 HOJAS 800mm</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="ard" className="mb-2 font-semibold text-black">
        ARD
      </label>
      <select id="ard" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="No requiere!">No requiere!</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="cabinFinish" className="mb-2 font-semibold text-black">
        Acabado puerta de cabina
      </label>
      <select id="cabinFinish" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Inoxidable">Inoxidable</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="additionalMirror" className="mb-2 font-semibold text-black">
        Espejo Adicional
      </label>
      <input
        type="number"
        id="additionalMirror"
        min="0"
        className="p-2 border rounded focus:outline-none w-full mb-4"
      />
    </div>
    <div>
      <label htmlFor="horizontalFloorIndicator" className="mb-2 font-semibold text-black">
        Indicador de piso horizontal
      </label>
      <select id="horizontalFloorIndicator" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="LCD">LCD</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="cardReader" className="mb-2 font-semibold text-black">
        Lector de tarjetas
      </label>
      <select id="cardReader" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="No Requiere">No Requiere</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="additionalHandrail" className="mb-2 font-semibold text-black">
        Pasamanos adicional
      </label>
      <input
        type="number"
        id="additionalHandrail"
        min="0"
        className="p-2 border rounded focus:outline-none w-full mb-4"
      />
    </div>
    <div>
      <label htmlFor="floor" className="mb-2 font-semibold text-black">
        Piso
      </label>
      <select id="floor" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Granito">Granito</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="subCeiling" className="mb-2 font-semibold text-black">
        SubTecho
      </label>
      <select id="subCeiling" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="t-3">t-3</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="type" className="mb-2 font-semibold text-black">
        Tipo
      </label>
      <select id="type" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Sin sala MRL">Sin sala MRL</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="controlPanel" className="mb-2 font-semibold text-black">
        Tipo de botonera
      </label>
      <select id="controlPanel" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Acero inoxidable">Acero inoxidable</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="cabinButtons" className="mb-2 font-semibold text-black">
        Tipo de botones en cabina
      </label>
      <select id="cabinButtons" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Antivandalicos">Antivandalicos</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="floorButtons" className="mb-2 font-semibold text-black">
        Tipo de botones en piso
      </label>
      <select id="floorButtons" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Antivandalicos">Antivandalicos</option>
        {/* Agrega más opciones según sea necesario */}
      </select>
    </div>
    <div>
      <label htmlFor="locks" className="mb-2 font-semibold text-black">
        Llavines con llave
      </label>
      <input
        type="number"
        id="locks"
        min="0"
        className="p-2 border rounded focus:outline-none w-full mb-4"
      />
    </div>
  </div>
);

export default AdvancedOptionsColumn;
