// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDn_Vff53ruNFhYZlhVqHS2v7GeCIriEw",
  authDomain: "helbeku.firebaseapp.com",
  projectId: "helbeku",
  storageBucket: "helbeku.appspot.com",
  messagingSenderId: "499127907623",
  appId: "1:499127907623:web:eaeb848e14a222bd4d2502",
  measurementId: "G-Z9XVX6BZL2"
};

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
    }
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const database = getDatabase(app);

export {database};