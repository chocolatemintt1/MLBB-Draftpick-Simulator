
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyD7y2XwoDAydL4hMNH7NQnWNly87p29Sak",
    authDomain: "mlbb-draft-pick-simulator.firebaseapp.com",
    databaseURL: "https://mlbb-draft-pick-simulator-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "mlbb-draft-pick-simulator",
    storageBucket: "mlbb-draft-pick-simulator.appspot.com",
    messagingSenderId: "648742066343",
    appId: "1:648742066343:web:fcc2c260465a238d93a382",
    measurementId: "G-8JW46P11HY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };