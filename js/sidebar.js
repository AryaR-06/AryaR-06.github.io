function highlightActiveNav() {
  const path = getCurrentPageSlug();
  const activeButton = document.querySelector(`.nav-button[data-page="${path}"]`);
  if (activeButton) {
    activeButton.classList.add("active");
  }
}
  
function setupSidebarNavigation() {
  const navButtons = document.querySelectorAll(".nav-button");

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetPage = button.getAttribute("data-target");
      const targetOrder = parseInt(button.getAttribute("data-order"), 10);
      const currentPage = getCurrentPageSlug();
      const currentButton = document.querySelector(`.nav-button[data-page="${currentPage}"]`);
      if (!currentButton) return;

      const currentOrder = parseInt(currentButton.getAttribute("data-order"), 10);
      if (targetPage === `${currentPage}.html`) return;

      document.body.classList.add("nav-locked");

      // Get scroll direction
      const targetScrollY = (targetOrder > currentOrder) ? document.documentElement.scrollHeight - window.innerHeight : 0;
      const currentScrollY = window.scrollY;
      const distance = Math.abs(targetScrollY - currentScrollY);

      // Set a constant speed (px/ms), e.g., 1px per 2ms
      const speed = 0.5; // px per ms
      const duration = Math.min(5000, distance / speed); // cap max scroll time at 2000ms

      smoothScrollTo(targetScrollY, duration);

      // After scroll, fade out, then navigate
      setTimeout(() => {
        transitionToPage(targetPage);
      }, duration*0.75);
    });
  });
}

function fetchSidebar() {
  fetch('components/sidebar.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('sidebar-placeholder').innerHTML = data;

      requestAnimationFrame(() => {
        highlightActiveNav();
        setupSidebarNavigation();
        loadFooterNav();
      });
    });
}

fetchSidebar();