import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import * as firebaseui from "firebaseui";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDTpk2xYjR3pMx5_UERgFaW73iE_zNywmA",
  authDomain: "dashboardsdb-e6bf1.firebaseapp.com",
  projectId: "dashboardsdb-e6bf1",
  storageBucket: "dashboardsdb-e6bf1.firebasestorage.app",
  messagingSenderId: "471319806329",
  appId: "1:471319806329:web:5695cebd9aef21d505efa8",
  measurementId: "G-WS7PT21HQY"
};


// Initialize Firebase

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);
export const storage = getStorage(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const firebaseUi = new firebaseui.auth.AuthUI(firebaseAuth);
firebaseAuth.useDeviceLanguage();
export { firebaseAuth };
