// Usage: node make-icon.mjs path/to/logo-or-emblem.png
// Crops the centre square, resizes to 512x512, and masks it into a circle with a transparent background.
import sharp from "sharp";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node make-icon.mjs path/to/image.png");
  process.exit(1);
}

const size = 512;
const circle = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`);

await sharp(input)
  .resize(size, size, { fit: "cover", position: "centre" })
  .composite([{ input: circle, blend: "dest-in" }])
  .png()
  .toFile("app/icon.png");

console.log("Created app/icon.png (512x512, circular)");