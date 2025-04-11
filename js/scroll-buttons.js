function loadScrollButtons() {
  fetch('components/scroll-buttons.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('scroll-buttons-placeholder').innerHTML = data;

      const topBtn = document.getElementById("scroll-to-top");
      const bottomBtn = document.getElementById("scroll-to-bottom");

      if (topBtn) {
        topBtn.addEventListener("click", () => {
          if (document.body.classList.contains("nav-locked")) return;
          document.body.classList.add("nav-locked");
          const targetScrollY = 0;
          const currentScrollY = window.scrollY;
          const distance = Math.abs(targetScrollY - currentScrollY);
          const speed = 0.5;
          const duration = Math.min(5000, distance / speed);

          smoothScrollTo(targetScrollY, duration);

          setTimeout(() => {
            document.body.classList.remove("nav-locked");
          }, duration);
        });
      }

      if (bottomBtn) {
        bottomBtn.addEventListener("click", () => {
          if (document.body.classList.contains("nav-locked")) return;
          document.body.classList.add("nav-locked");
          const targetScrollY = document.documentElement.scrollHeight - window.innerHeight;
          const currentScrollY = window.scrollY;
          const distance = Math.abs(targetScrollY - currentScrollY);
          const speed = 0.5;
          const duration = Math.min(5000, distance / speed);

          smoothScrollTo(targetScrollY, duration);

          setTimeout(() => {
            document.body.classList.remove("nav-locked");
          }, duration);
        });
      }
      requestAnimationFrame(() => {
        updateScrollButtonVisibility();
      
        // Delay again to catch short pages or slow DOM updates
        setTimeout(updateScrollButtonVisibility, 100);
      });
      
      window.addEventListener("scroll", updateScrollButtonVisibility);
      window.addEventListener("resize", updateScrollButtonVisibility);
    });
}

function updateScrollButtonVisibility() {
  const topBtn = document.getElementById("scroll-to-top");
  const bottomBtn = document.getElementById("scroll-to-bottom");
  const scrollButtonsContainer = document.querySelector(".scroll-buttons");
  const footer = document.getElementById("footer-nav");

  if (!topBtn || !bottomBtn || !footer) return;

  const scrollTop = window.scrollY;
  const scrollBottom = scrollTop + window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const footerTop = footer.getBoundingClientRect().top + window.scrollY;
  const buffer = 20;

  const isShortPage = docHeight <= window.innerHeight + 1;
  const footerInView = scrollBottom + buffer >= footerTop;

  // --- Show/Hide Top Button ---
  if (scrollTop <= 10 || isShortPage) {
    hideButtonSmoothly(topBtn);
  } else {
    showButton(topBtn);
  }

  // --- Anchor and Hide Bottom Button Only If Footer Is In View or Page Is Short ---
  if (footerInView || isShortPage) {
    scrollButtonsContainer.classList.add("anchored");
    hideButtonSmoothly(bottomBtn);
  } else {
    scrollButtonsContainer.classList.remove("anchored");
    showButton(bottomBtn);
  }
}

function hideButtonSmoothly(button) {
  button.classList.add("fading-out");
}

function showButton(button) {
  button.classList.remove("fading-out");
}

loadScrollButtons();