import { db } from "./config.js";
import { nameRegex,emailRegex,passwordRegex } from "./services/validation.js";
import {collection,addDoc,query, where, getDocs} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const applyForm = document.getElementById("applyform");
    const loginForm = document.getElementById("loginform");

    if (applyForm) {
    applyForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const officialaccount = document.getElementById("officialaccount").value;
        const message = document.getElementById("message").value;

        if (!nameRegex(name)) {
        alert("Please enter a valid name.");
        return;
        }
        if (!emailRegex(email)) {
        alert("Please enter a valid email.");
        return;
        }

        try {
        await addDoc(collection(db, "application"), {
            name,
            email,
            officialaccount,
            message,
            date_of_apply: new Date(),
            fromteam: false,
            status: "pending",
        });

        alert("Registration successful!");
        window.location.href = "../index.html";
        } catch (error) {
        console.error("Error adding document:", error);
        alert("Something went wrong while submitting your request.");
        }
    });
    }

    if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        if (!emailRegex(email)) {
        alert("Please enter a valid email.");
        return;
        }
        try {   
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        alert("Login successful!");
    const q = query(collection(db, "User"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert("No User record found for this user.");
        return;
    }

    let userData;
    querySnapshot.forEach((doc) => {
        userData = doc.data();
    });

    const role = userData.role;

    if (role === "admin") {
        window.location.href = "/screens/admin/dashboard.html";
    } else if (role === "journalist") {
        window.location.href = "/screens/journalist/dashboard.html";
    } else {
        alert("Unknown user role.");
    }
        } catch (error) {
            alert("Login failed. Please check your credentials.");
        console.error("Error signing in:", error);
        }
    });
    }
});

export { db };
