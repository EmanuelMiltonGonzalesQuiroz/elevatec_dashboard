import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { db } from '../../connection/firebase';
import { collection, getDocs } from 'firebase/firestore';

const CustomSelect = ({ collectionName, placeholder, onChange, selectedValue }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
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
    };

    fetchOptions();
  }, [collectionName]);

  return (
    <Select
      options={options}
      value={selectedValue}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-grow"
    />
  );
};

export default CustomSelect;
