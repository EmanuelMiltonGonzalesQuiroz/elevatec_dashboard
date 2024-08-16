// src/pages/options/quotations/NewClientModal.jsx
import React, { useState } from 'react';
import { db } from '../../../connection/firebase';
import { addDoc, collection } from 'firebase/firestore';

const NewClientModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    ciNIT: '',
    address: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, ciNIT, address, phone, email } = formData;

    if (!name || !ciNIT || !address || !phone || !email) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      await addDoc(collection(db, 'clients'), {
        name,
        ciNIT,
        address,
        phone,
        email,
      });
      onClose();
    } catch (error) {
      console.error('Error al agregar el cliente: ', error);
      setError('Error al agregar el cliente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">CI/NIT</label>
            <input
              type="text"
              name="ciNIT"
              value={formData.ciNIT}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-gray-100 focus:outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClientModal;
