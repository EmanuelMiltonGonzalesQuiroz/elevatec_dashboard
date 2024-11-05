import React, { useState} from 'react';
import Select from 'react-select';
import { db } from '../../connection/firebase';
import { collection, getDocs } from 'firebase/firestore';

const CustomSelect = ({ collectionName, placeholder, onChange, selectedValue }) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar los datos de la colección
  const fetchOptions = async () => {
    setIsLoading(true); // Indicador de carga
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const optionsList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const label = data.name || data.nombre || data.username || 'Sin nombre';

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
    setIsLoading(false); // Desactivar indicador de carga
  };

  // Cargar opciones cuando se hace clic en el componente Select
  const handleMenuOpen = () => {
    fetchOptions();
  };

  return (
    <Select
      options={options}
      value={selectedValue}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-grow"
      onMenuOpen={handleMenuOpen} // Llama a fetchOptions al abrir el menú
      isLoading={isLoading} // Muestra un indicador de carga si está activo
    />
  );
};

export default CustomSelect;
