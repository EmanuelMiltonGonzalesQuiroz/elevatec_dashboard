// useClientHandlers.js
export const useClientHandlers = (formData, setFormData, updateFormData) => {
    const handleClientChange = (selectedOption, field) => {
      if (selectedOption && selectedOption.label !== formData[field]) {
        updateFormData({ field, value: selectedOption.label }, formData, setFormData);
      }
    };
  
    return { handleClientChange };
  };
  