const MainContent = ({ doc, config, formData, startY }) => {
  const { leftMargin, proposalTitle } = config;

  // Calcula el número de ascensores y ajusta el texto de acuerdo
  const numAscensores = formData['08_Número de ascensores'] || 1;

  // Texto dinámico basado en el número de ascensores
  const installationDescription = `De acuerdo a su solicitud, tenemos el agrado de poner en su consideración la Provisión e Instalación de ${numAscensores}, marca ELEVATEC, de última tecnología, que cumple todos los requerimientos necesarios para su obra.`;

  // Definir el resto del texto fijo
  const additionalInfo = `Ascensores Elevatec, fabricados por Teknolift SRL, del grupo Empresarial Jaldin, cumple con Normativa europea EN 81, compatible con la Norma Boliviana NB 135001, Sistema de Gestión de Calidad ISO 9001: 2015 y Sistema de Gestión Ambiental ISO 14001: 2015.`;

  const experienceInfo = `La experiencia de más de 10 años en el mercado de nuestra Empresa, y los más de 500 equipos instalados a nivel nacional, garantizan no solo la calidad de los equipos a instalarse, sino toda la cadena existente desde la Venta, Instalación, Montaje, provisión de repuestos originales, servicios de mantenimiento, modernizaciones, servicios de emergencia las 24 horas del día, etc.`;

  // Añadir el contenido al PDF, ajustando la posición con startY
  let currentY = startY; // Iniciar desde la posición pasada
  const lineSpacing = 8; // Espaciado entre líneas

  doc.setFontSize(12);
  doc.text(`Ref.: ${proposalTitle}`, leftMargin, currentY, { maxWidth: 170, align: "justify" });
  currentY += lineSpacing;

  doc.text("De nuestra mayor consideración:", leftMargin, currentY);
  currentY += lineSpacing;

  doc.text(installationDescription, leftMargin, currentY, { maxWidth: 170, align: "justify" });
  currentY += lineSpacing * 2;

  doc.text(additionalInfo, leftMargin, currentY, { maxWidth: 170, align: "justify" });
  currentY += lineSpacing * 2;

  doc.text(experienceInfo, leftMargin, currentY, { maxWidth: 170, align: "justify" });
  
  // Retornar la nueva posición de Y para continuar con otros contenidos
  return currentY + lineSpacing * 2;
};

export default MainContent;
