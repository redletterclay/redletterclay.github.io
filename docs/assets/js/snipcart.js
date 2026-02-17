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
  // event listeners for local pickup banner
  //

  window.addEventListener("rlc.local_pickup_banner.dismiss_clicked", () => {
    document.body.setAttribute("data-local-pickup-dismissed", "true");
    sessionStorage.setItem("rlc.local-pickup-dismissed", "true");
  });

  window.addEventListener("rlc.local_pickup_banner.apply_clicked", () => {
    Snipcart.api.cart.applyDiscount(DISCOUNT_CODE);
  });

  //
  // keep track of local pickup discount
  //

  updateAttr();
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
