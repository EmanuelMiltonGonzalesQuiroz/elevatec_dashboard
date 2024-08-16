import React from 'react';

const MainFormColumn2 = () => (
  <div className="col-span-1  gap-4">
    <div>
      <label htmlFor="cabin" className="mb-2 font-semibold text-black">
        Cabina
      </label>
      <select id="cabin" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Semplice">Pintado</option>
        <option value="Semplice">Semplice</option>
        <option value="Semplice">Confort</option>
        <option value="Semplice">Inoxidable</option>
        <option value="Semplice">Panoramico 1 lado</option>
        <option value="Semplice">Panoramico 2 lados</option>
        <option value="Semplice">Panoramico 3 lados</option>
      </select>
    </div>
    <div>
      <label htmlFor="city" className="mb-2 font-semibold text-black">
        Ciudad
      </label>
      <select id="city" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Cochabamba">Cochabamba</option>
        <option value="Cochabamba">Potosi</option>
        <option value="Cochabamba">Santa Cruz</option>
        <option value="Cochabamba">La Paz</option>
        <option value="Cochabamba">Oruro</option>
        <option value="Cochabamba">Tarija</option>
        <option value="Cochabamba">Sucre</option>
        <option value="Cochabamba">Beni</option>
        <option value="Cochabamba">otro</option>
      </select>
    </div>
    <div>
      <label htmlFor="embark" className="mb-2 font-semibold text-black">
        Embarque
      </label>
      <select id="embark" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Simple">Simple</option>
        <option value="Simple">Doble 90°</option>
        <option value="Simple">Doble 180°</option>
        <option value="Simple">Triple</option>
      </select>
    </div>
    <div>
      <label htmlFor="electricity" className="mb-2 font-semibold text-black">
        Energía Eléctrica
      </label>
      <select id="electricity" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="220 V Trifásico">380 V Trifásico</option>
        <option value="220 V Trifásico">220 V Trifásico</option>
      </select>
    </div>
    <div>
      <label htmlFor="cabinIndicator" className="mb-2 font-semibold text-black">
        Indicador de cabina/piso
      </label>
      <select id="cabinIndicator" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Tft7">Matriz de puntos</option>
        <option value="Tft7">LCD</option>
        <option value="Tft7">Tft4.3</option>
        <option value="Tft7">Tft7</option>
        <option value="Tft7">Tft10.4</option>
      </select>
    </div>
    <div>
      <label htmlFor="floorIndicator" className="mb-2 font-semibold text-black">
        Indicador de piso con botón Integrado
      </label>
      <select id="floorIndicator" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Tft7">Matriz de puntos</option>
        <option value="Tft7">LCD</option>
        <option value="Tft7">Tft4.3</option>
      </select>
    </div>
    <div>
      <label htmlFor="tractionMachine" className="mb-2 font-semibold text-black">
        Máquina de tracción
      </label>
      <select id="tractionMachine" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="Gearlees con imanes permanentes">Gearlees con imanes permanentes</option>
        <option value="Gearlees con imanes permanentes">Geared Con reductor</option>
      </select>
    </div>
    <div>
      <label htmlFor="traction" className="mb-2 font-semibold text-black">
        Tracción
      </label>
      <select id="traction" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="2 a 1">1 a 1</option>
        <option value="2 a 1">2 a 1</option>
      </select>
    </div>
    <div>
      <label htmlFor="speed" className="mb-2 font-semibold text-black">
        Velocidad
      </label>
      <select id="speed" className="p-2 border rounded focus:outline-none w-full mb-4">
        <option value="1m/s">1m/s</option>
        <option value="1m/s">1.5m/s</option>
        <option value="1m/s">1.75m/s</option>
        <option value="1m/s">2m/s</option>
      </select>
    </div>
    <div>
      <label className="mb-2 font-semibold text-black">Nota:</label>
      <div className="p-2 border rounded bg-blue-100">
        <p>* Edificios {'<'} a 8 pisos velocidad 1m/s</p>
        <p>* Edificios entre 7 y 15 pisos velocidad 1.5m/s</p>
        <p>* Edificios {'>'} 15 pisos velocidad 1.75m/s</p>
        <p>* Edificios {'>'} 25 pisos velocidad 2m/s</p>
      </div>
    </div>
  </div>
);

export default MainFormColumn2;
