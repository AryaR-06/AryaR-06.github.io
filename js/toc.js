console.log("✅ toc.js loaded");

function loadTOC() {
  fetch("components/toc.html")
    .then(res => res.text())
    .then(data => {
      const placeholder = document.getElementById("toc-placeholder");
      if (placeholder) {
        placeholder.innerHTML = data;
        setupTOCNavigation();
      } else {
        console.warn("⚠️ TOC placeholder not found.");
      }
    })
    .catch(err => console.error("❌ Failed to load TOC:", err));
}

function setupTOCNavigation() {
  const tocButtons = document.querySelectorAll(".toc-button");

  console.log("🔧 Setting up TOC navigation, found", tocButtons.length, "buttons.");

  tocButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetPage = button.getAttribute("data-target");
      const targetSection = button.getAttribute("data-section");

      console.log("📤 TOC clicked. Target page:", targetPage, "| Section:", targetSection);

      if (targetSection) {
        sessionStorage.setItem("scrollToSection", targetSection);
        console.log("💾 Stored scroll target in session:", targetSection);
      } else {
        sessionStorage.removeItem("scrollToSection");
        console.log("🧹 Cleared scroll target from session.");
      }

      document.body.classList.add("nav-locked");

      const scrollTarget = document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollY = window.scrollY;
      const distance = Math.abs(scrollTarget - currentScrollY);
      const speed = 0.5;
      const duration = Math.min(5000, distance / speed);

      console.log("🔄 Scrolling down before navigating...");
      smoothScrollTo(scrollTarget, duration);

      setTimeout(() => {
        transitionToPage(targetPage);
      }, duration * 0.75);
    });
  });
}

function scrollToSavedSection() {
  const sectionId = sessionStorage.getItem("scrollToSection");
  console.log("🔍 Stored scroll target on this page:", sectionId);

  if (!sectionId) return;

  const attemptScroll = (retries = 10) => {
    const target = document.getElementById(sectionId);
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.scrollY;
      console.log("✅ Found section:", sectionId, "— Scrolling to", offsetTop);

      const scrollTarget = offsetTop;
      const currentScrollY = window.scrollY;
      const distance = Math.abs(scrollTarget - currentScrollY);
      const speed = 0.5;
      const duration = Math.min(5000, distance / speed);
      smoothScrollTo(offsetTop, duration);

      sessionStorage.removeItem("scrollToSection");
    } else if (retries > 0) {
      console.log("⏳ Waiting for section to appear...", sectionId, "| retries left:", retries);
      setTimeout(() => attemptScroll(retries - 1), 150);
    } else {
      console.warn("❌ Failed to find target section after retries:", sectionId);
    }
  };

  // Delay ensures all transitions/DOM are ready
  requestAnimationFrame(() => {
    setTimeout(() => attemptScroll(), 1100);
  });
}

// Run only on non-index pages
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  const isIndex = currentPage === "" || currentPage === "index.html";

  if (!isIndex) {
    scrollToSavedSection();
  } else {
    console.log("🛑 This is the index page. Not scrolling to any saved section.");
  }

  loadTOC();
});
