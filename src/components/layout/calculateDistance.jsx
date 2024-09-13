// components/layout/calculateDistance.js
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRadians = (degree) => degree * (Math.PI / 180);
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lng2 - lng1);
  
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Retorna la distancia en metros
  };
  