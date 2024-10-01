import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { db } from '../../../../connection/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

const CustomLoginSelect = ({ placeholder, onChange, selectedValue, setFormData, formData }) => {
  const [options, setOptions] = useState([]);
  const { currentUser } = useAuth(); // Extraer el usuario actual

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'login firebase'));
        const optionsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const label = data.username || 'Sin username'; // Mostrar username o "Sin username" si no existe

          return {
            label: label,
            value: doc.id,
            ...data,
          };
        });

        setOptions(optionsList);
      } catch (error) {
        console.error('Error fetching options: ', error);
      }
    };

    fetchOptions();
  }, []);

  // Enviar automáticamente el username al formData si no hay nada seleccionado
  useEffect(() => {
    if (!selectedValue && currentUser) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Solicitante: currentUser.username, // Establecer el username en formData
      }));
    }
  }, [currentUser, selectedValue, setFormData]);

  // Determinar el valor preseleccionado: usa el seleccionado o el username
  const defaultValue = selectedValue || options.find(option => option.label === currentUser?.username) || null;

  return (
    <Select
      options={options}
      value={defaultValue} // Mostrar el username o lo seleccionado
      onChange={onChange} // Permitir que el usuario seleccione otro valor
      placeholder={placeholder}
      className="flex-grow"
    />
  );
};

export default CustomLoginSelect;
