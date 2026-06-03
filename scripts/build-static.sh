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
SHOP_PAGINATED_DIR="$FRONTEND_DIR/shop/p"
SHOP_PAGINATED_TMP="$FRONTEND_DIR/shop/_p-disabled"
SHOP_CAT_PAGINATED_DIR="$FRONTEND_DIR/shop/[category]/p"
SHOP_CAT_PAGINATED_TMP="$FRONTEND_DIR/shop/[category]/_p-disabled"
NOT_FOUND="$FRONTEND_DIR/not-found.tsx"
NOT_FOUND_TMP="$FRONTEND_DIR/_not-found.tsx.bak"
BUILD_INDEX="node_modules/next/dist/build/index.js"
BUILD_INDEX_BAK="${BUILD_INDEX}.static-build.bak"
PATCH_SCRIPT="/tmp/next-static-patch.js"

# Register restore trap FIRST so it runs on any exit
restore() {
  [ -d "$PAYLOAD_TMP" ]             && mv "$PAYLOAD_TMP" "$PAYLOAD_DIR"
  [ -d "$SLUG_TMP" ]                && mv "$SLUG_TMP" "$SLUG_DIR"
  [ -d "$NEXT_API_TMP" ]            && mv "$NEXT_API_TMP" "$NEXT_API_DIR"
  [ -d "$SEARCH_TMP" ]              && mv "$SEARCH_TMP" "$SEARCH_DIR"
  [ -d "$SHOP_PAGINATED_TMP" ]      && mv "$SHOP_PAGINATED_TMP" "$SHOP_PAGINATED_DIR"
  [ -d "$SHOP_CAT_PAGINATED_TMP" ]  && mv "$SHOP_CAT_PAGINATED_TMP" "$SHOP_CAT_PAGINATED_DIR"
  [ -f "$NOT_FOUND_TMP" ]           && mv "$NOT_FOUND_TMP" "$NOT_FOUND"
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

# Next.js 15.4 treats generateStaticParams returning [] as "missing" in output:export mode.
# Query postgres to check whether paginated routes will produce any pages (need >20 products).
# If the query fails (docker down, etc.) we hide both routes as a safe fallback.
# In CI (GitHub Actions) Docker is not available — always hide paginated routes as safe fallback.
# Locally, query postgres to only hide routes that would produce an empty generateStaticParams.
if [ -n "$CI" ]; then
  echo "→ CI environment — hiding paginated shop routes (no DB access)..."
  [ -d "$SHOP_PAGINATED_DIR" ]     && mv "$SHOP_PAGINATED_DIR" "$SHOP_PAGINATED_TMP"
  [ -d "$SHOP_CAT_PAGINATED_DIR" ] && mv "$SHOP_CAT_PAGINATED_DIR" "$SHOP_CAT_PAGINATED_TMP"
else
  echo "→ Checking product counts for paginated shop routes..."
  TOTAL_ACTIVE=$(docker compose exec -T db psql -U payload -d payload -t \
    -c "SELECT COUNT(*) FROM products WHERE active = true;" 2>/dev/null | tr -d ' \n')
  MAX_PER_CAT=$(docker compose exec -T db psql -U payload -d payload -t \
    -c "SELECT COALESCE(MAX(n),0) FROM (SELECT COUNT(*) AS n FROM products p JOIN products_tags t ON t.parent_id = p.id WHERE p.active = true GROUP BY t.value) s;" \
    2>/dev/null | tr -d ' \n')

  if [[ ! "$TOTAL_ACTIVE" =~ ^[0-9]+$ ]] || [ "$TOTAL_ACTIVE" -le 20 ]; then
    echo "  /shop/p — hiding (${TOTAL_ACTIVE:-unknown} total active products, need >20)"
    [ -d "$SHOP_PAGINATED_DIR" ] && mv "$SHOP_PAGINATED_DIR" "$SHOP_PAGINATED_TMP"
  else
    echo "  /shop/p — keeping ($TOTAL_ACTIVE total active products)"
  fi

  if [[ ! "$MAX_PER_CAT" =~ ^[0-9]+$ ]] || [ "$MAX_PER_CAT" -le 20 ]; then
    echo "  /shop/[category]/p — hiding (max ${MAX_PER_CAT:-unknown} per category, need >20)"
    [ -d "$SHOP_CAT_PAGINATED_DIR" ] && mv "$SHOP_CAT_PAGINATED_DIR" "$SHOP_CAT_PAGINATED_TMP"
  else
    echo "  /shop/[category]/p — keeping (max $MAX_PER_CAT products in a category)"
  fi
fi

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

if [ -z "$CI" ]; then
  echo "→ Restarting dev server (build wiped .next)..."
  docker compose restart app
fi
