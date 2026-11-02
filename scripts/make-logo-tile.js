// Makes a square client-logo tile for the portfolio cards: the logo (or a crop of a screenshot)
// centred on a background colour. Usage:
//   node scripts/make-logo-tile.js <in> <out.png> <#bg> [left top width height]
import sharp from "sharp";

const [input, output, bg, ...crop] = process.argv.slice(2);
const SIZE = 192, PAD = 28;

let logo = sharp(input);
if (crop.length === 4) {
  const [left, top, width, height] = crop.map(Number);
  logo = logo.extract({ left, top, width, height });
}
const inner = await logo.resize(SIZE - PAD * 2, SIZE - PAD * 2, { fit: "inside" }).png().toBuffer();

await sharp({ create: { width: SIZE, height: SIZE, channels: 3, background: bg } })
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile(output);
console.log("Wrote", output);
