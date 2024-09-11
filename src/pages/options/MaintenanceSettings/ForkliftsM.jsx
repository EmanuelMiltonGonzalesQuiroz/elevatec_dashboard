import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import EditPricesForm from '../../../components/UI/EditPricesForm';

const ForkliftsM = () => {
  const [forklifts, setForklifts] = useState([]);
  const [currentLiftId, setCurrentLiftId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLift, setCurrentLift] = useState({});
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchForklifts = async () => {
      const forkliftsCollection = collection(db, 'forklifts_m');
      const forkliftsSnapshot = await getDocs(forkliftsCollection);
      const forkliftsList = forkliftsSnapshot.docs.flatMap(doc => {
        const data = doc.data();
        if (data.items) {
          return data.items.map(item => ({
            id: doc.id, // ID del documento
            ...item,
          }));
        } else {
          return {
            id: doc.id,
            ...data,
          };
        }
      });

      // Ordenar los datos por el campo 'pisos'
      const sortedForklifts = forkliftsList.sort((a, b) => a.pisos - b.pisos);

      setForklifts(sortedForklifts);
      setShouldReload(false);
    };

    fetchForklifts();
  }, [shouldReload]);

  const handleOpenModal = (forklift) => {
    setCurrentLiftId(forklift.id); // Guardamos el ID del documento para actualizarlo
    setCurrentLift({
      pisos: forklift.pisos,
      precios: forklift.precios,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessfulEdit = () => {
    setShouldReload(true);
  };

  return (
    <div className="p-4 bg-gray-100 text-black max-h-[80vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[65vh]">
        <h2 className="text-2xl font-bold mb-6">Monta Cargas M.</h2>
        <div className="overflow-x-auto max-h-[50vh]">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="text-black font-bold">
                <th className="border px-4 py-2">Pisos</th>
                <th className="border px-4 py-2">Precios</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {forklifts.map((forklift, index) => (
                <tr key={index} className="text-black">
                  <td className="border px-4 py-2">{forklift.pisos}</td>
                  <td className="border px-4 py-2">{forklift.precios}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                      onClick={() => handleOpenModal(forklift)}
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

      {isModalOpen && (
        <EditPricesForm
          docId={currentLiftId}
          collectionName="forklifts_m"
          pisos={currentLift.pisos}
          initialPrice={currentLift.precios}
          onClose={handleCloseModal}
          onSuccess={handleSuccessfulEdit}
        />
      )}
    </div>
  );
};

export default ForkliftsM;
