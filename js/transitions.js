function transitionToPage(href) {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = href;
  }, 500);
}
  