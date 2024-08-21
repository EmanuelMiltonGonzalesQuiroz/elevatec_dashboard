import React from 'react';
import GroupsConfigurations from '../../../components/UI/GroupsConfigurations';
import { motorsText } from '../../../components/common/Text/texts';

const Motors = () => {
  return (
    <GroupsConfigurations
      collectionName="motors"
      columnsConfig={{
        headers: [
          motorsText.number,             // #
          motorsText.persons,            // Personas
          motorsText.gearleesPower,      // Gearlees Potencia
          motorsText.gearleesPrice,      // Gearlees Precio
          motorsText.gearleesChannels,   // Gearlees Canales
          motorsText.withReducerPower,   // Con Reduc. Potencia
          motorsText.withReducerPrice,   // Con Reduc. Precio
          motorsText.withReducerChannels,// Con Reduc. Canales
        ],
        keys: [
          'index',                       // #
          'personas',                    // Personas
          'gearlessPotencia',            // Gearlees Potencia
          'gearlessPrecio',              // Gearlees Precio
          'gearlessCanales',             // Gearlees Canales
          'conReducPotencia',            // Con Reduc. Potencia
          'conReducPrecio',              // Con Reduc. Precio
          'conReducCanales',             // Con Reduc. Canales
        ],
        fields: {
          personas: motorsText.persons,            // Personas
          gearlessPotencia: motorsText.gearleesPower, // Gearlees Potencia
          gearlessPrecio: motorsText.gearleesPrice, // Gearlees Precio
          gearlessCanales: motorsText.gearleesChannels, // Gearlees Canales
          conReducPotencia: motorsText.withReducerPower, // Con Reduc. Potencia
          conReducPrecio: motorsText.withReducerPrice, // Con Reduc. Precio
          conReducCanales: motorsText.withReducerChannels, // Con Reduc. Canales
        },
      }}
      textConfig={{
        title: motorsText.title,
        type: motorsText.type, // El tipo se mostrará solo si existe
      }}
    />
  );
};

export default Motors;
