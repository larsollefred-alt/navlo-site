// Portfolio filter by industry. Without JS all case studies are shown and the buttons stay hidden.
export default function initFilter() {
  const filter = document.querySelector("[data-filter]");
  const list = document.querySelector("[data-filter-list]");
  if (!filter || !list) return;

  const buttons = [...filter.querySelectorAll("[data-filter-value]")];
  const items = [...list.children];
  const status = document.querySelector("[data-filter-status]");

  filter.hidden = false;
  filter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter-value]");
    if (!button) return;

    const value = button.dataset.filterValue;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    let visible = 0;
    items.forEach((item) => {
      const show = !value || item.dataset.industry === value;
      item.hidden = !show;
      if (show) visible += 1;
    });
    if (status) status.textContent = `Visar ${visible} projekt`;
  });
}
