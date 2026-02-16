const LOCAL_PICKUP_METHOD_NAME = "Local Pick-Up in Chicago";
const DISCOUNT_CODE = "LOCALPICKUP15";
const DATA_ATTR = "data-local-pickup-discount";

function updateBodyDataAttribute() {
  const state = window.Snipcart.store.getState();
  const items = state.cart.discounts.items;
  const hasLocalDiscount = items.some((d) => d.code === DISCOUNT_CODE);
  document.body.setAttribute(
    DATA_ATTR,
    hasLocalDiscount ? "applied" : "not-applied",
  );
}

document.addEventListener("snipcart.ready", () => {
  const { Snipcart } = window;

  updateBodyDataAttribute();
  Snipcart.store.subscribe(updateBodyDataAttribute);

  Snipcart.events.on("shipping.selected", (shippingMethod) => {
    (async () => {
      const isLocalPickup = shippingMethod.method === LOCAL_PICKUP_METHOD_NAME;
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
});
