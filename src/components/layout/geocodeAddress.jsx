// utils/geocodeAddress.js

export const geocodeAddress = async (address, markerPosition, setMarkerPosition) => {
    if (!address || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    const lat = markerPosition.lat;
    const lng = markerPosition.lng;
    const delta = 0.2; // Limitar el cambio en latitud y longitud a un máximo de 0.2 grados

    return new Promise((resolve, reject) => {
        geocoder.geocode(
            {
                address,
                componentRestrictions: { country: 'BO' }, // Restringir a Bolivia
            },
            (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    const newLocation = {
                        lat: location.lat(),
                        lng: location.lng(),
                    };

                    // Validar que la diferencia de latitud y longitud no supere el delta de 0.2 grados
                    if (
                        Math.abs(newLocation.lat - lat) <= delta &&
                        Math.abs(newLocation.lng - lng) <= delta
                    ) {
                        setMarkerPosition(newLocation);
                        resolve(newLocation);
                    } 
                } 
            }
        );
    });
};

