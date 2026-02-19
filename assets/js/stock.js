(async () => {
  const [products] = await Promise.all([
    getProducts(),
    waitForDOMContentLoaded(),
  ]);

  const idToStock = new Map(products.map((p) => [p.id, p.stock]));
  for (const el of document.querySelectorAll("[data-product-id]")) {
    const id = el.dataset.productId;
    const stock = idToStock.get(id);
    if (stock !== undefined) {
      el.dataset.stock = String(stock);
    }
  }

  /**
   * Fetches all pages of products from the API. Returns the items from each page concatenated.
   */
  async function getProducts() {
    const products = [];
    let page = 1;
    for (;;) {
      const url = new URL(
        "https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-02bd4a9b-cb71-49b3-966d-654becd1fccd/default/GetProducts",
      );
      url.searchParams.set("page", `${page}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
      const body = await response.json();
      products.push(...body.items);
      if (body.finished) {
        break;
      }
      page += 1;
    }
    return products;
  }

  /**
   * Waits for the DOM content to be loaded.
   */
  async function waitForDOMContentLoaded() {
    return new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  }
})();
