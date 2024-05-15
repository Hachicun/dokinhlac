import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyCmTY1E23andMrelb0724IQptrg2yirWII",
    authDomain: "thietchancra.firebaseapp.com",
    projectId: "thietchancra",
    storageBucket: "thietchancra.appspot.com",
    messagingSenderId: "487309131835",
    appId: "1:487309131835:web:27b4f88fb20d57ff359c1e"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export
const auth = getAuth(app);

export { auth, app };
