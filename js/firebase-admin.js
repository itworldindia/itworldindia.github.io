import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHBt5s1tLJffmBnmjCyAefvQ_c9Oaw8-M",
  authDomain: "reviews-1b15f.firebaseapp.com",
  projectId: "reviews-1b15f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* LOGIN */
loginBtn.onclick = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .catch(err => alert(err.message));
};

/* LOGOUT */
if (typeof logoutBtn !== "undefined") {
  logoutBtn.onclick = () => signOut(auth);
}

/* AUTH STATE */
onAuthStateChanged(auth, user => {

  if (user && user.email === "admin@itworld.in") {

    // Hide login, show dashboard
    loginSection.style.display = "none";
    adminPanel.style.display = "block";

    loadPendingReviewsRealtime();

  } else {

    // Not logged in OR not admin
    loginSection.style.display = "block";
    adminPanel.style.display = "none";

    if (user) signOut(auth);
  }
});

/* REALTIME PENDING REVIEWS */
function loadPendingReviewsRealtime() {

  const q = query(
    collection(db, "reviews"),
    where("approved", "==", false)
  );

  onSnapshot(q, snap => {

    pendingReviews.innerHTML = "";

    if (snap.empty) {
      pendingReviews.innerHTML = "<p>No pending reviews</p>";
      return;
    }

    snap.forEach(d => {
      const r = d.data();

      pendingReviews.innerHTML += `
        <div class="review-card">
          <strong>${r.name}</strong> – ${"★".repeat(r.rating)}
          <p>${r.message}</p>
          <small>${new Date(r.created).toLocaleString()}</small>

          <div class="actions">
            <button onclick="approveReview('${d.id}')">Approve</button>
            <button class="danger" onclick="deleteReview('${d.id}')">Delete</button>
          </div>
        </div>
      `;
    });

  });
}

/* APPROVE */
window.approveReview = async id => {
  await updateDoc(doc(db, "reviews", id), { approved: true });
};

/* DELETE */
window.deleteReview = async id => {
  if (confirm("Delete this review?")) {
    await deleteDoc(doc(db, "reviews", id));
  }
};