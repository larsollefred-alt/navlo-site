// Fades content in softly as it scrolls into view. JS adds the hidden state itself, so without
// JS (or with reduced motion) everything is simply visible. The hero is left alone (fastest paint).
const TARGETS = [
  ".section .container > :is(h1, h2, p)",
  ".card-grid > li",
  ".plans > li",
  ".seo__points > li",
  ".serp",
  ".process__intro",
  ".process__step",
  ".portfolio-grid > li",
  ".testimonial",
  ".faq-grid > li",
  ".contact .form",
].join(", ");

export default function initReveal() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const items = [...document.querySelectorAll(TARGETS)];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      item.classList.add("is-visible");
      observer.unobserve(item);
      // Hand the element back to its own styles (e.g. the service-card hover) once it has arrived
      item.addEventListener("transitionend", () => {
        item.classList.remove("reveal", "is-visible");
        item.style.removeProperty("--reveal-delay");
      }, { once: true });
    });
  }, { rootMargin: "0px 0px -10% 0px" });

  items.forEach((item) => {
    // Stagger siblings in a grid a little
    const index = [...item.parentElement.children].indexOf(item);
    item.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 80}ms`);
    item.classList.add("reveal");
    observer.observe(item);
  });
}
