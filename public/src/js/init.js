// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

export {app, db}

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZuYXvo_VZeubaDt23smtTyFoANLRBZzQ",
    authDomain: "project-freud-e-9982a.firebaseapp.com",
    databaseURL: "https://project-freud-e.firebase.io",
    projectId: "project-freud-e-9982a",
    storageBucket: "project-freud-e-9982a.appspot.com",
    messagingSenderId: "17105590363",
    appId: "1:17105590363:web:290a0f7e84f58348b0c77e",
    measurementId: "G-NZC87WMLXX"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





