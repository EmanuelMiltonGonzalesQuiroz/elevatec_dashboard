// src/components/common/Text/texts.js
export const loginText = {
  title: "Iniciar Sesión",
  emailPlaceholder: "Email",
  passwordPlaceholder: "Contraseña",
  button: "Iniciar sesión",
  validationError: "Por favor, complete todos los campos.",
  loginError: "Nombre de usuario o contraseña incorrectos.",
};

export const homeText = {
  quotations: "Cotizaciones",
  clients: "Clientes",
  users: "Usuarios",
  settings: "Ajustes Cotizaciones",
  profile:"Perfil",
  logoutButton: "Cerrar Sesión",
  generateQuotation: "Generar Cotización",
  resetData: "Resetear datos",
  searchClient: "Buscar cliente",
  persons: "Personas",
  stops: "Paradas",
  floors: "Pisos a atender",
  advancedOptions: "Opciones avanzadas",
  listOfQuotations: "Lista de cotizaciones",
  selectDate: "Seleccione fecha",
  number: "#",
  client: "Cliente",
  clientPhone: "Tel. Cliente",
  city: "Ciudad",
  quotedBy: "Cotizado por",
  total: "Total",
  date: "Fecha",
  actions: "Acciones",
  tabQuotations: "Cotizar",
  tabQuotationsList: "Lista de cotizaciones",
  maintenance: "Mantenimiento",
  maintenanceSettings: "Ajustes de Mantenimiento",
  location:"Ubicación",
  company:"ELEVATEC"

};
export const clientColumnText = {
  searchClient: "Buscar cliente",
  searchSolicitante: "Solicitante",
  seller: "Vendedor",
  generateQuotation: "Generar Cotización",
  resetData: "Resetear datos",
};

export const usersText = {
  title: "Gestión de Usuarios",
  addUser: "Agregar Usuario",
  editUser: "Editar Usuario",
  deleteUser: "Eliminar Usuario",
  username: "Nombre de Usuario",
  email: "Correo Electrónico",
  role: "Rol",
  actions: "Acciones",
  noUsers: "No hay usuarios disponibles.",
  password:"Contraseña",
  phone: "Teléfono",
  add:"Añadir",
  update: "Actualizar",
  cancel: "Cancelar",
  edit: "Editar",
  delete: "Eliminar",
};

export const quotationsText = {
  tabQuotations: "Cotizar",
  tabQuotationsList: "Lista de cotizaciones",
  generatePDF: "Generar PDF",
  selectDate: "Seleccione fecha",
  listOfQuotations: "Lista de cotizaciones",
  number: "#",
  client: "Cliente",
  clientPhone: "Tel. Cliente",
  city: "Ciudad",
  quotedBy: "Cotizado por",
  total: "Total",
  date: "Fecha",
  actions: "Acciones",
};
export const basicConfigurationsText = {
  title: "Configuraciones Básicas",
  index: "Índice",
  name: "Nombre",
  value: "Valor",
  actions: "Acciones",
};

export const priceTableText = {
  title: "Tabla de Precios",
  index: "Índice",
  name: "Nombre",
  volumen: "Volumen por pieza m3",
  price: "Precio Unitario",
  actions: "Acciones",
};

export const elementsText = {
  title: "Elementos",
  index: "Índice",
  name: "Nombre",
  value: "Valor",
  type: "Tipo",
  description: "Descripción",
  actions: "Acciones",
};
export const settingsText = {
  groups: "Grupos",
  elements: "Elementos",
  motors: "Motores",
  doors: "Puertas",
  priceTable: "Tabla de Precios",
  basicConfigurations: "Configuraciones Básicas",
  internalConfigurations: "Configuraciones Internas",
};
export const groupsText = {
  title: "Grupo: ",
  number: "#",
  name: "Nombre",
  value: "Valor",
  description: "Descripción",
  actions: "Acciones",
  edit: "Editar",
  type: "Tipo: "
};

export const doorsText = {
  title: "Puerta: ",
  number: "#",
  measure: "Medida",
  cabina: "C. Inoxidable",
  cDeVidrio: "C. de vidrio",
  cDeEpoxi: "C. de Epoxi",
  pDeVidrio: "P. de vidrio",
  pInox: "P. Inox",
  pEpoxi: "P. Epoxi",
  actions: "Acciones",
  type: "Tipo: ",
};

export const editableformText = {
  title:"Editar: ",
  update: "Actualizar",
  cancel: "Cancelar"
}

export const internalConfigurationsText = {
  title: "Configuración Interna: ",
  number: "#",
  speed: "Velocidad (m/s)",
  price: "Precio",
  actions: "Acciones",
  type: "Tipo: "
};
export const motorsText = {
  title: "Motor: ",
  number: "#",
  persons: "Personas",
  gearleesPower: "Gearlees Potencia",
  gearleesPrice: "Gearlees Precio",
  gearleesChannels: "Gearlees Canales",
  withReducerPower: "Con Reduc. Potencia",
  withReducerPrice: "Con Reduc. Precio",
  withReducerChannels: "Con Reduc. Canales",
  actions: "Acciones",
  type: "Tipo: "
};

export const ConfigurableTableText = {
  Actions: "Acciones",
  edit: "Editar",
}

const redAsterisk = <span style={{ color: 'red' }}>*</span>;

