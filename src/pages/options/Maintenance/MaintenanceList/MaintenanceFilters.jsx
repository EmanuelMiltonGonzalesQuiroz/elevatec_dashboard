import React, { useState, useEffect } from 'react';
import CustomSelect from '../../../../components/UI/CustomSelect';

export const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.getMonth();
    const year = String(dateObj.getFullYear()).slice(-2);
    const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
    return `${day}/${monthNames[month]}/${year}`;
  };
  

const MaintenanceFilters = ({ maintenanceList, setFilteredMaintenance, showDeleted }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const planesOptions = [
    { name: 'Trimensual' },
    { name: 'Bimensual' },
    { name: 'Mensual' },
    { name: 'Bimestral' },
    { name: 'Trimestral' }
  ];

  useEffect(() => {
    const filtered = maintenanceList.filter((maintenance) => {
      const matchesDeletedState = showDeleted ? maintenance.state === 'deleted' : maintenance.state !== 'deleted';
      const matchesClient = selectedClient ? maintenance.client.name === selectedClient.label : true;
      const matchesDate = selectedDate ? maintenance.date === formatDate(selectedDate) : true;
      const matchesPlan = selectedPlan ? maintenance.plan === selectedPlan : true;
      return matchesDeletedState && matchesClient && matchesDate && matchesPlan;
    });
    setFilteredMaintenance(filtered);
  }, [selectedDate, selectedClient, selectedPlan, maintenanceList, showDeleted, setFilteredMaintenance]);

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
  };

  const handlePlanChange = (selectedValue) => {
    setSelectedPlan(selectedValue);
  };

  const handleDateChange = (event) => {
    let selectedDate = new Date(event.target.value + "T00:00:00");
    selectedDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(selectedDate.toISOString().split('T')[0]);
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="building" className="mr-2 text-black">Seleccionar Cliente</label>
        <CustomSelect
          collectionName="clients"
          placeholder="Buscar Cliente"
          onChange={handleClientChange}
          selectedValue={selectedClient}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="plan" className="mr-2 text-black">Seleccionar Plan</label>
        <select
          id="plan"
          className="p-2 border rounded"
          value={selectedPlan || ''}
          onChange={(e) => handlePlanChange(e.target.value)}
        >
          <option value="">Todos los Planes</option>
          {planesOptions.map((plan) => (
            <option key={plan.name} value={plan.name}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="date" className="mr-2 text-black">Seleccionar Fecha</label>
        <input
          type="date"
          id="date"
          className="p-2 border rounded"
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};

export default MaintenanceFilters;
