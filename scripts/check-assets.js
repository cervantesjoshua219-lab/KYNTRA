/**
 * Asset format check.
 *
 * Verifies that every image in assets/ has a file extension matching its actual
 * bytes. This exists because of a bug that typecheck and lint could not catch:
 * the Figma MCP `download_figma_images` tool only accepts a `.png`, `.svg` or
 * `.gif` filename, but happily writes JPEG bytes under a `.png` name. Web
 * browsers sniff the content and render it anyway, so the web export looked
 * perfect while Android's stricter image decoder refused to load the file.
 *
 * Run via `npm run check:assets`, or as part of `npm run verify`.
 */

const fs = require('fs');
const path = require('path');

const assetsRoot = path.join(__dirname, '..', 'assets', 'images');

/** extension -> list of accepted leading byte signatures */
const SIGNATURES = {
  '.png': [
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], // tolerate variant
  ],
  '.jpg': [
    [0xff, 0xd8, 0xff], // JPEG SOI + marker
  ],
  '.jpeg': [
    [0xff, 0xd8, 0xff],
  ],
  '.gif': [
    [0x47, 0x49, 0x46, 0x38], // GIF8
  ],
};

function matches(bytes, sig) {
  return sig.every((byte, i) => bytes[i] === byte);
}

function detect(bytes) {
  for (const [ext, sigs] of Object.entries(SIGNATURES)) {
    if (sigs.some((sig) => matches(bytes, sig))) return ext;
  }
  if (/^\s*(<\?xml|<svg)/i.test(bytes.toString('utf8', 0, 200))) return '.svg';
  return null;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const problems = [];
let checked = 0;

for (const file of walk(assetsRoot)) {
  const ext = path.extname(file).toLowerCase();
  if (!SIGNATURES[ext]) continue; // only validate raster formats we know

  checked++;
  const bytes = fs.readFileSync(file).subarray(0, 16);
  const actual = detect(bytes);
  const rel = path.relative(path.join(__dirname, '..'), file);

  if (!actual) {
    problems.push(`${rel}: unrecognised format`);
  } else if (actual !== ext) {
    problems.push(`${rel}: extension says ${ext} but the bytes are ${actual}`);
  }
}

if (problems.length) {
  console.error(`${problems.length} asset format problem(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    '\nAndroid rejects a format/extension mismatch even though web browsers tolerate it.\n' +
      'Rename the file to match its real format (JPEG photos should be .jpg).'
  );
  process.exit(1);
}

console.log(`checked ${checked} image(s) — all extensions match their format`);