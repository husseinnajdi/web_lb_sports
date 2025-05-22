import { db } from "../../../../config.js";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { collection, setDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { nameRegex, emailRegex, passwordRegex } from "../../../../services/validation.js";
console.log("adduser.js loaded");
async function addUser(name, email, password, role) {
    const usersCollection = collection(db, "User");
    if (!nameRegex.test(name)) {
        alert("Invalid name format");
        return;
    }
    if (!emailRegex.test(email)) {
        alert("Invalid email format");
        return;
    }
    if (!passwordRegex.test(password)) {
        alert("Invalid password format");
        return;
    }
    try {
        const userData = {
            name: name,
            email: email,
            password: password,
            role: role,
            "created-at": new Date(),
            isactive: true,
        };

        if (role === "journalist") {
            userData.profileImage = "";
        } else if (role === "team") {
            userData.teamLogo = "";
            userData.hasOfficialAccount = false;
        }
        const newuser=await createUserWithEmailAndPassword(email,password);
        const userid=newuser.user.uid;
        await setDoc(doc(db,"User",userid),userData);
        console.log("User added successfully!");
        alert("User added successfully!");
    } catch (error) {
        console.error("Error adding user:", error);
        alert("Failed to add user. Check the console for details.");
    }
}

document.getElementById("addUserForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    await addUser(name, email, password, role);
});
