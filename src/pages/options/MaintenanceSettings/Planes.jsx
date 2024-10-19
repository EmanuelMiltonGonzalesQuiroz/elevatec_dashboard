import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import PlanesEditModal from '../../../components/UI/PlanesEditModal'; // Importar el nuevo modal

const Planes = () => {
  const [planesData, setPlanesData] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchPlanesData = async () => {
      const planesCollection = collection(db, 'planes');
      const planesSnapshot = await getDocs(planesCollection);

      const data = [];
      planesSnapshot.docs.forEach(doc => {
        const docData = doc.data();
        if (docData.data && Array.isArray(docData.data)) {
          docData.data.forEach(plan => {
            data.push({ ...plan, docId: doc.id }); // Agregar docId a cada plan
          });
        }
      });

      setPlanesData(data);
      setShouldReload(false);
    };

    fetchPlanesData();
  }, [shouldReload]);

  const handleOpenModal = (plan) => {
    setCurrentPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPlan(null);
  };

  const handleSuccessUpdate = () => {
    setShouldReload(true);
    handleCloseModal();
  };

  return (
    <div className="p-4 bg-gray-100 text-black max-h-[80vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[65vh]">
        <h2 className="text-2xl font-bold mb-6">Planes de Mantenimiento</h2>
        <div className="overflow-x-auto max-h-[50vh]">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="text-black font-bold">
                <th className="border px-4 py-2">Nombre del Plan</th>
                <th className="border px-4 py-2">Descripción</th>
                <th className="border px-4 py-2">Valor</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planesData.map((plan, index) => (
                <tr key={index} className="text-black">
                  <td className="border px-4 py-2">{plan.name}</td>
                  <td className="border px-4 py-2">{plan.note}</td>
                  <td className="border px-4 py-2">{plan.value}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                      onClick={() => handleOpenModal(plan)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && currentPlan && (
        <PlanesEditModal
          docId={currentPlan.docId}
          plan={currentPlan}
          onClose={handleCloseModal}
          onSuccess={handleSuccessUpdate}
        />
      )}
    </div>
  );
};

export default Planes;
