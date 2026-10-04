/**
 * Asset check.
 *
 * Two failure modes, both of which typecheck and lint cannot catch:
 *
 * 1. **Format mismatch.** Every image in assets/ must have an extension matching
 *    its actual bytes. The Figma MCP `download_figma_images` tool only accepts a
 *    `.png`, `.svg` or `.gif` filename, but happily writes JPEG bytes under a
 *    `.png` name. Web browsers sniff the content and render it anyway, so the
 *    web export looked perfect while Android's stricter image decoder refused to
 *    load the file.
 *
 * 2. **Unresolvable require().** A `require()` in `src/data/images.ts` that
 *    points at a file which does not exist. Metro fails the *whole bundle* on an
 *    unresolved asset, which reaches the user as a blank white screen after the
 *    splash — no red box, no console error, because the module graph never
 *    finished evaluating. This happened when the MCP wrote five downloads to
 *    `assets/images/` while the registry pointed at `assets/images/membership/`
 *    and friends. Worth catching statically: the failure is invisible until
 *    someone runs it on a device.
 *
 * Run via `npm run check:assets`, or as part of `npm run verify`.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const assetsRoot = path.join(projectRoot, 'assets', 'images');

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
  const rel = path.relative(projectRoot, file);

  if (!actual) {
    problems.push(`${rel}: unrecognised format`);
  } else if (actual !== ext) {
    problems.push(`${rel}: extension says ${ext} but the bytes are ${actual}`);
  }
}

// --- 2. every require() in the image registry must resolve -------------------
// Scanned across all of src/ rather than just the registry, because a screen
// importing artwork directly would fail the same way.
const registryFile = path.join(projectRoot, 'src', 'data', 'images.ts');

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

let referenced = 0;

for (const file of sourceFiles(path.join(projectRoot, 'src'))) {
  const source = fs.readFileSync(file, 'utf8');
  const rel = path.relative(projectRoot, file);

  for (const match of source.matchAll(/require\(\s*'([^']+)'\s*\)/g)) {
    const spec = match[1];
    if (!spec.startsWith('@/assets/')) continue;

    referenced++;
    const target = path.join(projectRoot, spec.replace(/^@\//, ''));
    if (!fs.existsSync(target)) {
      problems.push(`${rel}: require('${spec}') does not exist on disk`);
    }
  }
}

if (problems.length) {
  console.error(`${problems.length} asset problem(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    '\nAndroid rejects a format/extension mismatch even though web browsers tolerate it.\n' +
      'Rename the file to match its real format (JPEG photos should be .jpg).\n' +
      "An unresolved require() fails Metro's whole bundle, which shows up as a blank\n" +
      'white screen on device with no error. Check the path in src/data/images.ts.'
  );
  process.exit(1);
}

console.log(
  `checked ${checked} image(s) — all extensions match their format; ` +
    `${referenced} asset require(s) resolve`
);