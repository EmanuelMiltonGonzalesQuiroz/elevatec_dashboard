import { useCallback } from 'react';

export const useUpdateFormData = () => {
  const updateFormData = useCallback(async (newData, formData, setFormData) => {
    // Solo actualiza si el nuevo valor es diferente al existente
    if (formData[newData.field] !== newData.value) {
      await setFormData((prevFormData) => ({
        ...prevFormData,
        [newData.field]: newData.value,
      }));
    }
  }, []);

  return { updateFormData };
};
