class RelatedProducts extends HTMLElement {

  connectedCallback() {
    this.loadProducts();
  }

  loadProducts() {

    const related = this.querySelector("[data-related-section]");
    if (!related) return;

    const productId = related.dataset.productId;
    const limit = related.dataset.limit;
    const collection = related.dataset.collection;

    const url =
      `${window.theme.routes.product_recommendations_url}` +
      `?section_id=api-product-recommendation` +
      `&limit=${limit}` +
      `&product_id=${productId}` +
      `&intent=related`;

    fetch(url)
      .then(res => res.text())
      .then(html => {

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const source = doc.querySelector("[data-api-related-template]");
        if (!source) {
          this.remove();
          return;
        }

        related.innerHTML = source.innerHTML;

        this.filterCollection(collection, productId, related);

      })
      .catch(() => {
        this.remove();
      });

  }

  filterCollection(collection, productId, related) {

    const items = related.querySelectorAll("[data-grid-item]");

    items.forEach(item => {

      const collections =
        item.dataset.productCollections || "";

      const id =
        item.dataset.productId || "";

      // ❌ remove current product
      if (id == productId) {
        item.remove();
        return;
      }

      // ❌ remove other collection products
      if (!collections.includes(collection)) {
        item.remove();
      }

    });

    // hide section if empty
    if (related.querySelectorAll("[data-grid-item]").length === 0) {
      this.remove();
    }

  }
}

customElements.define("related-products", RelatedProducts);
