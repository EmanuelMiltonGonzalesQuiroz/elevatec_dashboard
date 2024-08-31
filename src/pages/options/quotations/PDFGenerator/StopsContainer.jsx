import React from 'react';

const StopsContainer = ({ stops, onStopInputChange }) => {
  console.log("stops en StopsContainer:", stops);

  return (
    <div className="mb-4 w-full">
      {stops.map((stop, index) => (
        <div key={index} className="mb-2">
          <label className="block text-gray-700 font-bold mb-1">
            Piso de la parada {index + 1}:
          </label>
          <input
            type="text"
            className="border rounded w-full py-2 px-3 text-gray-700"
            placeholder={`Ingrese el piso de la parada ${index + 1}`}
            value={stop}
            onChange={(e) => onStopInputChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default StopsContainer;
