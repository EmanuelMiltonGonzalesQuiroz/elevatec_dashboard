// Función para obtener el departamento según latitud y longitud
export const getBoliviaDepartmentByLocation = (lat, lng) => {
    if (lat >= -10 && lat <= -17 && lng >= -67 && lng <= -61) {
        return 'Beni';
    } else if (lat >= -10 && lat <= -19 && lng >= -65 && lng <= -58) {
        return 'Pando';
    } else if (lat >= -16 && lat <= -22 && lng >= -65 && lng <= -59) {
        return 'Santa Cruz';
    } else if (lat >= -14 && lat <= -17 && lng >= -69 && lng <= -65) {
        return 'La Paz';
    } else if (lat >= -16 && lat <= -18 && lng >= -67 && lng <= -65) {
        return 'Cochabamba';
    } else if (lat >= -17 && lat <= -20 && lng >= -69 && lng <= -66) {
        return 'Oruro';
    } else if (lat >= -19 && lat <= -22 && lng >= -67 && lng <= -64) {
        return 'Potosí';
    } else if (lat >= -20 && lat <= -22 && lng >= -65 && lng <= -63) {
        return 'Chuquisaca';
    } else if (lat >= -22 && lat <= -24 && lng >= -65 && lng <= -63) {
        return 'Tarija';
    } else {
        return 'Ubicación fuera de Bolivia';
    }
};

  
  // Función para obtener la ciudad más cercana según latitud y longitud
  export const getBoliviaCityByLocation = (lat, lng) => {
    if (lat >= -16.55 && lat <= -16.3 && lng >= -68.3 && lng <= -68.1) {
        return 'La Paz';
    } else if (lat >= -16.58 && lat <= -16.47 && lng >= -68.25 && lng <= -68.16) {
        return 'El Alto';
    } else if (lat >= -17.4 && lat <= -17.3 && lng >= -66.2 && lng <= -66.1) {
        return 'Cochabamba';
    } else if (lat >= -17.9 && lat <= -17.7 && lng >= -63.3 && lng <= -63.1) {
        return 'Santa Cruz de la Sierra';
    } else if (lat >= -19.1 && lat <= -19.0 && lng >= -65.3 && lng <= -65.2) {
        return 'Sucre';
    } else if (lat >= -19.6 && lat <= -19.5 && lng >= -65.8 && lng <= -65.7) {
        return 'Potosí';
    } else if (lat >= -17.98 && lat <= -17.95 && lng >= -67.15 && lng <= -67.1) {
        return 'Oruro';
    } else if (lat >= -14.83 && lat <= -14.80 && lng >= -64.90 && lng <= -64.87) {
        return 'Trinidad';
    } else if (lat >= -21.54 && lat <= -21.53 && lng >= -64.73 && lng <= -64.72) {
        return 'Tarija';
    } else if (lat >= -11.0 && lat <= -10.9 && lng >= -68.8 && lng <= -68.7) {
        return 'Cobija';
    } else if (lat >= -17.78 && lat <= -17.7 && lng >= -63.18 && lng <= -63.08) {
        return 'Montero';
    } else if (lat >= -18.14 && lat <= -18.05 && lng >= -63.84 && lng <= -63.74) {
        return 'Warnes';
    } else if (lat >= -17.38 && lat <= -17.33 && lng >= -66.21 && lng <= -66.17) {
        return 'Sacaba';
    } else if (lat >= -18.28 && lat <= -18.22 && lng >= -64.27 && lng <= -64.21) {
        return 'Yacuiba';
    } else if (lat >= -15.57 && lat <= -15.50 && lng >= -68.69 && lng <= -68.60) {
        return 'Rurrenabaque';
    } else if (lat >= -16.4 && lat <= -16.3 && lng >= -63.1 && lng <= -63.0) {
        return 'San Ignacio de Velasco';
    } else if (lat >= -16.12 && lat <= -16.1 && lng >= -60.58 && lng <= -60.55) {
        return 'Puerto Quijarro';
    } else if (lat >= -14.80 && lat <= -14.70 && lng >= -64.85 && lng <= -64.75) {
        return 'San Borja';
    } else {
        return getBoliviaDepartmentByLocation(lat, lng);
    }
};

  