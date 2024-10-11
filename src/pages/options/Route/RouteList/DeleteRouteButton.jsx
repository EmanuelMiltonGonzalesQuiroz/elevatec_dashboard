import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../connection/firebase';

const DeleteRouteButton = ({ routeId, onDelete }) => {
  const handleDelete = async () => {
    await deleteDoc(doc(db, 'list_of_routes', routeId));
    onDelete(routeId);
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
    >
      Eliminar
    </button>
  );
};

export default DeleteRouteButton;
