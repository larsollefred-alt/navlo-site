// One-off: renders the share image and apple-touch-icon from the brand SVGs. Run with `node scripts/make-icons.js`.
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const inner = (svg) => svg.replace(/<\/?svg[^>]*>/g, "");
const mark = inner(await readFile("src/assets/img/favicon.svg", "utf8"));
const logo = inner(await readFile("src/assets/img/logo.svg", "utf8"));

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5f5f5"/>
  <rect x="0" y="590" width="1200" height="40" fill="#0057F4"/>
  <svg x="96" y="90" width="290" height="80" viewBox="141 141 1363 376">${logo}</svg>
  <text x="96" y="330" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="700" font-size="72" fill="#1e1e1e" letter-spacing="-2">Hemsidor som får ditt</text>
  <text x="96" y="418" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="700" font-size="72" fill="#1e1e1e" letter-spacing="-2">företag att synas</text>
  <text x="96" y="500" font-family="Inter, Helvetica, Arial, sans-serif" font-size="34" fill="#757575">Webbdesign för företag i Karlstad · från 2 000 kr</text>
</svg>`;

// iOS adds no padding or background, so give the mark both
const touch = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="-64 -64 640 640">
  <rect x="-64" y="-64" width="640" height="640" fill="#fff"/>${mark}</svg>`;

await sharp(Buffer.from(og)).png().toFile("src/assets/img/navlo-hemsidor-karlstad.png");
await sharp(Buffer.from(touch)).png().toFile("src/assets/img/apple-touch-icon.png");
console.log("Wrote navlo-hemsidor-karlstad.png and apple-touch-icon.png");
