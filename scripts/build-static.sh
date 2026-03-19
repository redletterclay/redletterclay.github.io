#!/bin/bash
set -e

APP_DIR="src/app"
FRONTEND_DIR="$APP_DIR/(frontend)"
PAYLOAD_DIR="$APP_DIR/(payload)"
PAYLOAD_TMP="$APP_DIR/_payload-disabled"
SLUG_DIR="$FRONTEND_DIR/[slug]"
SLUG_TMP="$FRONTEND_DIR/_slug-disabled"
NEXT_API_DIR="$FRONTEND_DIR/next"
NEXT_API_TMP="$FRONTEND_DIR/_next-api-disabled"
SEARCH_DIR="$FRONTEND_DIR/search"
SEARCH_TMP="$FRONTEND_DIR/_search-disabled"
NOT_FOUND="$FRONTEND_DIR/not-found.tsx"
NOT_FOUND_TMP="$FRONTEND_DIR/_not-found.tsx.bak"
BUILD_INDEX="node_modules/next/dist/build/index.js"
BUILD_INDEX_BAK="${BUILD_INDEX}.static-build.bak"
PATCH_SCRIPT="/tmp/next-static-patch.js"

# Register restore trap FIRST so it runs on any exit
restore() {
  [ -d "$PAYLOAD_TMP" ]    && mv "$PAYLOAD_TMP" "$PAYLOAD_DIR"
  [ -d "$SLUG_TMP" ]       && mv "$SLUG_TMP" "$SLUG_DIR"
  [ -d "$NEXT_API_TMP" ]   && mv "$NEXT_API_TMP" "$NEXT_API_DIR"
  [ -d "$SEARCH_TMP" ]     && mv "$SEARCH_TMP" "$SEARCH_DIR"
  [ -f "$NOT_FOUND_TMP" ]  && mv "$NOT_FOUND_TMP" "$NOT_FOUND"
  [ -f "$BUILD_INDEX_BAK" ] && mv "$BUILD_INDEX_BAK" "$BUILD_INDEX"
  rm -f "$PATCH_SCRIPT"
  echo "→ Restored."
}
trap restore EXIT

echo "→ Clearing previous build..."
rm -rf out .next 2>/dev/null || true

echo "→ Hiding (payload), [slug], next API routes, and not-found routes for static export..."
mv "$PAYLOAD_DIR" "$PAYLOAD_TMP"
mv "$SLUG_DIR" "$SLUG_TMP"
[ -d "$NEXT_API_DIR" ] && mv "$NEXT_API_DIR" "$NEXT_API_TMP"
[ -d "$SEARCH_DIR" ]    && mv "$SEARCH_DIR" "$SEARCH_TMP"
[ -f "$NOT_FOUND" ] && mv "$NOT_FOUND" "$NOT_FOUND_TMP"

echo "→ Patching Next.js to skip error-page generation (not needed for GitHub Pages)..."
cp "$BUILD_INDEX" "$BUILD_INDEX_BAK"

cat > "$PATCH_SCRIPT" << 'PATCHEOF'
const fs = require('fs');
const file = process.argv[2];
let c = fs.readFileSync(file, 'utf8');
let ok = true;

const MARKER = '/* static-build-patch-applied */';

if (c.includes(MARKER)) {
  console.log('  Already patched.');
} else {
  // Find "Generating static pages" — unique string right after the exportPathMap function
  const anchorStr = "Generating static pages";
  const anchorPos = c.indexOf(anchorStr);
  console.log('  anchor pos:', anchorPos);

  if (anchorPos < 0) {
    console.error('  ERROR: could not find anchor "' + anchorStr + '"');
    ok = false;
  } else {
    // Find the last "return defaultMap;" before the anchor
    const retPos = c.lastIndexOf('return defaultMap;', anchorPos);
    console.log('  return defaultMap pos:', retPos);

    if (retPos < 0) {
      console.error('  ERROR: could not find "return defaultMap;" before anchor');
      ok = false;
    } else {
      const cleanup =
        MARKER + '\n' +
        "if(defaultMap['/404']&&defaultMap['/404'].page==='/_error')delete defaultMap['/404'];\n" +
        "if(defaultMap['/500']&&defaultMap['/500'].page==='/_error')delete defaultMap['/500'];\n" +
        "delete defaultMap['/_not-found'];\n";

      // Also patch moveExportedPage to skip missing files (avoids ENOENT for /404 + /500)
      const moveStr = "await _fs.promises.rename(orig, dest);";
      const movePatch = "if(_fs.existsSync(orig)) await _fs.promises.rename(orig, dest);";
      c = c.replace(moveStr, movePatch);
      console.log('  moveExportedPage safety patch applied:', c.includes(movePatch));
      c = c.slice(0, retPos) + cleanup + c.slice(retPos);
      console.log('  Cleanup patch inserted at pos', retPos);
    }
  }

  fs.writeFileSync(file, c);
}

if (!ok) { process.exit(1); }
console.log('  Done.');
PATCHEOF

node "$PATCH_SCRIPT" "$BUILD_INDEX"

echo "→ Running next build..."
NODE_ENV=production NEXT_STATIC_BUILD=true npm run build

echo "→ Creating 404.html and .nojekyll for GitHub Pages..."
cp out/index.html out/404.html 2>/dev/null || true
touch out/.nojekyll

echo "→ Done. Output in out/"
