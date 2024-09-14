import { db } from './firebase.js';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import groupsData from './Jsons/groups.json';
import elementsData from './Jsons/elements.json';
import motorsData from './Jsons/motors.json';
import doorsData from './Jsons/doors.json';
import priceTableData from './Jsons/price_table.json';
import basicConfigData from './Jsons/basic_config.json';
import internalConfigData from './Jsons/internal.json';
import carLiftsData from './Jsons/Car lifts M.json';
import escalatorData from './Jsons/Escalator M.json';
import forkliftsData from './Jsons/Forklifts M.json';
import liftsData from './Jsons/Lifts M.json';
import maneuverData from './Jsons/maneuver.json'; // Nueva colección importada

// Función para sanitizar los IDs de los documentos
const sanitizeDocId = (id) => {
    return id ? id.replace(/\//g, '_') : 'unknown_id'; // Reemplaza '/' por '_' para garantizar IDs válidos
};

// Función que verifica si la colección existe y contiene documentos
const collectionExists = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return !querySnapshot.empty; // Si hay documentos, la colección existe
};

// Función principal que carga los archivos JSON a Firestore
const loadJsonFilesToFirestore = async () => {
    console.log('loadJsonFilesToFirestore function is being called');

    // Lista de archivos JSON a cargar en Firestore
    const jsonFiles = [
        { data: groupsData, collectionName: 'groups' },
        { data: elementsData, collectionName: 'elements' },
        { data: motorsData, collectionName: 'motors' },
        { data: doorsData, collectionName: 'doors' },
        { data: priceTableData, collectionName: 'price_table' },
        { data: basicConfigData, collectionName: 'basic_config' },
        { data: internalConfigData, collectionName: 'internal_config' },
        { data: carLiftsData, collectionName: 'car_lifts_m' },
        { data: escalatorData, collectionName: 'escalator_m' },
        { data: forkliftsData, collectionName: 'forklifts_m' },
        { data: liftsData, collectionName: 'lifts_m' },
        { data: maneuverData, collectionName: 'maneuver' } // Nueva colección 'maneuver'
    ];

    // Itera sobre cada archivo JSON y carga su contenido a Firestore
    for (const { data, collectionName } of jsonFiles) {
        const exists = await collectionExists(collectionName);

        // Solo insertar si la colección no existe o está vacía
        if (!exists) {
            if (Array.isArray(data)) {
                // Si los datos son un array, inserta cada ítem como documento individual
                for (const item of data) {
                    let className;

                    // Verifica qué campo usar para generar el ID del documento
                    if (item.clase) {
                        className = sanitizeDocId(item.clase);
                    } else if (item.pisos) {
                        className = `pisos_${item.pisos}`;
                    } else if (item.metros) {
                        className = `metros_${item.metros}`;
                    } else {
                        className = 'unknown_id';
                    }

                    const newDocRef = doc(collection(db, collectionName), className);

                    // Inserta el documento en Firestore (sin actualizaciones)
                    await setDoc(newDocRef, { ...item });
                }
            } else {
                // Si los datos son un objeto, inserta cada clave como un documento
                for (const [className, items] of Object.entries(data)) {
                    const sanitizedClassName = sanitizeDocId(className);
                    const newDocRef = doc(collection(db, collectionName), sanitizedClassName);

                    // Inserta el documento en Firestore (sin actualizaciones)
                    await setDoc(newDocRef, { items });
                }
            }
        }
    }
};

export default loadJsonFilesToFirestore;
