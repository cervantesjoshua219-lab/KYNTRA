// Generates the flat app icon / splash / favicon fills.
//
// Product, campaign, membership, profile and order artwork is all real
// photography exported from Figma and must never be regenerated — see
// src/data/images.ts for the provenance of every image. This script used to
// also emit product and category placeholders, but a full audit of the Figma
// file turned up real assets for all of them (and no category artwork at all),
// so that half of the job is gone.
//
// Figma specifies no brand mark, so these stay neutral. Do not invent a KYNTRA
// logo — drop the exported mark in over the top.
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
fs.mkdirSync(assetsRoot, { recursive: true });

const INK = "#111111";

const BRAND = [
  ["icon.png", 1024, 1024, INK, INK],
  ["adaptive-icon.png", 1024, 1024, INK, INK],
  ["splash-icon.png", 512, 512, "#FFFFFF", "#FFFFFF"],
  ["favicon.png", 48, 48, INK, INK],
];

for (const [name, w, h, fill, band] of BRAND) {
  fs.writeFileSync(path.join(assetsRoot, name), placeholderPng(w, h, fill, band));
  console.log(`wrote ${name} (${w}x${h})`);
}

console.log("\nProduct and editorial artwork is real Figma photography and is not touched by this script.");
