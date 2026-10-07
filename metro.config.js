const { getDefaultConfig } = require('expo/metro-config');

// Extends the Expo defaults (required for SDK 56+, on-demand filesystem etc.).
const config = getDefaultConfig(__dirname);

// `expo-sqlite` ships a WebAssembly build of SQLite (`wa-sqlite`) for its web
// platform support, and Metro has to know `.wasm` files are assets rather than
// source code. Without this the web export fails to resolve
// `wa-sqlite/wa-sqlite.wasm` — which is only imported by the web bundle, so the
// native (Android) build is unaffected either way.
config.resolver.assetExts.push('wasm');

module.exports = config;