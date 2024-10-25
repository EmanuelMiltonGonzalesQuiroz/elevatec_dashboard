const MainContent = ({ doc, config, formData, startY }) => {
  const { leftMargin = 20, rightMargin = 20, fontSize = 12, experience } = config; // Asegurar márgenes y tamaño de fuente
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxTextWidth = pageWidth - leftMargin - rightMargin; // Ajustar el ancho de texto respetando los márgenes

  let currentY = startY || 20; // Asegurar que startY esté definido

  // Función para convertir números a palabras
  const numberToWords = (num) => {
    const words = ['Cero', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'];
    return words[num] || num.toString();
  };

  // Si `formData` no es un array, lo convertimos en uno para procesarlo de manera uniforme
  const formDataArray = Array.isArray(formData) ? formData : [formData];

  // Variables para almacenar la suma de valores y otros datos
  let totalAscensores = 0;
  
  // Sumar los valores que deban ser acumulados de ambos formData
  formDataArray.forEach((data) => {
    totalAscensores += data['08_Número de ascensores'] || 0; // Sumar el número de ascensores
  });

  // Texto dinámico basado en la suma de los ascensores (incluyendo número en palabras y en formato numérico)
  const installationDescription = `De acuerdo a su solicitud, tenemos el agrado de poner en su consideración la Provisión e Instalación de ${numberToWords(totalAscensores)} (${totalAscensores}) Ascensores Sociales, marca ELEVATEC de última tecnología, que cumple con todos los requerimientos necesarios para su obra.`;

  // Texto fijo adicional
  const additionalInfo = `Los equipos ofertados cumplen con Normativa internacional, en fabricación de Ascensores, y cuentan con la certificación del Sistema de Gestión de Calidad ISO9001, certificación en Sistemas de Gestión Ambiental (SGA) ISO 14001, Certificación en Sistemas de gestión de la seguridad y salud en el trabajo ISO45001.`;

  const experienceInfo = `La experiencia de más de ${experience} años en el mercado de nuestra Empresa, y los más de 500 equipos instalados a nivel nacional, garantizan no solo la calidad de los equipos a instalarse, sino toda la cadena existente desde la Venta, Instalación, Montaje, provisión de repuestos originales, servicios de mantenimiento, modernizaciones, servicios de emergencia las 24 horas del día, etc.`;

  // Ajustar la posición de las líneas
  const lineSpacing = 10; // Espaciado entre líneas

  // Añadir el contenido al PDF, ajustando la posición con currentY
  doc.setFontSize(fontSize);

  // Ref.: Propuesta
  doc.text(`Ref.: Propuesta de Instalación`, leftMargin, currentY, { maxWidth: maxTextWidth });
  currentY += lineSpacing;

  // De nuestra mayor consideración
  doc.text("De nuestra mayor consideración:", leftMargin, currentY, { maxWidth: maxTextWidth });
  currentY += lineSpacing + 5;

  // Descripción de instalación
  doc.text(installationDescription, leftMargin, currentY, { maxWidth: maxTextWidth, align: "justify" });
  currentY += lineSpacing * 2;

  // Información adicional
  doc.text(additionalInfo, leftMargin, currentY, { maxWidth: maxTextWidth, align: "justify" });
  currentY += lineSpacing * 2 + 5;

  // Información de experiencia
  doc.text(experienceInfo, leftMargin, currentY, { maxWidth: maxTextWidth, align: "justify" });

  // Retornar la nueva posición de Y para continuar con otros contenidos
  return currentY + lineSpacing * 2+10;
};

export default MainContent;
