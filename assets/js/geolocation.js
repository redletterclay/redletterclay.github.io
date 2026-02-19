(async () => {
  const LOCAL_ZONE_STATES = ["IL", "CA", "NY"];

  await new Promise((resolve) => {
    if (document.body) {
      resolve();
    } else {
      document.addEventListener("DOMContentLoaded", resolve);
    }
  });

  //
  // keep track of local pickup zone
  //

  let regionCode = null;

  try {
    regionCode = getStorageItemWithTtl(
      localStorage,
      "localPickupZoneRegionCode",
    );
  } catch {}

  if (!regionCode) {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    regionCode = data.region_code;
    try {
      setStorageItemWithTtl(
        localStorage,
        "localPickupZoneRegionCode",
        regionCode,
        10 * 60 * 1000 /* 10 minutes */,
      );
    } catch {}
  }

  try {
    const inZone = LOCAL_ZONE_STATES.includes(regionCode);
    document.body.setAttribute("data-local-pickup-zone", inZone.toString());
  } catch {
    document.body.setAttribute("data-local-pickup-zone", "false");
  }

  //
  // functions
  //

  function getStorageItemWithTtl(storage, key) {
    const encoded = storage.getItem(key);
    if (encoded) {
      const [expiresAt, value] = JSON.parse(encoded);
      if (Date.now() < expiresAt) {
        return value;
      }
    }
    return null;
  }

  function setStorageItemWithTtl(storage, key, value, ttl) {
    const expiresAt = Date.now() + ttl;
    const encoded = JSON.stringify([expiresAt, value]);
    storage.setItem(key, encoded);
  }
})();