export const mainFormColumn1Text = {
  persons: <>{redAsterisk} Personas</>,
  personsConcept: "El numero de personas que como maximo usaran el ascensor",
  client: <>{redAsterisk} Cliente</>,
  clientConcept: "",
  stops: <>{redAsterisk} Paradas</>,
  stopsConcept: "",
  recorrido: <>{redAsterisk} Recorrido (m)</>,
  recorridoConcept: "",
  numberDoors: <>{redAsterisk} Número de puertas</>,
  numberDoorsConcept: "",
  inoxDoors: <>{redAsterisk} Inox</>,
  inoxDoorsConcept: "",
  epoxiDoors: <>{redAsterisk} Epoxi</>,
  epoxiDoorsConcept: "",
  vidrioDoors: <>{redAsterisk} Vidrio</>,
  vidrioDoorsConcept: "",
  assignStop: <>{redAsterisk} Asignar Parada</>,
  assignStopConcept: "",
  floorsToAttend: <>{redAsterisk} Pisos a atender</>,
  floorsToAttendConcept: "",
  pozo: <>{redAsterisk} Pozo (mm)</>,
  pozoConcept: "",
  front: <>{redAsterisk} Frente (mm)</>,
  frontConcept: "",
  depth: <>{redAsterisk} Profundidad (mm)</>,
  depthConcept: "",
  pit: <>{redAsterisk} Foso (mm)</>,
  pitConcept: "",
  height: <>{redAsterisk} Huida (mm)</>,
  heightConcept: "",
  numElevators: <>{redAsterisk} Número de ascensores</>,
  numElevatorsConcept: "",
  doorError: "La suma de las puertas debe ser igual a las paradas",
};



export const mainFormColumn2Text = {
  cabin: <>{redAsterisk} Cabina</>,
  cabinConcept: "",
  city: <>{redAsterisk} Ciudad</>,
  cityConcept: "",
  embark: <>{redAsterisk} Embarque</>,
  embarkConcept: "",
  electricity: <>{redAsterisk} Energía Eléctrica</>,
  electricityConcept: "",
  cabinIndicator: <>{redAsterisk} Indicador de cabina/piso</>,
  cabinIndicatorConcept: "",
  floorIndicator: <>{redAsterisk} Indicador de piso con botón Integrado</>,
  floorIndicatorConcept: "",
  tractionMachine: <>{redAsterisk} Máquina de tracción</>,
  tractionMachineConcept: "",
  traction: <>{redAsterisk} Tracción</>,
  tractionConcept: "",
  speed: <>{redAsterisk} Velocidad</>,
  speedConcept: "",
  note: <>{redAsterisk} Nota:</>,
  noteDetails: [
    "* Edificios < a 8 pisos velocidad 1m/s",
    "* Edificios entre 7 y 15 pisos velocidad 1.5m/s",
    "* Edificios > 15 pisos velocidad 1.75m/s",
    "* Edificios > 25 pisos velocidad 2m/s",
  ],
};

export const advancedOptionsText = {
  title: "Opciones avanzadas",
  doors: <>{redAsterisk} Puertas</>,
  doorsConcept: "",
  ard: <>{redAsterisk} ARD</>,
  ardConcept: "",
  cabinFinish: <>{redAsterisk} Acabado puerta de cabina</>,
  cabinFinishConcept: "",
  additionalMirror: <>{redAsterisk} Espejo Adicional</>,
  additionalMirrorConcept: "",
  horizontalFloorIndicator: <>{redAsterisk} Indicador de piso horizontal</>,
  horizontalFloorIndicatorConcept: "",
  cardReader: <>{redAsterisk} Lector de tarjetas</>,
  cardReaderConcept: "",
  additionalHandrail: <>{redAsterisk} Pasamanos adicional</>,
  additionalHandrailConcept: "",
  floor: <>{redAsterisk} Piso</>,
  floorConcept: "",
  subCeiling: <>{redAsterisk} SubTecho</>,
  subCeilingConcept: "",
  type: <>{redAsterisk} Tipo</>,
  typeConcept: "",
  controlPanel: <>{redAsterisk} Tipo de botonera</>,
  controlPanelConcept: "",
  cabinButtons: <>{redAsterisk} Tipo de botones en cabina</>,
  cabinButtonsConcept: "",
  floorButtons: <>{redAsterisk} Tipo de botones en piso</>,
  floorButtonsConcept: "",
  locks: <>{redAsterisk} Llavines con llave</>,
  locksConcept: "",
};
export const maintenanceText = {
  title: 'Ajustes de mantenimiento',
  description: 'Gestiona las opciones y parámetros de mantenimiento de la aplicación.',
  ascensoresM: 'Ascensores M.',
  montaCochesM: 'Monta coches M.',
  montacargasM: 'Montacargas M.',
  escaleraMecanicaM: 'Escalera mecánica M.',
  ascensoresMContent: 'Aquí puedes configurar las opciones de mantenimiento para Ascensores M.',
  montaCochesMContent: 'Aquí puedes configurar las opciones de mantenimiento para Monta coches M.',
  montacargasMContent: 'Aquí puedes configurar las opciones de mantenimiento para Montacargas M.',
  escaleraMecanicaMContent: 'Aquí puedes configurar las opciones de mantenimiento para Escalera mecánica M.',
  tabMaintenance: 'C. Mantenimiento',
  tabMaintenanceList: 'Lista de mantenimientos',
};

