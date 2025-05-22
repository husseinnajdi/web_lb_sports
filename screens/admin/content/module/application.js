import { db } from "../../../../config.js";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { nameRegex,emailRegex,passwordRegex } from "../../../../services/validation.js";

console.log("Application module loaded.");

export async function fetchAndShowUsers() {
  console.log("Fetching apply...");
  const usersCollection = collection(db, "application");
  const querySnapshot = await getDocs(usersCollection);
  const users = [];

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    users.push({
      id: docSnap.id,
      name: data.name,
      email: data.email || "N/A",
      fromTeam: data.fromteam !== undefined ? data.fromteam : false,
      officialAccount: data.officialaccount || "N/A",
      message: data.message || "N/A",
      status: data.status || "pending",
      createdAt: data["date_of_apply"]
        ? new Date(data["date_of_apply"].seconds * 1000).toLocaleDateString()
        : "N/A",
    });
  });

  console.log("Users fetched:", users);
  showUsersByStatus(users);
}

function showUsersByStatus(users) {
  const statuses = ["pending", "approved", "rejected"];
  statuses.forEach((status) => {
    const container = document.querySelector(`#${status} .users`);
    if (!container) {
      console.error(`Container for status ${status} not found!`);
      return;
    }

    const filtered = users.filter((u) => u.status === status);
    console.log(`Rendering ${filtered.length} users for status: ${status}`);
    container.innerHTML = filtered.length
      ? `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>From Team</th><th>Official Account</th><th>Message</th><th>Applyed At</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map(
              (u) => `
              <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.fromTeam ? "Yes" : "No"}</td>
                <td>${u.officialAccount}</td>
                <td>${u.message}</td>
                <td>${u.createdAt}</td>
                <td>
  ${u.status=="approved" 
    ? `Approved` 
    : u.status=="rejected" 
      ? `<button class="btn btn-sm btn-success approve-btn" data-id="${u.id}">Approve</button>` 
      : `
        <button class="btn btn-sm btn-success approve-btn" data-id="${u.id}">Approve</button>
        <button class="btn btn-sm btn-danger reject-btn" data-id="${u.id}">Reject</button>`
  }
</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `
      : "<p>No users in this category.</p>";

    document.querySelectorAll(".approve-btn").forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.replaceWith(newBtn);

      newBtn.addEventListener("click", async () => {
        const userId = newBtn.getAttribute("data-id");
        const userRef = doc(db, "application", userId);
        try {
          await fetchAndShowUsers();
          openModal(userRef);
        } catch (error) {
          console.error("Error approving user:", error);
          alert("Failed to approve user.");
        }
      });
    });

    document.querySelectorAll(".reject-btn").forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.replaceWith(newBtn);

      newBtn.addEventListener("click", async () => {
        const userId = newBtn.getAttribute("data-id");
        const userRef = doc(db, "application", userId);
        try {
          await updateDoc(userRef, { status: "rejected" });
          alert("User has been rejected.");
          fetchAndShowUsers();
        } catch (error) {
          console.error("Error rejecting user:", error);
          alert("Failed to reject user.");
        }
      });
    });
  });
}

fetchAndShowUsers();

const modalHTML = `
  <div id="approveModal" class="modal" style="display:none;
      position:fixed; z-index:999; left:0; top:0; width:100%; height:100%;
      background-color: rgba(0,0,0,0.5);">
    <div class="modal-content" style="background:white; padding:20px;
        width:330px; margin:15% auto; border-radius:8px; position:relative;">
      <span id="closeModal" style="position:absolute; right:10px; top:5px;
          font-size:20px; cursor:pointer;">&times;</span>
      <h2>Approve User</h2>
      <form id="approveForm">
        <input type="hidden" id="approveUserId" />
        <label for="username">Name:</label></br>
        <input type="text" id="username" required /><br /><br />
        <label for="useremail">Email:</label></br>
        <input type="text" id="useremail" required /><br /><br />
        <label for="userpassword">Password:</label></br>
        <input type="text" id="userpassword" required /><br /><br />
        <button type="submit">Create Account</button>
      </form>
    </div>
  </div>
`;
document.body.insertAdjacentHTML("beforeend", modalHTML);

async function openModal(userRef) {
  document.getElementById("approveUserId").value = userRef.id;
  document.getElementById("approveModal").style.display = "block";

  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      document.getElementById("username").value = data.name || "";
      document.getElementById("useremail").value = data.email || "";
      document.getElementById("userpassword").value = data.name +"123" || "";
    } else {
      console.error("User document does not exist.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

function closeModal() {
  document.getElementById("approveModal").style.display = "none";
}

document.getElementById("closeModal").addEventListener("click", closeModal);

document.getElementById("approveForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!nameRegex(document.getElementById("username").value)) {
    alert("Please enter a valid name.");
    return;
  }
  if (!emailRegex(document.getElementById("useremail").value)) {
    alert("Please enter a valid email.");
    return;
  }

  try {
    const auth = getAuth();
    if (!auth._popupRedirectResolver) {
      auth._popupRedirectResolver = {
        _getRecaptchaConfig: () => ({ type: "invisible" }),
      };
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      document.getElementById("useremail").value,
      document.getElementById("userpassword").value
    );

    const userId = userCredential.user.uid; 

    await setDoc(doc(db, "User", userId), { 
      name: document.getElementById("username").value,
      email: document.getElementById("useremail").value,
      password: document.getElementById("userpassword").value,
      role: "journalist",
      isactive: true,
      profile_img: "",
      "created-at": new Date(),
    });

    await updateDoc(doc(db, "application", document.getElementById("approveUserId").value), {
      status: "approved",
    });

    alert("User approved with role.");
    closeModal();
    fetchAndShowUsers();
  } catch (error) {
    console.error("Approval failed:", error);
    if (error.message.includes("recaptcha")) {
      alert("reCAPTCHA verification failed. Please try again.");
    } else {
      alert("Failed to approve user.");
    }
  }
});
