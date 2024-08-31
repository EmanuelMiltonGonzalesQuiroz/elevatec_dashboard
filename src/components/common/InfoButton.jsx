import React from 'react';
import { Tooltip } from 'react-tooltip';

const InfoButton = ({ title, concept }) => {
  // Genera un ID único para el tooltip
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;

  return (
    <div>
      <span 
        data-tooltip-id={tooltipId}
        style={{ cursor: 'pointer' }}
      >
        {title}
      </span>
      
      <Tooltip 
        id={tooltipId} 
        place="top" 
        effect="solid" 
        clickable={true}
        style={{ 
          textAlign: 'justify', 
          maxWidth: '200px', 
          minWidth: '100px' 
        }}
      >
        <div>
          <strong>{title}</strong>
          <div>{concept}</div>
        </div>
      </Tooltip>
    </div>
  );
};

export default InfoButton;
