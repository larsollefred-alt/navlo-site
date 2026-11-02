// Mobile menu toggle. Without JS the menu links show as a plain row under the logo.
export default function initNav() {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  if (!nav || !toggle) return;

  const desktop = window.matchMedia("(min-width: 1024px)");
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("nav--open", open);
    document.documentElement.classList.toggle("menu-open", open);
  };

  nav.classList.add("nav--collapsible");
  toggle.hidden = false;
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => event.target.closest("a") && setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("nav--open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  desktop.addEventListener("change", () => setOpen(false));
}
