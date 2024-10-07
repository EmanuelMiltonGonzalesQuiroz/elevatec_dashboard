import React from 'react';

const ClientForm = ({ formData, handleChange, handleSubmit, handleCloseModal, error, currentClientId }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[60%] max-h-[90%]">
      <h2 className="text-xl font-bold mb-4">
        {currentClientId ? "Editar Cliente" : "Agregar Cliente"}
      </h2>
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
          <label className="block text-gray-700">Correo</label>
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
            onClick={handleCloseModal}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition mr-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {currentClientId ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default ClientForm;
