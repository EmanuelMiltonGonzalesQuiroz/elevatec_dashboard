const MainContent = ({ doc, config, formData, startY }) => {
  const { leftMargin = 20, rightMargin = 20, fontSize = 12 } = config; // Asegurar márgenes y tamaño de fuente
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxTextWidth = pageWidth - leftMargin - rightMargin; // Ajustar el ancho de texto respetando los márgenes

  let currentY = startY || 20; // Asegurar que startY esté definido

  const validProposalTitle = config.proposalTitle || 'Propuesta de Instalación'; // Título por defecto
  const numAscensores = formData['08_Número de ascensores'] || 1; // Valor por defecto

  // Texto dinámico basado en el número de ascensores
  const installationDescription = `De acuerdo a su solicitud, tenemos el agrado de poner en su consideración la Provisión e Instalación de ${numAscensores}, marca ELEVATEC, de última tecnología, que cumple todos los requerimientos necesarios para su obra.`;

  // Texto fijo adicional
  const additionalInfo = `Ascensores Elevatec, fabricados por Teknolift SRL, del grupo Empresarial Jaldin, cumple con Normativa europea EN 81, compatible con la Norma Boliviana NB 135001, Sistema de Gestión de Calidad ISO 9001: 2015 y Sistema de Gestión Ambiental ISO 14001: 2015.`;

  const experienceInfo = `La experiencia de más de 10 años en el mercado de nuestra Empresa, y los más de 500 equipos instalados a nivel nacional, garantizan no solo la calidad de los equipos a instalarse, sino toda la cadena existente desde la Venta, Instalación, Montaje, provisión de repuestos originales, servicios de mantenimiento, modernizaciones, servicios de emergencia las 24 horas del día, etc.`;

  // Ajustar la posición de las líneas
  const lineSpacing = 10; // Espaciado entre líneas

  // Añadir el contenido al PDF, ajustando la posición con currentY
  doc.setFontSize(fontSize);

  // Ref.: Propuesta
  doc.text(`Ref.: ${validProposalTitle}`, leftMargin, currentY, { maxWidth: maxTextWidth });
  currentY += lineSpacing;

  // De nuestra mayor consideración
  doc.text("De nuestra mayor consideración:", leftMargin, currentY, { maxWidth: maxTextWidth });
  currentY += lineSpacing;

  // Descripción de instalación
  doc.text(installationDescription, leftMargin, currentY, { maxWidth: maxTextWidth, align: "justify" });
  currentY += lineSpacing * 2;

  // Información adicional
  doc.text(additionalInfo, leftMargin, currentY, { maxWidth: maxTextWidth, align: "justify" });
  currentY += lineSpacing * 2;

  // Información de experiencia
  doc.text(experienceInfo, leftMargin, currentY, { maxWidth: maxTextWidth, align: "justify" });

  // Retornar la nueva posición de Y para continuar con otros contenidos
  return currentY + lineSpacing * 2;
};

export default MainContent;
