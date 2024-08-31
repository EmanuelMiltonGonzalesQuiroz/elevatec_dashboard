import React from 'react';

const StopSelect = ({ numStops, onStopsChange }) => {
  console.log("Número de paradas en StopSelect:", numStops);

  return (
    <div className="mb-4">
      <label htmlFor="stopsSelect" className="block text-gray-700 font-bold mb-2">
        Seleccione el número de paradas:
      </label>
      <select
        id="stopsSelect"
        className="border rounded w-full py-2 px-3 text-gray-700"
        value={numStops}
        onChange={(e) => onStopsChange(parseInt(e.target.value))}
      >
        {[1, 2, 3, 4].map((value) => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>
    </div>
  );
};

export default StopSelect;
