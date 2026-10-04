// Generates neutral placeholder imagery in the KYNTRA palette so the app runs
// and layouts are verifiable before real product photography is exported from
// Figma.
//
// Every file here is a flat neutral fill. To use real assets, drop the exported
// images into assets/images/products and assets/images/categories using the
// same filenames — src/data/images.ts is the only file that references them.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/** Flat fill with a slightly darker band across the lower third. */
function placeholderPng(w, h, hex, bandHex) {
  const [r, g, b] = hexToRgb(hex);
  const [br, bg, bb] = hexToRgb(bandHex);
  const bandTop = Math.floor(h * 0.68);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour

  const raw = Buffer.alloc(h * (w * 3 + 1));
  let o = 0;
  for (let y = 0; y < h; y++) {
    raw[o++] = 0; // filter: none
    const inBand = y >= bandTop;
    for (let x = 0; x < w; x++) {
      // subtle vertical gradient so cards are visually distinguishable
      const t = y / h;
      const mix = inBand ? 0.18 : t * 0.1;
      raw[o++] = Math.round(r + (br - r) * mix);
      raw[o++] = Math.round(g + (bg - g) * mix);
      raw[o++] = Math.round(b + (bb - b) * mix);
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const assetsRoot = path.join(__dirname, "..", "assets", "images");

// Neutral ramp derived from the Figma palette so placeholders stay on-brand.
const RAMP = [
  ["#E5E5E5", "#D2D2D2"],
  ["#F5F5F5", "#E5E5E5"],
  ["#D8D8D8", "#BFBFBF"],
  ["#EFEFEF", "#DDDDDD"],
  ["#CFCFCF", "#B4B4B4"],
  ["#E9E9E9", "#D4D4D4"],
  ["#DCDCDC", "#C4C4C4"],
  ["#F0F0F0", "#DEDEDE"],
];

/**
 * Indices that hold real photography exported from Figma. Overwriting these
 * would destroy the only real product imagery in the project, so they are
 * skipped unless --force is passed.
 *
 * Note the real files are .jpg (Figma stores them as JPEG) while the
 * placeholders this script writes are .png. `check-assets.js` enforces that
 * each file's extension matches its bytes.
 *
 * See src/data/images.ts for the full provenance of every image.
 */
const REAL = {
  products: new Set([1, 2, 3, 4]), // Paceform 01, Formknit Tee, Driftline Short, Transit Crossbody
  collection: new Set([1, 2, 3]), // the three editorial campaign banners
};

const force = process.argv.includes("--force");

function emit(dir, prefix, count, [w, h]) {
  const out = path.join(assetsRoot, dir);
  fs.mkdirSync(out, { recursive: true });
  const keep = REAL[dir] ?? new Set();
  let skipped = 0;
  for (let i = 0; i < count; i++) {
    const n = i + 1;
    if (keep.has(n) && !force) {
      skipped++;
      continue;
    }
    const [fill, band] = RAMP[i % RAMP.length];
    const name = `${prefix}${n}.png`;
    fs.writeFileSync(path.join(out, name), placeholderPng(w, h, fill, band));
    console.log(`wrote ${dir}/${name} (${w}x${h})`);
  }
  if (skipped) {
    console.log(`skipped ${skipped} real photo(s) in ${dir}/ (pass --force to overwrite)`);
  }
}

emit("products", "product-", 8, [480, 600]);
emit("categories", "category-", 6, [400, 400]);
emit("collection", "collection-", 3, [800, 500]);

// App icon / splash. Replace once the Figma brand mark is exported — do not
// invent a KYNTRA logo.
const INK = "#111111";
fs.writeFileSync(path.join(assetsRoot, "icon.png"), placeholderPng(1024, 1024, INK, INK));
fs.writeFileSync(path.join(assetsRoot, "adaptive-icon.png"), placeholderPng(1024, 1024, INK, INK));
fs.writeFileSync(path.join(assetsRoot, "splash-icon.png"), placeholderPng(512, 512, "#FFFFFF", "#FFFFFF"));
fs.writeFileSync(path.join(assetsRoot, "favicon.png"), placeholderPng(48, 48, INK, INK));
console.log("wrote app icon / splash / favicon");