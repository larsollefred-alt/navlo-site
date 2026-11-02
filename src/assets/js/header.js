// Sticky header: adds a shadow once the page is scrolled, and slides away when scrolling down
// past the first section, coming back as soon as you scroll up.
const THRESHOLD = 40; // px of scrolling in one direction before the header reacts

export default function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  header.before(sentinel);

  new IntersectionObserver(([entry]) => {
    header.classList.toggle("site-header--scrolled", !entry.isIntersecting);
  }).observe(sentinel);

  const firstSection = document.querySelector("main > section");
  let lastY = window.scrollY;
  let travelled = 0;
  let frame = 0;

  function update() {
    frame = 0;
    const y = window.scrollY;
    const delta = y - lastY;
    lastY = y;

    // Restart the count whenever the direction changes
    travelled = Math.sign(delta) === Math.sign(travelled) ? travelled + delta : delta;

    const pastFirstSection = firstSection
      ? firstSection.getBoundingClientRect().bottom < header.offsetHeight
      : y > header.offsetHeight * 3;
    // Never hide while the mobile menu is open or something in the header has keyboard focus
    const busy = header.querySelector(".nav--open") || header.contains(document.activeElement);

    if (!pastFirstSection || busy || travelled < -THRESHOLD) {
      header.classList.remove("site-header--hidden");
    } else if (travelled > THRESHOLD) {
      header.classList.add("site-header--hidden");
    }
  }

  window.addEventListener("scroll", () => { frame ||= requestAnimationFrame(update); }, { passive: true });
  header.addEventListener("focusin", () => header.classList.remove("site-header--hidden"));
}
