#!/bin/bash
# Dump the local Payload Postgres DB to db/snapshot.sql for use in GitHub Actions CI.
# Run this whenever you want to update the CI snapshot with your latest local data.
# Then commit the updated db/snapshot.sql.
set -e

DUMP_FILE="db/snapshot.sql"
CONTAINER=$(docker ps --filter "name=redletterclay-db" --format "{{.Names}}" | head -1)

if [ -z "$CONTAINER" ]; then
  echo "Error: Could not find a running postgres container."
  echo "Make sure your Docker stack is running: docker compose up -d"
  exit 1
fi

mkdir -p db
echo "→ Dumping database from $CONTAINER..."
docker exec "$CONTAINER" pg_dump -U payload -d payload --no-owner --no-privileges -Fp > "$DUMP_FILE"
echo "→ Saved to $DUMP_FILE ($(du -h "$DUMP_FILE" | cut -f1))"
echo "→ Done. Commit db/snapshot.sql to update the CI snapshot."
