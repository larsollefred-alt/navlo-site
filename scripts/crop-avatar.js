// Crops a photo to a square 600×600 avatar for a testimonial and strips metadata (incl. GPS).
// Usage: node scripts/crop-avatar.js <in> <out.jpg> <left> <top> <size>   (coordinates in source pixels)
import sharp from "sharp";

const [input, output, left, top, size] = process.argv.slice(2);

await sharp(input)
  .rotate()
  .extract({ left: +left, top: +top, width: +size, height: +size })
  .resize(600, 600)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(output);
console.log("Wrote", output);
