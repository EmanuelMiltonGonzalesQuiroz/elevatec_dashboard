// src/components/common/Text/texts.js

export const welcomeText = {
  title: "Bienvenido al Sistema",
  description: "Accede a tu cuenta para comenzar a gestionar tus proyectos.",
  button: "Iniciar Sesión",
};

export const loginText = {
  title: "Iniciar Sesión",
  usernamePlaceholder: "Nombre de usuario",
  passwordPlaceholder: "Contraseña",
  button: "Iniciar sesión",
  validationError: "Por favor, complete todos los campos.",
  loginError: "Nombre de usuario o contraseña incorrectos.",
};

export const homeText = {
  quotations: "Cotizaciones",
  clients: "Clientes",
  users: "Usuarios",
  settings: "Ajustes",
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
  cabina: "Cabina",
  cDeVidrio: "C. de vidrio",
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
  client: <>{redAsterisk} Cliente</>,
  stops: <>{redAsterisk} Paradas</>,
  recorrido: <>{redAsterisk} Recorrido (m)</>,
  numberDoors: <>{redAsterisk} Número de puertas</>,
  inoxDoors: <>{redAsterisk} Inox</>,
  epoxiDoors: <>{redAsterisk} Epoxi</>,
  vidrioDoors: <>{redAsterisk} Vidrio</>,
  assignStop: <>{redAsterisk} Asignar Parada</>,
  floorsToAttend: <>{redAsterisk} Pisos a atender</>,
  front: <>{redAsterisk} Frente (mm)</>,
  depth: <>{redAsterisk} Profundidad (mm)</>,
  pit: <>{redAsterisk} Foso (mm)</>,
  height: <>{redAsterisk} Huida (mm)</>,
  numElevators: <>{redAsterisk} Número de ascensores</>,
  doorError: "La suma de las puertas debe ser igual a las paradas",
};


export const mainFormColumn2Text = {
  cabin: <>{redAsterisk} Cabina</>,
  city: <>{redAsterisk} Ciudad</>,
  embark: <>{redAsterisk} Embarque</>,
  electricity: <>{redAsterisk} Energía Eléctrica</>,
  cabinIndicator: <>{redAsterisk} Indicador de cabina/piso</>,
  floorIndicator: <>{redAsterisk} Indicador de piso con botón Integrado</>,
  tractionMachine: <>{redAsterisk} Máquina de tracción</>,
  traction: <>{redAsterisk} Tracción</>,
  speed: <>{redAsterisk} Velocidad</>,
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
  ard: <>{redAsterisk} ARD</>,
  cabinFinish: <>{redAsterisk} Acabado puerta de cabina</>,
  additionalMirror: <>{redAsterisk} Espejo Adicional</>,
  horizontalFloorIndicator: <>{redAsterisk} Indicador de piso horizontal</>,
  cardReader: <>{redAsterisk} Lector de tarjetas</>,
  additionalHandrail: <>{redAsterisk} Pasamanos adicional</>,
  floor: <>{redAsterisk} Piso</>,
  subCeiling: <>{redAsterisk} SubTecho</>,
  type: <>{redAsterisk} Tipo</>,
  controlPanel: <>{redAsterisk} Tipo de botonera</>,
  cabinButtons: <>{redAsterisk} Tipo de botones en cabina</>,
  floorButtons: <>{redAsterisk} Tipo de botones en piso</>,
  locks: <>{redAsterisk} Llavines con llave</>,
};