function loadFooterNav() {
    fetch('components/footer-nav.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('footer-nav-placeholder').innerHTML = data;
  
        const currentPage = getCurrentPageSlug();
        const buttons = document.querySelectorAll(".nav-button");
        const navArray = Array.from(buttons).map(btn => ({
          title: btn.innerText,
          page: btn.getAttribute("data-page"),
          href: btn.getAttribute("data-target"),
          order: parseInt(btn.getAttribute("data-order"), 10)
        }));
  
        navArray.sort((a, b) => a.order - b.order);
  
        const currentIndex = navArray.findIndex(item => item.page === currentPage);
        const next = navArray[currentIndex + 1];
  
        if (next) {
          const footer = document.getElementById("footer-nav");
          footer.innerHTML = `
            <div>${next.title}</div>
            <div class="footer-arrow">&#x23F7;</div>
          `;
          footer.onclick = () => transitionToPage(next.href);
        } else {
          const footer = document.getElementById("footer-nav");
          footer.innerHTML = `
          <div class="container">  
          <div>Return to ${navArray[0].title}</div>
            <div class="footer-arrow">&#x23F7;</div>
          </div>
          `;
          footer.onclick = () => transitionToPage(navArray[0].href);
        }
      });
  }