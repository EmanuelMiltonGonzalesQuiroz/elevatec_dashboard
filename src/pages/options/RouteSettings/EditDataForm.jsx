import React, { useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';

const EditDataForm = ({ docId, itemIndex, collectionName, data, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ ...data });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const docRef = doc(db, collectionName, docId);

            // Obtenemos el documento actual
            const docSnapshot = await getDoc(docRef);
            if (!docSnapshot.exists()) {
                console.error('El documento no existe');
                return;
            }

            const docData = docSnapshot.data();
            const dataArray = docData.data;

            // Asegurarnos de que dataArray es un array
            if (!Array.isArray(dataArray)) {
                console.error('El campo "data" no es un array');
                return;
            }

            // Actualizamos el elemento en el índice correspondiente
            dataArray[itemIndex] = formData;

            // Guardamos el array actualizado en Firestore
            await updateDoc(docRef, { data: dataArray });

            // Llamamos a onSuccess para actualizar los datos en la tabla
            if (onSuccess) {
                await onSuccess();
            }

            onClose();
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Editar Datos</h2>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white rounded-lg px-3 py-1"
                    >
                        X
                    </button>
                </div>
                <div className="mb-4">
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 font-bold">
                                {key}
                            </label>
                            <input
                                type="text"
                                name={key}
                                value={formData[key] || ''}
                                onChange={handleChange}
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSave}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDataForm;
