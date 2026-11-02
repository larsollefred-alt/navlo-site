// Cookie consent (SPEC.MD §7). Stores the choice in localStorage as { statistik, date } under
// "navlo-consent" and asks again after 12 months. Optional scripts are written as
// <script type="text/plain" data-consent="statistik" src="…"> and only switched on after consent.
const KEY = "navlo-consent";
const MAX_AGE = 365 * 24 * 60 * 60 * 1000;

function readConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && Date.now() - new Date(saved.date).getTime() < MAX_AGE) return saved;
  } catch {}
  return null;
}

function saveConsent(choices) {
  const consent = { ...choices, date: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(consent)); } catch {}
  return consent;
}

function activateScripts(consent) {
  document.querySelectorAll('script[type="text/plain"][data-consent]').forEach((placeholder) => {
    if (!consent[placeholder.dataset.consent]) return;
    const script = document.createElement("script");
    [...placeholder.attributes].forEach(({ name, value }) => name !== "type" && script.setAttribute(name, value));
    script.text = placeholder.text;
    placeholder.replaceWith(script);
  });
}

export default function initConsent() {
  const banner = document.querySelector("[data-consent-banner]");
  if (!banner) return;

  const tabs = [...banner.querySelectorAll("[data-consent-tab]")];
  const settingsButton = banner.querySelector('[data-consent-action="settings"]');
  const saveButton = banner.querySelector('[data-consent-action="save"]');
  const statistik = banner.querySelector('[data-consent-category="statistik"]');

  function selectTab(tab, focus = false) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
    // On the Information tab "Anpassa" becomes "Spara mitt val"
    const onSettings = tab.id === "cookie-tab-information";
    settingsButton.hidden = onSettings;
    saveButton.hidden = !onSettings;
    if (focus) tab.focus();
  }

  function show() {
    statistik.checked = Boolean(readConsent()?.statistik);
    selectTab(tabs[0]);
    banner.hidden = false;
  }

  function close(choices) {
    activateScripts(saveConsent(choices));
    banner.hidden = true;
  }

  banner.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-consent-tab]");
    if (tab) return selectTab(tab);
    const action = event.target.closest("[data-consent-action]")?.dataset.consentAction;
    if (action === "accept") close({ statistik: true });
    if (action === "reject") close({ statistik: false });
    if (action === "save") close({ statistik: statistik.checked });
    if (action === "settings") selectTab(tabs[1], true);
  });

  // Arrow keys move between tabs (standard tab pattern)
  banner.querySelector('[role="tablist"]').addEventListener("keydown", (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    const index = tabs.indexOf(document.activeElement);
    selectTab(tabs[(index + step + tabs.length) % tabs.length], true);
  });

  // "Cookie-inställningar" in the footer reopens the banner so consent can be changed or withdrawn
  document.querySelectorAll("[data-consent-open]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      show();
      tabs[0].focus();
    });
  });

  const consent = readConsent();
  if (consent) activateScripts(consent);
  else show();
}
