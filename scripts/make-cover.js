// Builds a 2400×1600 portfolio cover from a desktop screenshot (1440×900 @2x): the screenshot in a
// browser window, centred on a background colour. Usage: node scripts/make-cover.js <in> <out.jpg> <#bg>
import sharp from "sharp";

const [input, output, bg = "#f5f5f5"] = process.argv.slice(2);
const W = 2400, H = 1600, winW = 2080, bar = 64, radius = 20;
const shotH = Math.round((winW * 900) / 1440), winH = shotH + bar;
const x = (W - winW) / 2, y = (H - winH) / 2;

const shot = await sharp(input).resize(winW, shotH, { fit: "cover", position: "top" }).png().toBuffer();

const frame = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <rect x="${x}" y="${y + 24}" width="${winW}" height="${winH}" rx="${radius}" fill="#000" opacity=".2"/>
  <rect x="${x}" y="${y}" width="${winW}" height="${winH}" rx="${radius}" fill="#f2f2f2"/>
  <circle cx="${x + 40}" cy="${y + bar / 2}" r="10" fill="#ff5f57"/>
  <circle cx="${x + 72}" cy="${y + bar / 2}" r="10" fill="#febc2e"/>
  <circle cx="${x + 104}" cy="${y + bar / 2}" r="10" fill="#28c840"/>
</svg>`;

// Round the bottom corners of the screenshot to match the window
const mask = Buffer.from(`<svg width="${winW}" height="${shotH}"><rect y="-${radius}" width="${winW}" height="${shotH + radius}" rx="${radius}" fill="#fff"/></svg>`);
const rounded = await sharp(shot).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();

await sharp(Buffer.from(frame))
  .composite([{ input: rounded, left: x, top: y + bar }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(output);
console.log("Wrote", output);
