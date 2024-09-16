import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../connection/firebase';

export async function validateUserCredentials(email, password) {
    try {
        const usersRef = collection(db, "login firebase");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { success: false };
        } else {
            let userDoc;
            querySnapshot.forEach((doc) => {
                userDoc = doc.data();
            });

            if (userDoc.password === password) {
                return { success: true, userData: userDoc };
            } else {
                return { success: false };
            }
        }
    } catch (error) {
        console.error("Error al validar las credenciales: ", error.message);
        return { success: false, error: error.message };
    }
}
