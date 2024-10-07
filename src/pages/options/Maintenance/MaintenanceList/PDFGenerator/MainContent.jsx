import 'jspdf-autotable';
import { getBoliviaCityByLocation } from '../../../../../components/common/DepartamentOrCity';
import { convertNumberToWords } from '../../../../../components/layout/convertNumberToWords';

// Function to calculate the end date (2 years from the start date)
const calculateEndDate = (startDate) => {
  const date = new Date(startDate);
  date.setFullYear(date.getFullYear() + 2);
  return formatRecipeDate(date);
};

// Mapping to identify equipment types
const typeMapping = {
  ASC: "Ascensores",
  MCS: "Monta Coches",
  MCG: "Montacargas",
  ESM: "Escalera Mecánica"
};

// Generate summary of equipment types using the convertNumberToWords function
const generateEquipmentSummary = (filteredItems) => {
  const equipmentCount = {
    Ascensores: 0,
    "Monta Coches": 0,
    Montacargas: 0,
    "Escalera Mecánica": 0
  };

  // Iterate over filteredItems and count each type
  filteredItems.forEach((item) => {
    const equipmentType = typeMapping[item.type.type];
    if (equipmentType) {
      equipmentCount[equipmentType]++;
    }
  });

  // Generate the summary string using the count and convertNumberToWords
  const summary = [];
  Object.entries(equipmentCount).forEach(([equipment, count]) => {
    if (count > 0) {
      summary.push(`${convertNumberToWords(count)} (${count}) ${equipment}`);
    }
  });

  return summary.join(", ");
};

// Format date into 'day of month, year' format
const formatRecipeDate = (recipeDate) => {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const date = new Date(recipeDate);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
};

