import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el nombre del cliente
  const [selectedDate, setSelectedDate] = useState(''); // Estado para la fecha

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch({ name: String(value).toLowerCase(), date: selectedDate });
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    const formattedDate = date.toISOString().split('T')[0]; // Convertir la fecha a 'YYYY-MM-DD'
    setSelectedDate(formattedDate);
    onSearch({ name: String(searchTerm).toLowerCase(), date: formattedDate });
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
    </div>
  );
};

export default SearchBar;
