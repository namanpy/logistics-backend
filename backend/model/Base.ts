import { App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

export  class Base {

    static firebaseApp : App;
    static db : Firestore;


    static setFirebase(firebaseApp : App)  : void {
        Base.firebaseApp = firebaseApp;
        Base.db = getFirestore(Base.firebaseApp);
        
    }
} 