// Main content generation for PDF
const MainContent = ({ doc, config, startY, recipe }) => {
  const { leftMargin = 20, rightMargin = 20, topMargin = 20, bottomMargin = 20 } = config;
  const pageWidth = doc.internal.pageSize.width;
  const tableWidth = pageWidth - leftMargin - rightMargin;
  let currentYPosition = startY || 20;
  const [entero, decimales] = recipe.finalTotal.split('.'); 

  // Introductory section for the contract
  const contractIntro = [
    [{ content: "CONTRATO PRIVADO DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO DE " + generateEquipmentSummary(recipe.filteredItems).toUpperCase(), styles: { halign: 'center', fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "CÓDIGO DE CONTRATO: 0" + recipe.documentId, styles: { halign: 'left', fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: `Conste por el tenor del presente Contrato Privado de Mantenimiento Preventivo y Correctivo de ${generateEquipmentSummary(recipe.filteredItems)}, suscrito al tenor de las siguientes cláusulas:`, styles: { halign: 'justify' }, colSpan: 3 }],
    [{ content: "PRIMERA: (PARTES).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: `1. JALDIN MEJIA CONSTRUCCIONES JALMECO LTDA., Empresa legalmente constituida bajo las leyes Bolivianas, con NIT 1021629020, y representado por su Gerente Mantenimientos y Activos, Arq. Alvaro Grover Jaldin Navia con C.I. Nº 6550173 Cbba., con domicilio en la avenida Altamirano S/N Zona Alalay Sud, denominado en adelante y a los efectos del presente documento, el PROVEEDOR.`, styles: { halign: 'justify' }, colSpan: 3 }],
    [{ content: `2. ${recipe.client.name || "…………………………………………"}, representado por…………………………………………………… con C.I ${recipe.client.ciNIT || "………………………."}; a quién en lo sucesivo y para efectos del presente contrato se denominará, el CLIENTE.`, styles: { halign: 'justify' }, colSpan: 3 }],
    [{ content: "SEGUNDA: (OBJETO).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: `El objeto del presente Contrato es la Provisión del Servicio de Mantenimiento Preventivo y Mantenimiento Correctivo de ${generateEquipmentSummary(recipe.filteredItems)}, a ser realizado por el PROVEEDOR en favor del CLIENTE, instalados en el Edificio ………, de la ciudad de ${getBoliviaCityByLocation(recipe.location.lat, recipe.location.lng)}, de las características descritas a continuación, con el fin de que tengan la conservación adecuada.`, styles: { halign: 'justify' }, colSpan: 3 }]
  ];

  doc.autoTable({
    startY: currentYPosition,
    body: contractIntro,
    theme: 'plain',
    tableWidth: tableWidth,
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
    styles: { overflow: 'linebreak', fontSize: 12,cellPadding: { top: 3, bottom: 3 }  },
    pageBreak: 'auto',
    rowPageBreak: 'avoid',
  });

  currentYPosition = doc.lastAutoTable.finalY + 5;

  // Table for equipment information
  const equipmentInfo = [
    ["ÍTEM", "EQUIPO"],  // Headers
  ];

  // Dynamically generating rows for each item in filteredItems
  console.log(recipe)
  recipe.filteredItems.forEach((item) => {
    // Initial structure with the common fields
    let equipoInfo = `Ciudad: ${getBoliviaCityByLocation(recipe.location.lat, recipe.location.lng)}\nMarca: ELEVATEC\nParadas: ${item.type.floor}\nTipo: Eléctrico`;
  
    // Determine the equipment type
    switch (item.type.type) {
      case 'ASC':
        equipoInfo += `\nCapacidad: ${item.type.class || "4"}`;
        break;
      case 'ESM':
        equipoInfo = `Ciudad: ${getBoliviaCityByLocation(recipe.location.lat, recipe.location.lng)}\nMarca: ELEVATEC\nMetros: ${item.type.floor}\nTipo: Eléctrico`;
        break;
      default:
        break; // No additional info for other types
    }
  
    // Add to equipmentInfo array
    equipmentInfo.push([item.displayType, equipoInfo]);
  });
  


  doc.autoTable({
    startY: currentYPosition,
    body: equipmentInfo,
    theme: 'grid',
    tableWidth: 80,
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin+40, right: rightMargin },
    styles: { fontSize: 10, halign: 'left' },
    pageBreak: 'auto',
    rowPageBreak: 'avoid',
  });

  currentYPosition = doc.lastAutoTable.finalY + 10;

  // Description of service section
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
    [" ", "•", { content: "Realizar el servicio objeto del presente contrato en forma eficiente, oportuna y en el lugar de destino convenido.", styles: { halign: 'left'  }}],
    [" ", "•", "Durante cada mantenimiento preventivo se realizarán trabajos de limpieza, regulación, ajuste, control de instrumental eléctrico y/o electrónico para el funcionamiento de piezas vitales como ser: Máquina de tracción y polea de desvío, freno, regulador de velocidad, llaves y fusibles en sala de máquinas, cuadro de comando y conexiones del mismo, iluminación de botones y señalización de cabinas, operador de puerta, regla de seguridad, techo y puertas de cabinas, corredizas de cabina y contrapeso, aparato de seguridad, llaves de inducción, placas, emisores, receptores, piso, guías y soportes de contrapeso, límites de curso, cables de tracción, cierre electromecánico, polea de regulador de velocidad."],
    [" ", "•", "Limpieza de cabinas de Ascensor."],
    [" ", "•", "Engrase y lubricado de todos aquellos componentes del ascensor que lo requieran en cada revisión programada."],
    [" ", "•", "Acudir en caso de emergencia cuando se detecten fallas que puedan alterar el buen funcionamiento de los equipos."],
    
    [{ content: "QUINTA: (DE LAS OBLIGACIONES DEL CLIENTE).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [" ", "•", "Permitir el acceso de técnicos del PROVEEDOR, colaborando al desempeño del servicio; con la obligación de los técnicos de presentar su identificación para el acceso al ascensor."],
    [" ", "•", "No permitir el acceso de personas ajenas a la sala de máquinas y demás instalaciones del ascensor."],
    [" ", "•", "No permitir el cambio de piezas o revisión por personal ajeno al PROVEEDOR. La contravención implica la anulación del contrato, ya que se trata de equipos electrónicos regulados por personal especializado."],
    [" ", "•", "Tener el Ascensor sin códigos de acceso en el control electrónico para un buen desempeño del trabajo."],
    [" ", "•", { content:"Visar el Registro de Control de Mantenimiento Preventivo de Ascensores en cada una de las revisiones de mantenimiento realizadas por el PROVEEDOR.", styles: { halign: 'left'} }],
    [" ", "•", "Autorizar a los técnicos para la sustitución de piezas previa demostración del defecto de las mismas, siendo el costo del cambio con cargo al CLIENTE."],
    
    [{ content: "SEXTA: (TÉRMINO Y RENOVACIÓN DE CONTRATO).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: `El presente contrato tendrá validez de Dos (2) años calendario, computable a partir del ${formatRecipeDate(recipe.date)} hasta el ${calculateEndDate(recipe.date)}, y será renovable por períodos iguales, mediante comunicación escrita por parte del CLIENTE al PROVEEDOR.`, colSpan: 3, styles: { halign: 'justify' } }],

    [{ content: "SEPTIMA: (DEL MONTO, MONEDA Y FORMA DE PAGO).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "El importe aceptado por las partes para la prestación del Servicio de Mantenimiento Preventivo y Correctivo de "+generateEquipmentSummary(recipe.filteredItems)+" es de Bs. "+recipe.finalTotal+" ("+convertNumberToWords(entero)+" "+decimales+"/100 bolivianos), pagaderos de forma mensual y contra entrega de factura oficial correspondiente.", colSpan: 3, styles: { halign: 'justify' } }],
    
    [{ content: "OCTAVA: (CONFIDENCIALIDAD).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "El CLIENTE se compromete a no revelar a terceros ninguna información que comprometa o pueda perjudicar los derechos de propiedad intelectual, marcas y patentes del fabricante o del PROVEEDOR.", colSpan: 3, styles: { halign: 'justify' } }],
    
    [{ content: "NOVENA: (CLAUSULA ARBITRAL).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "Cualquier controversia que surja será resuelta en arbitraje administrado por el Centro de Conciliación y Arbitraje de la Cámara Nacional de Comercio de Bolivia.", colSpan: 3, styles: { halign: 'justify' } }],
    
    [{ content: "DÉCIMA: (ACEPTACIÓN).-", styles: { fontStyle: 'bold' }, colSpan: 3 }],
    [{ content: "Las partes abajo firmantes aceptan todas las cláusulas del presente contrato sin vicio alguno del consentimiento.", colSpan: 3, styles: { halign: 'justify' } }],
    
    [{ content: getBoliviaCityByLocation(recipe.location.lat, recipe.location.lng) + ", " + formatRecipeDate(recipe.date), styles: { halign: 'center', fontStyle: 'bold' }, colSpan: 3 }]
  ];

  doc.autoTable({
    startY: currentYPosition,
    body: serviceDescription,
    theme: 'plain',
    margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
    styles: {
      fontSize: 12,
      lineHeightFactor: 1.5,
      cellPadding: { top: 3, bottom: 3 }// Adjust line height
    },
    columnStyles: {
      0: { cellWidth: 2 },
      1: { cellWidth: 8 },
      2: { halign: 'justify' }
    },
    pageBreak: 'auto',
    rowPageBreak: 'avoid',
  });
  currentYPosition = doc.lastAutoTable.finalY + 10;

  // Signature table (3 columns with equal width and 3 cm height for each)
  const signatureTable = [
    [{ content: " ", colSpan: 3, styles: { minCellHeight: 30 } }],
    [
      { content: "Sr. Alvaro G. Jaldin Navia", styles: { halign: 'center', cellWidth: 60 } },
      { content: " ", styles: { halign: 'center', cellWidth: 30 } },
      { content: recipe.client.name || "……………………………………………", styles: { halign: 'center', cellWidth: 'auto' } }
    ],
    [
      { content: "C.I. 6550173 Cbba", styles: { halign: 'center', cellWidth: 60 } },
      { content: " ", styles: { halign: 'center', cellWidth: 30 } },
      { content: "C.I " + recipe.client.ciNIT || "…………………………………..", styles: { halign: 'center', cellWidth: 'auto' } }
    ],
    [
      { content: "PROVEEDOR", styles: { halign: 'center', cellWidth: 60 } },
      { content: " ", styles: { halign: 'center', cellWidth: 30 } },
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
    pageBreak: 'avoid', // Let the table handle page breaks
  });

  return doc.lastAutoTable.finalY;
};

export default MainContent;

