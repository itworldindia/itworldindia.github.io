// TYPING EFFECT (only on pages where typing-text exists)
const typing = document.getElementById("typing");
if (typing) {
  const words = [
    "Laptop, Computer & MacBook Repair at Home",
    "Windows & MS Office Genuine License",
    "Data Recovery, SSD/RAM Upgrade & Deep Cleaning",
    "Doorstep IT Service in Gurugram (HR)"
  ];
  let i = 0, j = 0, del = false;
  (function type() {
    typing.textContent = words[i].slice(0, j);
    if (!del) j++; else j--;
    if (j === words[i].length) del = true;
    if (j === 0 && del) { del = false; i = (i + 1) % words.length; }
    setTimeout(type, del ? 40 : 80);
  })();
}

// COMMON WHATSAPP NUMBER
const WA_NUMBER = "917836872230";

// QUICK WHATSAPP ENQUIRY FORM (HOME PAGE)
const waSendBtn = document.getElementById("wa-send");
if (waSendBtn) {
  waSendBtn.addEventListener("click", () => {
    const name = (document.getElementById("wa-name").value || "").trim();
    const loc = (document.getElementById("wa-location").value || "").trim();
    const service = document.getElementById("wa-service").value;
    const issue = (document.getElementById("wa-issue").value || "").trim();

    if (!name || !loc) {
      alert("Please enter your name and location.");
      return;
    }

    let msg = "New Service Enquiry - IT WORLD THE COMPUTER ITSOLUTION\n\n";
    msg += "Name: " + name + "\n";
    msg += "Location: " + loc + "\n";
    msg += "Service: " + service + "\n";
    if (issue) msg += "Issue: " + issue + "\n";

    const url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  });
}



// ================= AUTO GALLERY (STABLE VERSION) =================

const MAX_REPAIR_IMAGES = 9;
const MAX_DOORSTEP_IMAGES = 9;
const MAX_VIDEOS = 5;

document.addEventListener("DOMContentLoaded", setupAutoGallery);

function setupAutoGallery() {

  const configs = [
    { id: "repairs-slider",  type: "image", folder: "img/repairs",  max: MAX_REPAIR_IMAGES },
    { id: "doorstep-slider", type: "image", folder: "img/doorstep", max: MAX_DOORSTEP_IMAGES },
    { id: "video-slider",    type: "video", folder: "img/video",    max: MAX_VIDEOS }
  ];

  configs.forEach(initSlider);
}

// ================= SLIDER CORE =================

function initSlider(cfg) {

  const slider = document.getElementById(cfg.id);
  if (!slider) return;

  const inner = slider.querySelector(".slider-inner");
  const slides = [];

  let currentIndex = 0;
  let autoTimer = null;

  // ---------------- ADD SLIDE ----------------

  function addSlide(element) {
    const wrapper = document.createElement("div");
    wrapper.className = "slide";
    wrapper.style.display = "none";
    wrapper.appendChild(element);
    inner.appendChild(wrapper);
    slides.push(wrapper);
  }

  // ---------------- SHOW SLIDE ----------------

  function showSlide(index) {

    slides.forEach(s => s.style.display = "none");
    slides[index].style.display = "block";

    const video = slides[index].querySelector("video");

    if (video) {
      stopAuto();
      video.currentTime = 0;
      video.play().catch(() => {});
      video.onended = nextSlide;
    } else {
      startAuto();
    }
  }

  function nextSlide() {
    if (slides.length <= 1) return;
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 4000);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  function addArrow() {
    const btn = document.createElement("button");
    btn.className = "slider-next";
    btn.innerHTML = "&#10095;";
    slider.appendChild(btn);
    btn.onclick = nextSlide;
  }

  // ---------------- LOAD FILES ----------------

  let loaded = 0;
  let attempted = 0;

  function checkStart() {
    if (attempted >= cfg.max) {
      if (slides.length === 0) return;
      addArrow();
      showSlide(0);
    }
  }

  for (let i = 1; i <= cfg.max; i++) {

    attempted++;

    const base = `${cfg.folder}/${i}`;

    if (cfg.type === "image") {

      const img = new Image();

      img.onload = () => {
        addSlide(img);
        loaded++;
        checkStart();
      };

      img.onerror = checkStart;
      img.src = base + ".jpg";

    } else {

      const video = document.createElement("video");

      video.controls = true;
      video.loop = false;
      video.muted = true;   // muted to allow autoplay without user interaction
      video.preload = "metadata";

      video.onloadeddata = () => {
        addSlide(video);
        loaded++;
        checkStart();
      };

      video.onerror = checkStart;
      video.src = base + ".mp4";
    }
  }
}

document.addEventListener("DOMContentLoaded", setupAutoGallery);


// ------- WHATSAPP BOOKING BUTTONS (Service & Pricing page) ----------
const WA_BOOK_NUMBER = "917836872230"; // same WhatsApp number

function openWhatsAppBooking(service, price) {
  const msg =
    `Hi IT WORLD THE COMPUTER ITSOLUTION,\n` +
    `I want to book *${service}* service` +
    (price ? ` (starts from ${price})` : ``) +
    `. \nPlease share the final estimate and earliest home service slot.\n` +
    `Location: Gurugram`;

  const url = "https://wa.me/" + WA_BOOK_NUMBER + "?text=" + encodeURIComponent(msg);
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", function () {
  const bookButtons = document.querySelectorAll(".wa-book-btn");
  if (!bookButtons.length) return;

  bookButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const service = this.dataset.service || "Service";
      const price   = this.dataset.price  || "";
      openWhatsAppBooking(service, price);
    });
  });
});





