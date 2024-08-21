import React from 'react';
import GroupsConfigurations from '../../../components/UI/GroupsConfigurations';
import { doorsText } from '../../../components/common/Text/texts';

const Doors = () => {
  return (
    <GroupsConfigurations
      collectionName="doors"
      columnsConfig={{
        headers: [
          doorsText.number,           // #
          doorsText.measure,          // Medida
          doorsText.cabina,           // Cabina
          doorsText.cDeVidrio,        // C. de vidrio
          doorsText.pDeVidrio,        // P. de vidrio
          doorsText.pInox,            // P. Inox
          doorsText.pEpoxi,           // P. Epoxi
        ],
        keys: [
          'index',                    // #
          'medida',                   // Medida
          'cabina',                   // Cabina
          'c_de_vidrio',              // C. de vidrio
          'p_de_vidrio',              // P. de vidrio
          'p_inox',                   // P. Inox
          'p_epoxi',                  // P. Epoxi
        ],
        fields: {
          medida: doorsText.measure,          // Medida
          cabina: doorsText.cabina,           // Cabina
          c_de_vidrio: doorsText.cDeVidrio,   // C. de vidrio
          p_de_vidrio: doorsText.pDeVidrio,   // P. de vidrio
          p_inox: doorsText.pInox,            // P. Inox
          p_epoxi: doorsText.pEpoxi,          // P. Epoxi
        },
      }}
      textConfig={{
        title: doorsText.title,
        type: doorsText.type, // El tipo se mostrará solo si existe
      }}
    />
  );
};

export default Doors;
