// crud.js: Maneja la lógica de la base de datos
import { auth, db } from './firebase-config.js';
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore"; 

    export async function signupUser(username, password) {
        try {
            // Genera un UID único para cada usuario
            const userRef = doc(collection(db, "login firebase"));
            await setDoc(userRef, {
                username: username,
                password: password,  // Nota: En producción, debes cifrar las contraseñas
                role: 'Usuario'
            });
            console.log(`Usuario registrado con éxito.`);
            
            // Verifica la creación del usuario
            await showAllData();
        } catch (error) {
            console.error("Error en el registro: ", error.message);
        }
    }
