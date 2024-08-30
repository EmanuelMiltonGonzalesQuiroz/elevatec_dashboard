import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../connection/firebase';

export async function validateUserCredentials(email, password) {
    try {
        const usersRef = collection(db, "login firebase");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No se encontró el email en Firestore.");
            return { success: false };
        } else {
            let userDoc;
            querySnapshot.forEach((doc) => {
                userDoc = doc.data();
                console.log("Datos obtenidos de Firestore:", userDoc);
            });

            if (userDoc.password === password) {
                console.log("Credenciales correctas");
                return { success: true, userData: userDoc };
            } else {
                console.log("Password incorrecto.");
                return { success: false };
            }
        }
    } catch (error) {
        console.error("Error al validar las credenciales: ", error.message);
        return { success: false, error: error.message };
    }
}
