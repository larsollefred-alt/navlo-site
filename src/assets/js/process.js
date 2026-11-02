// Desktop: Processen pins in place and the cards scroll at half speed, so the section takes
// longer to scroll through (with a short pause first, so the intro gets read).
// Mobile, reduced motion and no-JS fall back to normal scrolling (plus the CSS pause).
const SLOWDOWN = 2;     // 2 = cards move at half the scroll speed
const PAUSE_VH = 0.35;  // pause before the cards start moving, in viewport heights

export default function initProcess() {
  const pin = document.querySelector("[data-process]");
  const stage = pin?.querySelector(".process");
  const list = pin?.querySelector(".process__steps");
  if (!pin || !stage || !list) return;

  const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
  let travel = 0, pause = 0, stickyTop = 0, frame = 0;

  function measure() {
    list.style.transform = "";
    stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
    pause = window.innerHeight * PAUSE_VH;
    travel = Math.max(0, list.offsetTop + list.offsetHeight - stage.clientHeight);
    pin.style.height = `${stage.offsetHeight + pause + travel * SLOWDOWN}px`;
    update();
  }

  function update() {
    frame = 0;
    const scrolled = stickyTop - pin.getBoundingClientRect().top;
    const progress = Math.min(1, Math.max(0, (scrolled - pause) / (travel * SLOWDOWN || 1)));
    list.style.transform = `translateY(${-progress * travel}px)`;
  }

  const onScroll = () => { frame ||= requestAnimationFrame(update); };

  function setup() {
    const enabled = media.matches;
    pin.classList.toggle("process-pin--slow", enabled);
    if (enabled) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", measure);
      window.addEventListener("load", measure, { once: true }); // fonts/images can change heights
      measure();
    } else {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      pin.style.height = "";
      list.style.transform = "";
    }
  }

  media.addEventListener("change", setup);
  setup();
}
