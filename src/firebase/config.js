import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDn_Vff53ruNFhYZlhVqHS2v7GeCIriEw",
  authDomain: "helbeku.firebaseapp.com",
  projectId: "helbeku",
  storageBucket: "helbeku.appspot.com",
  messagingSenderId: "499127907623",
  appId: "1:499127907623:web:eaeb848e14a222bd4d2502",
  measurementId: "G-Z9XVX6BZL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
    }
  });
}

export { database, auth };