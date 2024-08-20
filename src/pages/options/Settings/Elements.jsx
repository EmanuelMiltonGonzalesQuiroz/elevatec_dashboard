import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../connection/firebase';
import EditableForm from '../../../components/UI/EditableForm';
import ConfigurableTable from '../../../components/UI/ConfigurableTable';
import { elementsText } from '../../../components/common/Text/texts';

const Elements = () => {
  const [elements, setElements] = useState([]);
  const [currentElementId, setCurrentElementId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentElement, setCurrentElement] = useState({});
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchElements = async () => {
      const elementsCollection = collection(db, 'elements');
      const elementsSnapshot = await getDocs(elementsCollection);
      const elementsList = elementsSnapshot.docs.flatMap(doc => {
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
      setElements(elementsList);
      setShouldReload(false);
    };

    fetchElements();
  }, [shouldReload]);

  const handleOpenModal = (element) => {
    setCurrentElementId(element.id);
    setCurrentElement({
      name: element.name,
      value: element.value,
      type: element.type,
      description: element.description,
      index: element.index,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessfulEdit = () => {
    setShouldReload(true);
    handleCloseModal();
  };

  const columns = {
    title: elementsText.title,
    headers: [
      elementsText.name,
      elementsText.value,
      elementsText.type,
      elementsText.description,
    ],
    keys: ['index', 'name', 'value', 'type', 'description'],
  };

  return (
    <>
      <ConfigurableTable 
        data={elements} 
        onEdit={handleOpenModal} 
        columns={columns} 
      />

      {isModalOpen && (
        <EditableForm 
          docId={currentElementId}
          collectionName="elements"
          fields={{
            name: elementsText.name,
            value: elementsText.value,
            type: elementsText.type,
            description: elementsText.description,
            index: elementsText.index,
          }}
          initialValues={currentElement}
          onClose={handleCloseModal}
          onSuccess={handleSuccessfulEdit}
        />
      )}
    </>
  );
};

export default Elements;
