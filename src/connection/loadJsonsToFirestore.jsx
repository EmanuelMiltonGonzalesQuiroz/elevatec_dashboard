// src/connection/loadJsonsToFirestore.jsx
import { db } from './firebase.js';
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import groupsData from './Jsons/groups.json';
import elementsData from './Jsons/elements.json';
import motorsData from './Jsons/motors.json';
import doorsData from './Jsons/doors.json';
import priceTableData from './Jsons/price_table.json';
import basicConfigData from './Jsons/basic_config.json';
import internalConfigData from './Jsons/internal.json'; // Import the JSON files directly

const sanitizeDocId = (id) => {
    return id.replace(/\//g, '_'); // Replace '/' with '_' to ensure valid Firestore document IDs
};

const deleteCollection = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
};

const loadJsonFilesToFirestore = async () => {
    console.log('loadJsonFilesToFirestore function is being called'); // Debugging line

    const jsonFiles = [
        { data: groupsData, collectionName: 'groups' },
        { data: elementsData, collectionName: 'elements' },
        { data: motorsData, collectionName: 'motors' },
        { data: doorsData, collectionName: 'doors' },
        { data: priceTableData, collectionName: 'price_table' },
        { data: basicConfigData, collectionName: 'basic_config' },
        { data: internalConfigData, collectionName: 'internal_config' }
    ];

    for (const { data, collectionName } of jsonFiles) {
        console.log(`Deleting existing documents in collection: ${collectionName}`);
        await deleteCollection(collectionName); // Delete all documents in the collection before adding new ones

        console.log(`Processing collection: ${collectionName}`); // Debugging line
        if (Array.isArray(data)) {
            for (const item of data) {
                const className = sanitizeDocId(item.clase); // Sanitize the class name to create a valid document ID
                const newDocRef = doc(collection(db, collectionName), className);
                await setDoc(newDocRef, { items: item.items });
                console.log(`Data for ${className} loaded into collection: ${collectionName}`); // Debugging line
            }
        } else {
            for (const [className, items] of Object.entries(data)) {
                const sanitizedClassName = sanitizeDocId(className); // Sanitize the class name to create a valid document ID
                const newDocRef = doc(collection(db, collectionName), sanitizedClassName);
                await setDoc(newDocRef, { items });
                console.log(`Data for ${sanitizedClassName} loaded into collection: ${collectionName}`); // Debugging line
            }
        }
    }
};

export default loadJsonFilesToFirestore;
