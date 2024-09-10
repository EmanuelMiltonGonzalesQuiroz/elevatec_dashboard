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

const sanitizeDocId = (id) => {
    return id ? id.replace(/\//g, '_') : 'unknown_id'; // Replace '/' with '_' to ensure valid Firestore document IDs
};

const collectionExists = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return !querySnapshot.empty; // If there are documents, the collection exists
};

const loadJsonFilesToFirestore = async () => {
    console.log('loadJsonFilesToFirestore function is being called');

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
        { data: liftsData, collectionName: 'lifts_m' }
    ];

    for (const { data, collectionName } of jsonFiles) {
        const exists = await collectionExists(collectionName);

        if (exists) {
        } else {

            if (Array.isArray(data)) {
                for (const item of data) {
                    let className;

                    if (item.clase) {
                        // If 'clase' exists, use it to generate the document ID
                        className = sanitizeDocId(item.clase);
                    } else if (item.pisos) {
                        // If 'pisos' exists, use it as the document ID
                        className = `pisos_${item.pisos}`;
                    } else if (item.metros) {
                        // If 'metros' exists, use it as the document ID
                        className = `metros_${item.metros}`;
                    } else {
                        // Default to a generic ID if no relevant field is found
                        className = 'unknown_id';
                    }

                    const newDocRef = doc(collection(db, collectionName), className);
                    await setDoc(newDocRef, { ...item });
                }
            } else {
                for (const [className, items] of Object.entries(data)) {
                    const sanitizedClassName = sanitizeDocId(className); // Sanitize the class name to create a valid document ID
                    const newDocRef = doc(collection(db, collectionName), sanitizedClassName);
                    await setDoc(newDocRef, { items });
                }
            }
        }
    }
};

export default loadJsonFilesToFirestore;
