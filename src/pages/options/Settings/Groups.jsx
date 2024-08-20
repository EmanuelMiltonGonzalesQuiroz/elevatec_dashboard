import React from 'react';
import GroupsConfigurations from '../../../components/UI/GroupsConfigurations';
import { groupsText } from '../../../components/common/Text/texts';

const Groups = () => {
  return (
    <GroupsConfigurations
      collectionName="groups"
      columnsConfig={{
        headers: [groupsText.number, groupsText.name, groupsText.value, groupsText.description],
        keys: ['index', 'nombre', 'valor', 'descripcion'],
        fields: {
          nombre: groupsText.name,
          valor: groupsText.value,
          descripcion: groupsText.description,
        },
      }}
      textConfig={{
        title: groupsText.title,
        type: groupsText.type,
      }}
    />
  );
};

export default Groups;
