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

  Snipcart.events.on("shipping.selected", (shippingMethod) => {
    (async () => {
      const isLocalPickup =
        shippingMethod.method === "Local Pick-Up in Chicago";
      if (isLocalPickup) {
        console.log("Snipcart discount: applying");
        await Snipcart.api.cart.applyDiscount(DISCOUNT_CODE);
        console.log("Snipcart discount: applied");
      } else {
        console.log("Snipcart discount: removing");
        await Snipcart.api.cart.removeDiscount(DISCOUNT_CODE);
        console.log("Snipcart discount: removed");
      }
    })().catch((err) => {
      console.warn("Snipcart discount update failed:", err);
    });
  });

  //
  // local pickup banner
  //

  try {
    if (sessionStorage.getItem("rlc.local-pickup-dismissed") === "true") {
      document.body.setAttribute("data-local-pickup-dismissed", "true");
    }
  } catch {}

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-action]");
    switch (btn?.getAttribute("data-action")) {
      case "apply_local_pickup_discount":
        Snipcart.api.cart.applyDiscount(DISCOUNT_CODE);
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
