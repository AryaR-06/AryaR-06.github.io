function getCurrentPageSlug() {
    const slug = window.location.pathname.split("/").pop().replace(".html", "");
    return slug === "" ? "index" : slug;
}

function smoothScrollTo(targetY, duration = 1000) {
  const start = window.scrollY;
  const distance = targetY - start;
  const startTime = performance.now();

  function scrollStep(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, start + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}

window.onpageshow = function () {
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.classList.add("visible");
      document.body.classList.remove("nav-locked");
    }, 500);

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  });
};