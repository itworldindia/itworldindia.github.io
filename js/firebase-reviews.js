import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* FIREBASE */
const firebaseConfig = {
  apiKey: "AIzaSyCHBt5s1tLJffmBnmjCyAefvQ_c9Oaw8-M",
  authDomain: "reviews-1b15f.firebaseapp.com",
  projectId: "reviews-1b15f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* DOM */
const track = document.getElementById("reviewTrack");
const avgEl = document.getElementById("avgRating");
const countEl = document.getElementById("reviewCount");

/* STAR INPUT */
let rating = 0;
const stars = document.querySelectorAll(".star-input span");

stars.forEach(star=>{
  star.onclick=()=>{
    rating = Number(star.dataset.val);
    revRating.value = rating;

    stars.forEach(s=>{
      s.classList.toggle("active", Number(s.dataset.val) <= rating);
    });
  };
});

/* SUBMIT REVIEW */
submitReview.onclick = async ()=>{
  const name = revName.value.trim();
  const msg  = revMessage.value.trim();

  if(!name || !msg || !rating){
    alert("Complete all fields");
    return;
  }

  await addDoc(collection(db,"reviews"),{
    name,
    message:msg,
    rating,
    approved:false,
    created:Date.now()
  });

  alert("Thanks for your valuable feedback!");

  revName.value="";
  revMessage.value="";
  rating=0;
  stars.forEach(s=>s.classList.remove("active"));
};

/* SLIDER STATE */
let index = 0;
let total = 0;
let timer = null;

/* LOAD REVIEWS */
async function loadReviews(){
  const snap = await getDocs(collection(db,"reviews"));

  let sum = 0;
  total = 0;
  track.innerHTML = "";

  snap.forEach(d=>{
    const r = d.data();
    if(!r.approved) return;

    total++;
    sum += r.rating;

    track.innerHTML += `
      <div class="review-card">
        <div class="name">${r.name}</div>
        <div class="stars">${"★".repeat(r.rating)}</div>
        <p>${r.message}</p>
      </div>
    `;
  });

  if(total === 0){
    avgEl.textContent = "0.0";
    countEl.textContent = "0";
    return;
  }

  const avg = sum / total;
  avgEl.textContent = avg.toFixed(1);
  countEl.textContent = total;

  updateSchema(avg, total);

  startSlide();
}

/* AUTO SLIDE (FIXED) */
function startSlide(){
  if(timer) clearInterval(timer);

  if(total <= 1) return;

  index = 0;
  track.style.transform = "translateX(0%)";

  timer = setInterval(()=>{
    index++;

    if(index >= total){
      index = 0;
    }

    track.style.transform = `translateX(-${index * 100}%)`;
  }, 4000);
}

/* SCHEMA (SAFE) */
function updateSchema(avg, count){

  const script = document.getElementById("review-schema");
  if(!script) return;
  const schema = JSON.parse(script.textContent);
  schema.aggregateRating.ratingValue = avg.toFixed(1);
  schema.aggregateRating.reviewCount = count.toString();

  script.textContent = JSON.stringify(schema);
  // DEBUG (console check)
  console.log("Schema Updated:", schema);
}

/* INIT */

loadReviews();




