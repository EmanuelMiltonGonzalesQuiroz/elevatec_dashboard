import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../connection/firebase';
import { editableformText } from '../../components/common/Text/texts';

const EditableForm = ({ docId, collectionName, fields, initialValues, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(initialValues);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (let key in fields) {
      const value = formData[key];

      // Validar que el campo no esté vacío
      if (value === '' || value === null || value === undefined) {
        setError(`El campo ${fields[key]} es obligatorio y no puede estar vacío.`);
        return;
      }
    }

    try {
      if (docId) {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const currentData = docSnap.data();
          const updatedItems = currentData.items.map(item =>
            item.index === formData.index ? formData : item
          );
          await updateDoc(docRef, { items: updatedItems });
          onSuccess(); // Llama a la función `onSuccess` cuando se completa la actualización
        }
      }
    } catch (error) {
      console.error('Error al guardar el elemento: ', error);
      setError('Hubo un problema al guardar los cambios.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{editableformText.title} {collectionName}</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(fields).map((key) => (
            <div className="mb-4" key={key}>
              <label className="block text-gray-700">{fields[key]}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
              />
            </div>
          ))}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-2"
            >
              {editableformText.cancel}
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {editableformText.update}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditableForm;
