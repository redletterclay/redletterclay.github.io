(async () => {
  const DISCOUNT_CODE = "LOCALPICKUP15";

  await Promise.all([
    new Promise((resolve) => {
      if (document.body) {
        resolve();
      } else {
        document.addEventListener("DOMContentLoaded", resolve);
      }
    }),
    new Promise((resolve) => {
      if (window.Snipcart) {
        resolve();
      } else {
        document.addEventListener("snipcart.ready", resolve);
      }
    }),
  ]);

  //
  // local pickup banner
  //

  try {
    if (sessionStorage.getItem("rlc.local-pickup-dismissed") === "true") {
      document.body.setAttribute("data-local-pickup-dismissed", "true");
    }
  } catch {}

  document.addEventListener("click", async (e) => {
    switch (e.target.closest("[data-action]")?.getAttribute("data-action")) {
      case "toggle_local_pickup_discount":
        if (
          document.body.getAttribute("data-local-pickup-inflight") === "true"
        ) {
          return;
        }

        document.body.setAttribute("data-local-pickup-inflight", "true");
        try {
          if (
            document.body.getAttribute("data-local-pickup-discount") === "true"
          ) {
            await Snipcart.api.cart.removeDiscount(DISCOUNT_CODE);
          } else {
            await Snipcart.api.cart.applyDiscount(DISCOUNT_CODE);
          }
        } finally {
          document.body.setAttribute("data-local-pickup-inflight", "false");
        }
        break;
      case "dismiss_local_pickup_banner":
        document.body.setAttribute("data-local-pickup-dismissed", "true");
        sessionStorage.setItem("rlc.local-pickup-dismissed", "true");
        break;
    }
  });

  //
  // keep track of local pickup discount
  //

  Snipcart.store.subscribe(updateAttr);

  function updateAttr() {
    const state = Snipcart.store.getState();
    const items = state.cart.discounts.items;
    const hasLocalDiscount = items.some((d) => d.code === DISCOUNT_CODE);
    document.body.setAttribute(
      "data-local-pickup-discount",
      hasLocalDiscount.toString(),
    );
    if (hasLocalDiscount) {
      document.body.removeAttribute("data-local-pickup-dismissed");
      sessionStorage.removeItem("rlc.local-pickup-dismissed");
    }
  }
})();
