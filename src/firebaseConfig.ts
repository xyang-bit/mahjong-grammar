import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAeg700zLPvBv_SIZxHy8MLjYB2RCCvwao",
    authDomain: "studyspark-959ac.firebaseapp.com",
    databaseURL: "https://studyspark-959ac-default-rtdb.firebaseio.com",
    projectId: "studyspark-959ac",
    storageBucket: "studyspark-959ac.firebasestorage.app",
    messagingSenderId: "529045127702",
    appId: "1:529045127702:web:2e193893d46b8f262beb37",
    measurementId: "G-LS0N6CSZGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);