        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
        import { getFirestore } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js"; 
        import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const firebaseConfig = {
            apiKey: "AIzaSyBL5XBxLGdcy0lj6iuTZ0eHbWR6btqkpvM",
            authDomain: "shopsmartudemy.firebaseapp.com",
            projectId: "shopsmartudemy",
            storageBucket: "shopsmartudemy.firebasestorage.app",
            messagingSenderId: "163858517594",
            appId: "1:163858517594:web:78326e7541443b2d051263",
            measurementId: "G-MLV97TMJ4P"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const db = getFirestore(app);
        const auth = getAuth(app);
        console.log(app);
        console.log(analytics);

        export { app, db ,auth};