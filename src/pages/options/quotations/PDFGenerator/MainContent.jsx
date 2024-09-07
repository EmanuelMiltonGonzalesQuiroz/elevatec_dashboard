const MainContent = ({ doc, config, formData, startY }) => {
  const { leftMargin, proposalTitle } = config;

  // Aseguramos que leftMargin y startY sean números válidos
  const validLeftMargin = leftMargin || 20; // Valor por defecto si leftMargin no está definido
  let currentY = startY || 20; // Valor por defecto si startY no está definido

  // Verificamos que proposalTitle y otros textos no sean undefined o null
  const validProposalTitle = proposalTitle || 'Propuesta de Instalación'; // Título por defecto
  const numAscensores = formData['08_Número de ascensores'] || 1; // Valor por defecto

  // Texto dinámico basado en el número de ascensores
  const installationDescription = `De acuerdo a su solicitud, tenemos el agrado de poner en su consideración la Provisión e Instalación de ${numAscensores}, marca ELEVATEC, de última tecnología, que cumple todos los requerimientos necesarios para su obra.`;

  // Definir el resto del texto fijo
  const additionalInfo = `Ascensores Elevatec, fabricados por Teknolift SRL, del grupo Empresarial Jaldin, cumple con Normativa europea EN 81, compatible con la Norma Boliviana NB 135001, Sistema de Gestión de Calidad ISO 9001: 2015 y Sistema de Gestión Ambiental ISO 14001: 2015.`;

  const experienceInfo = `La experiencia de más de 10 años en el mercado de nuestra Empresa, y los más de 500 equipos instalados a nivel nacional, garantizan no solo la calidad de los equipos a instalarse, sino toda la cadena existente desde la Venta, Instalación, Montaje, provisión de repuestos originales, servicios de mantenimiento, modernizaciones, servicios de emergencia las 24 horas del día, etc.`;

  // Aseguramos que los textos sean válidos antes de pasarlos a jsPDF.text
  const validInstallationDescription = installationDescription || 'Información no disponible.';
  const validAdditionalInfo = additionalInfo || 'Información adicional no disponible.';
  const validExperienceInfo = experienceInfo || 'Información de experiencia no disponible.';

  // Ajustar la posición de las líneas
  const lineSpacing = 10; // Espaciado entre líneas

  // Añadir el contenido al PDF, ajustando la posición con currentY
  doc.setFontSize(12);

  // Ref.: Propuesta
  doc.text(`Ref.: ${validProposalTitle}`, validLeftMargin, currentY);
  currentY += lineSpacing;

  // De nuestra mayor consideración
  doc.text("De nuestra mayor consideración:", validLeftMargin, currentY);
  currentY += lineSpacing;

  // Descripción de instalación
  doc.text(validInstallationDescription, validLeftMargin, currentY, { maxWidth: 170, align: "justify" });
  currentY += lineSpacing * 2;

  // Información adicional
  doc.text(validAdditionalInfo, validLeftMargin, currentY, { maxWidth: 170, align: "justify" });
  currentY += lineSpacing * 2;

  // Información de experiencia
  doc.text(validExperienceInfo, validLeftMargin, currentY, { maxWidth: 170, align: "justify" });

  // Retornar la nueva posición de Y para continuar con otros contenidos
  return currentY + lineSpacing * 2;
};

export default MainContent;
