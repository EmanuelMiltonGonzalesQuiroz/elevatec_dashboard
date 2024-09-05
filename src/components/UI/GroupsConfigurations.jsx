import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../connection/firebase';
import ConfigurableTable from './ConfigurableTable';
import GroupClassesColumn from './GroupClassesColumn';
import EditableForm from './EditableForm';

const GroupsConfigurations = ({ collectionName, columnsConfig, textConfig }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupItems, setSelectedGroupItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [currentItemId, setCurrentItemId] = useState(null);
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsCollection = collection(db, collectionName);
      const groupsSnapshot = await getDocs(groupsCollection);
      const groupsList = groupsSnapshot.docs.map(doc => {
        const groupData = doc.data();
        return {
          id: doc.id,
          ...groupData,
          tipo: groupData.items && groupData.items[0]?.tipo ? groupData.items[0].tipo : null, // El tipo se establece solo si existe
        };
      });

      setGroups(groupsList);
      if (groupsList.length > 0) {
        setSelectedGroup(groupsList[0]);
        setSelectedGroupItems(groupsList[0].items || []);
      }
      setShouldReload(false);
    };

    fetchGroups();
  }, [shouldReload, collectionName]);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setSelectedGroupItems(group.items || []);
  };

  const handleOpenModal = (item) => {
    setCurrentItemId(selectedGroup.id); // Usamos el ID del grupo para identificar la colección
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessfulEdit = () => {
    setShouldReload(true);
    handleCloseModal();
  };

  return (
    <div className="p-4 bg-gray-100 text-black ">
      <div className="flex">
        <GroupClassesColumn 
          groups={groups} 
          selectedGroup={selectedGroup} 
          handleGroupClick={handleGroupClick} 
          textConfig={textConfig} 
        />
        <div className="w-3/4 p-4">
          {selectedGroup && (
            <ConfigurableTable
              data={selectedGroupItems}
              onEdit={handleOpenModal}
              columns={{
                title: `${textConfig.title} ${selectedGroup.id}`,
                headers: columnsConfig.headers,
                keys: columnsConfig.keys,
              }}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <EditableForm 
          docId={currentItemId}
          collectionName={collectionName}
          fields={columnsConfig.fields}
          initialValues={currentItem}
          onClose={handleCloseModal}
          onSuccess={handleSuccessfulEdit}
        />
      )}
    </div>
  );
};

export default GroupsConfigurations;
