import React, { useState } from 'react';
import { formatTitle } from '../../../../utils/formatTitle';

const SearchBar = ({ onSearch, buildingNames }) => {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el nombre del cliente
  const [selectedDate, setSelectedDate] = useState(''); // Estado para la fecha
  const [selectedBuilding, setSelectedBuilding] = useState(''); // Estado para el tipo de edificio

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch({ name: String(value).toLowerCase(), date: selectedDate, buildingType: selectedBuilding });
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    const formattedDate = date.toISOString().split('T')[0]; // Convertir la fecha a 'YYYY-MM-DD'
    setSelectedDate(formattedDate);
    onSearch({ name: String(searchTerm).toLowerCase(), date: formattedDate, buildingType: selectedBuilding });
  };

  const handleBuildingChange = (e) => {
    const value = e.target.value;
    setSelectedBuilding(value);
    onSearch({ name: String(searchTerm).toLowerCase(), date: selectedDate, buildingType: value });
  };

  return (
    <div className="mb-4 flex space-x-4">
      <input
        type="text"
        placeholder="Buscar por nombre del cliente"
        value={searchTerm}
        onChange={handleSearchChange}
        className="p-2 border rounded w-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="p-2 border rounded w-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={selectedBuilding}
        onChange={handleBuildingChange}
        className="p-2 border rounded w-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Seleccionar tipo de edificio --</option>
        {buildingNames.map((name, index) => (
          <option key={index} value={name}>{formatTitle(name)}</option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
