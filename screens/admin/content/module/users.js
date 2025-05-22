console.log("users.js loaded successfully!");

import { db } from "../../../../config.js";
import {
  collection,
  getDocs,updateDoc, doc
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


export async function loadUsers() {
  console.log("users.js loaded successfully!");

  const usersCollection = collection(db, "User");
  const querySnapshot = await getDocs(usersCollection);
  const users = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    users.push({
      id: doc.id,
      name: data.name,
      email: data.email || "N/A",
      isactive: data.isactive ,
      createdAt: data["created-at"]
        ? new Date(data["created-at"].seconds * 1000).toLocaleDateString()
        : "N/A",
      role: data.role,
    });
  });

  console.log("Users fetched:", users);
  showUsersByRole(users);
}



function showUsersByRole(users) {
  const roles = ["admin","normal_user", "journalist", "team"];
  roles.forEach((role) => {
    const container = document.querySelector(`#${role} .users`);
    if (!container) {
      console.error(`Container for role ${role} not found!`);
      return;
    }

    const filtered = users.filter((u) => u.role === role);
    console.log(`Rendering ${filtered.length} users for role: ${role}`);
    container.innerHTML = filtered.length
      ? `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Created At</th><th>Is Active</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map(
              (u) => `
              <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.createdAt}</td>
                ${u.role === "normal_user" 
                  ? `<td>this is normal_user</td>` 
                  : `<td>
                      ${u.isactive ? "Active" : "Inactive"}
                      <button class="btn btn-sm btn-${u.isactive ? "danger" : "success"} toggle-status-btn" data-id="${u.id}" data-status="${u.isactive}">
                        ${u.isactive ? "Deactivate" : "Activate"}
                      </button>
                    </td>`}
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `
      : "<p>No users in this category.</p>";
      document.querySelectorAll(".toggle-status-btn").forEach((btn) => {
        const newBtn = btn.cloneNode(true);
        btn.replaceWith(newBtn);

        newBtn.addEventListener("click", async (e) => {
          const userId = newBtn.getAttribute("data-id");
          const currentStatus = newBtn.getAttribute("data-status") === "true";
      
          const userRef = doc(db, "User", userId);
          try{
          await updateDoc(userRef, {
            isactive: !currentStatus,
          });
          alert(`User has been ${!currentStatus ? "activated" : "deactivated"}.`);
          loadUsers(); 
        }catch (error) {
          console.error("Error updating user status:", error);
          alert("Failed to update user status.");
        }
        });
      });
      
  });
}
  
loadUsers();
