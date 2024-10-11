import { db } from './firebase.js';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

// Archivos JSON cargados
import configuracionesDeAscensor from './Jsons/configuraciones_de_ascensor.json';
import puertasTiempoTotal from './Jsons/puertas_tiempo_total.json';
import puertasDatos from './Jsons/puertas2.json';
import velocidadesTiempos from './Jsons/velocidades_tiempos.json';
import valoresDeSalto from './Jsons/valores_de_salto.json';
import puertasInfo from './Jsons/puertas.json';
import configuracionesDePisos from './Jsons/configuraciones_completas_de_pisos.json';
import configuracionesDeEdificios from './Jsons/configuraciones_de_edificios.json';

// Función que verifica si la colección existe y contiene documentos
const collectionExists = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return !querySnapshot.empty;
};

// Función principal que carga los archivos JSON a Firestore
const processTask = async () => {
    const jsonFiles = [
        { data: configuracionesDeAscensor, collectionName: 'configuraciones_de_ascensor' },
        { data: puertasTiempoTotal, collectionName: 'puertas_tiempo_total' },
        { data: puertasDatos, collectionName: 'puertas_datos' },
        { data: velocidadesTiempos, collectionName: 'velocidades_tiempos' },
        { data: valoresDeSalto, collectionName: 'valores_de_salto' },
        { data: puertasInfo, collectionName: 'puertas_info' },
        { data: configuracionesDePisos, collectionName: 'configuraciones_de_pisos' },
        { data: configuracionesDeEdificios, collectionName: 'configuraciones_de_edificios' }
    ];

    // Itera sobre cada archivo JSON y carga su contenido a Firestore
    for (const { data, collectionName } of jsonFiles) {
        // Verifica si la colección existe
        const exists = await collectionExists(collectionName);

        if (exists) {
            console.log(`La colección "${collectionName}" ya existe.`);
            const querySnapshot = await getDocs(collection(db, collectionName));
            if (!querySnapshot.empty) {
                continue; // Salta esta colección si ya contiene datos
            }
        }

        // Si la colección no existe o está vacía, crea el documento y carga los datos
        const docRef = doc(collection(db, collectionName), collectionName); // Usa el nombre de la colección como ID del documento
        await setDoc(docRef, { data }); // Sube todo el array como un solo documento
    }

    // Mostrar un alert cuando el proceso de carga finalice
};

export default processTask;
