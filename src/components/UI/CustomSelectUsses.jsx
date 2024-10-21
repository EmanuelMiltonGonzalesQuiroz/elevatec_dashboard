import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { db } from '../../connection/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const CustomSelectUsses = ({ collectionName, placeholder, onChange, selectedValue, role }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Si estamos en la colección de login firebase, filtramos por el rol
        let q;
        if (collectionName === 'login firebase' && role) {
          q = query(collection(db, collectionName), where('role', '==', role));
        } else {
          q = collection(db, collectionName); // Cargamos todo si no es la colección 'login firebase' o si no hay filtro
        }

        const querySnapshot = await getDocs(q);
        const optionsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const label = data.name || data.nombre || data.username || 'Sin nombre'; // Usamos diferentes campos según los datos

          return { 
            label: label,
            value: doc.id,
            ...data,  // Pasamos todos los datos por si se necesitan en el futuro
          };
        });
        setOptions(optionsList);
      } catch (error) {
        console.error('Error fetching options: ', error);
      }
    };

    fetchOptions();
  }, [collectionName, role]);

  return (
    <Select
      options={options}
      value={selectedValue}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-grow text-black"
    />
  );
};

export default CustomSelectUsses;
