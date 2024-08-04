// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "Enter Your Own API Key",
  authDomain: "inventory-management-fbd9a.firebaseapp.com",
  projectId: "inventory-management-fbd9a",
  storageBucket: "inventory-management-fbd9a.appspot.com",
  messagingSenderId: "301895138089",
  appId: "1:301895138089:web:c509ab4a0848afbb7b5538",
  measurementId: "G-TJBXQLNFGD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}
