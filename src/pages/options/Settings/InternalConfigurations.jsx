import React from 'react';
import GroupsConfigurations from '../../../components/UI/GroupsConfigurations';
import { internalConfigurationsText } from '../../../components/common/Text/texts';

const InternalConfigurations = () => {
  return (
    <GroupsConfigurations
      collectionName="internal_config"
      columnsConfig={{
        headers: [
          internalConfigurationsText.number,        // #
          internalConfigurationsText.speed,         // Velocidad (m/s)
          internalConfigurationsText.price,         // Precio
        ],
        keys: [
          'index',                                  // #
          'velocidad_m_s',                          // Velocidad (m/s)
          'precio',                                 // Precio
        ],
        fields: {
          velocidad_m_s: internalConfigurationsText.speed,  // Velocidad (m/s)
          precio: internalConfigurationsText.price,         // Precio
        },
      }}
      textConfig={{
        title: internalConfigurationsText.title,
        type: internalConfigurationsText.type, // El tipo se mostrará solo si existe
      }}
    />
  );
};

export default InternalConfigurations;
