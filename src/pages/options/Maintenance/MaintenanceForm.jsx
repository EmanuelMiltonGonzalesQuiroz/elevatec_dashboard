import React, { useState } from 'react';
import Selects from './MaintenanceForm/Selects';
import Location from './MaintenanceForm/Location';
import Table from './MaintenanceForm/Table';

const MaintenanceForm = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleAddItem = (type, basePrice, finalPrice) => {
    const newItem = { type, basePrice, finalPrice };
    setSelectedItems(prev => [...prev, newItem]);
  };

  return (
    <div className="flex items-start justify-between bg-gray-100 p-4 min-w-[80vh]">
      <Selects handleAddItem={handleAddItem} />
      <div className="flex flex-col justify-between w-3/4">
        <Location handleAddItem={handleAddItem}/>
        <Table selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
      </div>
    </div>
  );
};

export default MaintenanceForm;
