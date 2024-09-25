import 'jspdf-autotable';

const MainContent = ({ doc, config, startY, recipe }) => {
  const { leftMargin = 20, rightMargin = 20, topMargin = 20, bottomMargin = 20 } = config;
  const pageWidth = doc.internal.pageSize.width;
  const tableWidth = pageWidth - leftMargin - rightMargin;
  let currentYPosition = startY || 20;

  // Tabla 1: Título y primeras cláusulas
  const contractIntro = [
    [{ content: "CONTRATO PRIVADO DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO DE UN (1) ASCENSOR", styles: { halign: 'center', fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "CÓDIGO DE CONTRATO: 003/2024", styles: { halign: 'left', fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: `Conste por el tenor del presente Contrato Privado de Mantenimiento Preventivo y Correctivo de Un (1) Ascensor, suscrito al tenor de las siguientes cláusulas:`, styles: { halign: 'justify' }, colSpan: 3 }],
    [{ content: "PRIMERA: (PARTES).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: `1. JALDIN MEJIA CONSTRUCCIONES JALMECO LTDA., Empresa legalmente constituida bajo las leyes Bolivianas, con NIT 1021629020, y representado por su Gerente Mantenimientos y Activos, Arq. Alvaro Grover Jaldin Navia con C.I. Nº 6550173 Cbba., con domicilio en la avenida Altamirano S/N Zona Alalay Sud, denominado en adelante y a los efectos del presente documento, el PROVEEDOR.`, styles: { halign: 'justify' }, colSpan: 3 }],
    [{ content: `2. JORGE ORMACHEA, representado por…………………………………………………… con C.I……………………….; a quién en lo sucesivo y para efectos del presente contrato se denominará, el CLIENTE.`, styles: { halign: 'justify' }, colSpan: 3 }],
    [{ content: "SEGUNDA: (OBJETO).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: `El objeto del presente Contrato es la Provisión del Servicio de Mantenimiento Preventivo y Mantenimiento Correctivo de Un (1) Ascensor, a ser realizado por el PROVEEDOR en favor del CLIENTE, instalados en el Edificio ………, de la ciudad de LA PAZ, de las características descritas a continuación, con el fin de que tengan la conservación adecuada.`, styles: { halign: 'justify' }, colSpan: 3 }]
  ];

  doc.autoTable({
    startY: currentYPosition,
    body: contractIntro,
    theme: 'plain',
    tableWidth: tableWidth,
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
    styles: { overflow: 'linebreak', fontSize: 10 },
    pageBreak: 'auto',
    rowPageBreak: 'avoid',
  });

  currentYPosition = doc.lastAutoTable.finalY + 10;

  // Tabla 2: Ítem del equipo
  const equipmentInfo = [
    ["ÍTEM", "EQUIPO"],
    ["1", "Ciudad: SANTA CRUZ"],
    ["Cantidad: 1 Ascensor", "Marca: ELEVATEC"],
    ["Paradas: 3", "Capacidad: 3"],
    ["Tipo: Eléctrico", ""]
  ];

  doc.autoTable({
    startY: currentYPosition,
    body: equipmentInfo,
    theme: 'grid',
    tableWidth: tableWidth,
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
    styles: { fontSize: 10, halign: 'left' },
    pageBreak: 'avoid',
  });

  currentYPosition = doc.lastAutoTable.finalY + 10;

  // Tabla 3: Descripción del servicio en 3 columnas
  const serviceDescription = [
    [{ content: "TERCERA: (DESCRIPCIÓN DEL SERVICIO).-", styles: { fontStyle: 'bold', halign: 'justify' }, colSpan: 3 }],
    [{ content: "El servicio que brindará el PROVEEDOR contempla:", colSpan: 3, styles: { halign: 'justify' } }],
    [{ content: "I. MANTENIMIENTO PREVENTIVO:", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [" ", "1.", "El Servicio de Mantenimiento Preventivo será proporcionado una (1) vez al mes de acuerdo a fechas y horarios establecidos entre partes."],
    
    [{ content: "II. MANTENIMIENTO CORRECTIVO:", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [" ", "1.", "El Servicio de Emergencia será proporcionado todas las veces que sea necesario, vigencia las 24 horas al día, los 7 días a la semana y los 365 días del año, contando Jalmeco Ltda. con números de teléfono fijos para atención en horario de oficina y números celulares disponibles para atención en cualquier otro horario."],
    [" ", "2.", "En caso de que los equipos requieran de cambio de piezas, el mismo será realizado previa presentación de un informe técnico que indique el diagnóstico y el costo de los componentes originales que requieran su cambio. El tiempo estimado para la restitución será de 24 a 48 horas para partes y componentes de existencia en el mercado local y de 30 días cuando se requiera fabricación e importación de los mismos."],
    [" ", "3.", "En caso de autorizar el cambio o sustitución de las piezas dañadas, el PROVEEDOR se compromete a presentar la correspondiente factura proforma."],
    [" ", "4.", "Los repuestos a sustituirse deberán ser originales."],
    [" ", "5.", "Una vez autorizado el cambio de los repuestos que se encuentren en mal estado, estos deberán ser devueltos al CLIENTE."],
  
    [{ content: "CUARTA: (DE LAS OBLIGACIONES DEL PROVEEDOR).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [" ", "•", "Realizar el servicio objeto del presente contrato en forma eficiente, oportuna y en el lugar de destino convenido."],
    [" ", "•", "Durante cada mantenimiento preventivo se realizarán trabajos de limpieza, regulación, ajuste, control de instrumental eléctrico y/o electrónico para el funcionamiento de piezas vitales como ser: Máquina de tracción y polea de desvío, freno, regulador de velocidad, entre otros."],
    [" ", "•", "Limpieza de cabinas de Ascensor."],
    [" ", "•", "Engrase y lubricado de todos aquellos componentes del ascensor que lo requieran en cada revisión programada."],
    [" ", "•", "Acudir en caso de emergencia cuando se detecten fallas que puedan alterar el buen funcionamiento de los equipos."],
  
    [{ content: "QUINTA: (DE LAS OBLIGACIONES DEL CLIENTE).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [" ", "•", "Permitir el acceso de técnicos del PROVEEDOR, colaborando al desempeño del servicio; con la obligación de los técnicos de presentar su identificación para el acceso al ascensor."],
    [" ", "•", "No permitir el acceso de personas ajenas a la sala de máquinas y demás instalaciones del ascensor."],
    [" ", "•", "No permitir el cambio de piezas o revisión por personal ajeno al PROVEEDOR. La contravención implica la anulación del contrato, ya que se trata de equipos electrónicos regulados por personal especializado."],
    [" ", "•", "Tener el Ascensor sin códigos de acceso en el control electrónico para un buen desempeño del trabajo."],
    [" ", "•", "Visar el Registro de Control de Mantenimiento Preventivo de Ascensores en cada una de las revisiones de mantenimiento realizadas por el PROVEEDOR."],
    [" ", "•", "Autorizar a los técnicos para la sustitución de piezas previa demostración del defecto de las mismas, siendo el costo del cambio con cargo al CLIENTE."],
  
    [{ content: "SEXTA: (TÉRMINO Y RENOVACIÓN DE CONTRATO).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "El presente contrato tendrá validez de Dos (2) años calendario, computable a partir del 02 de Septiembre de 2024 hasta el 02 de Agosto de 2026, y será renovable por períodos iguales, mediante comunicación escrita por parte del CLIENTE al PROVEEDOR.", colSpan: 3, styles: { halign: 'justify' } }],
  
    [{ content: "SEPTIMA: (DEL MONTO, MONEDA Y FORMA DE PAGO).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "El importe aceptado por las partes para la prestación del Servicio de Mantenimiento Preventivo y Correctivo de un (1) Ascensor es de Bs. 400,00 (Cuatrocientos 00/100 bolivianos), pagaderos de forma mensual y contra entrega de factura oficial correspondiente.", colSpan: 3, styles: { halign: 'justify' } }],
  
    [{ content: "OCTAVA: (CONFIDENCIALIDAD).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "El CLIENTE se compromete a no revelar a terceros ninguna información que comprometa o pueda perjudicar los derechos de propiedad intelectual, marcas y patentes del fabricante o del PROVEEDOR.", colSpan: 3, styles: { halign: 'justify' } }],
  
    [{ content: "NOVENA: (CLAUSULA ARBITRAL).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "Cualquier controversia que surja será resuelta en arbitraje administrado por el Centro de Conciliación y Arbitraje de la Cámara Nacional de Comercio de Bolivia.", colSpan: 3, styles: { halign: 'justify' } }],
  
    [{ content: "DÉCIMA: (ACEPTACIÓN).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "Las partes abajo firmantes aceptan todas las cláusulas del presente contrato sin vicio alguno del consentimiento.", colSpan: 3, styles: { halign: 'justify' } }],
  
    [{ content: "Santa Cruz, 02 de agosto de 2024", styles: { halign: 'center', fontStyle: 'bold' }, colSpan: 3 }]
  ];

  doc.autoTable({
    startY: currentYPosition,
    body: serviceDescription,
    theme: 'plain',
    tableWidth: tableWidth,
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
    styles: {
        fontSize: 10,
        overflow: 'linebreak',
        halign: 'justify',
        cellPadding: { top: 2, bottom: 2 } // Reducir el padding entre filas
    },
    columnStyles: {
      0: { cellWidth: 2 },
      1: { cellWidth: 8 }, // Ajuste del ancho máximo de 5mm para viñetas y números
      2: { halign: 'justify' } // Justificación para el texto
    },
    pageBreak: 'auto',
    rowPageBreak: 'avoid',
});

  currentYPosition = doc.lastAutoTable.finalY + 10;

  // Tabla de firmas (3 columnas con igual ancho y alto de 3 cm)
  const signatureTable = [
    [{ content: " ", colSpan: 3, styles: { minCellHeight: 40 } }],
    [
      { content: "Sr. Alvaro G. Jaldin Navia", styles: { halign: 'center', cellWidth: 'auto' } },
      { content: " ", styles: { halign: 'center', cellWidth: 'auto' } },
      { content: "……………………………………………", styles: { halign: 'center', cellWidth: 'auto' } }
    ],
    [
      { content: "C.I. 6550173 Cbba", styles: { halign: 'center', cellWidth: 'auto' } },
      { content: " ", styles: { halign: 'center', cellWidth: 'auto' } },
      { content: "C.I…………………………………..", styles: { halign: 'center', cellWidth: 'auto' } }
    ],
    [
      { content: "PROVEEDOR", styles: { halign: 'center', cellWidth: 'auto' } },
      { content: " ", styles: { halign: 'center', cellWidth: 'auto' } },
      { content: "CLIENTE", styles: { halign: 'center', cellWidth: 'auto' } }
    ]
  ];

  doc.autoTable({
    startY: currentYPosition,
    body: signatureTable,
    theme: 'plain',
    tableWidth: 'auto',
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
    styles: { halign: 'center', valign: 'middle', cellPadding: { top: 1, bottom: 1 } },
    pageBreak: 'avoid', // Deja que las tablas normales se ajusten  
});


  return doc.lastAutoTable.finalY;
};

export default MainContent;
