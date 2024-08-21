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
        const optionsList = querySnapshot.docs.map((doc) => ({
          label: doc.data().name,
          value: doc.id,
          ...doc.data(),
        }));
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
