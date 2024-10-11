import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import EditPricesForm2 from '../../../components/UI/EditPricesForm2';

const LiftsM = () => {
  const [liftsData, setLiftsData] = useState([]);
  const [currentLift, setCurrentLift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchLiftsData = async () => {
      const liftsCollection = collection(db, 'lifts_m');
      const liftSnapshot = await getDocs(liftsCollection);

      const data = {};
      liftSnapshot.docs.forEach(doc => {
        const liftType = doc.id; // Tipo de ascensor (ASC. 4-6, ASC. 8-10, etc.)
        const items = doc.data().items || [];
        items.forEach(item => {
          const { pisos, precio } = item;
          if (!data[pisos]) {
            data[pisos] = {};
          }
          data[pisos][liftType] = { price: precio, liftType, docId: doc.id, index: item.index };
        });
      });

      const sortedData = Object.keys(data)
        .sort((a, b) => a - b)
        .map(piso => ({
          pisos: piso,
          ...data[piso],
        }));

      setLiftsData(sortedData);
      setShouldReload(false);
    };

    fetchLiftsData();
  }, [shouldReload]);

  const handleOpenModal = (lift) => {
    setCurrentLift(lift);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentLift(null);
  };

  const handleSavePrice = async (updatedPrices) => {
    try {
      for (const liftType in updatedPrices) {
        const docRef = doc(db, 'lifts_m', currentLift[liftType].docId);
        const docSnap = await getDoc(docRef);
        const currentData = docSnap.data();

        const updatedItems = currentData.items.map(item =>
          item.index === currentLift[liftType].index
            ? { ...item, precio: updatedPrices[liftType] }
            : item
        );

        await updateDoc(docRef, { items: updatedItems });
      }
      setShouldReload(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  }; 

  return (
    <div className="p-4 bg-gray-100 text-black max-h-[80vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[65vh]">
        <h2 className="text-2xl font-bold mb-6">Ascensores Mantenimiento</h2>
        <div className="overflow-x-auto max-h-[50vh]">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="text-black font-bold">
                <th className="border px-4 py-2">Pisos</th>
                <th className="border px-4 py-2">ASC. 4 - 6</th>
                <th className="border px-4 py-2">ASC. 8 - 10</th>
                <th className="border px-4 py-2">ASC. 12 - 14</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {liftsData.map((lift, index) => (
                <tr key={index} className="text-black">
                  <td className="border px-4 py-2">{lift.pisos}</td>
                  <td className="border px-4 py-2">{lift['ASC. 4 - 6']?.price || 'N/A'}</td>
                  <td className="border px-4 py-2">{lift['ASC. 8 - 10']?.price || 'N/A'}</td>
                  <td className="border px-4 py-2">{lift['ASC. 12 - 14']?.price || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                      onClick={() => handleOpenModal(lift)}
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

      {isModalOpen && currentLift && (
        <EditPricesForm2
          pisos={currentLift.pisos}
          asc4To6={currentLift['ASC. 4 - 6']?.price || ''}
          asc8To10={currentLift['ASC. 8 - 10']?.price || ''}
          asc12To14={currentLift['ASC. 12 - 14']?.price || ''}
          onClose={handleCloseModal}
          onSave={(updatedPrices) => handleSavePrice(updatedPrices)}
        />
      )}
    </div>
  );
};

export default LiftsM;
