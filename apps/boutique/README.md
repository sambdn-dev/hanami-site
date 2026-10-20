# Boutique Hanami

The existing React boutique runs at `/boutique` on the same Next.js deployment.
`npm run build` builds its Vite assets first, then builds Next.js. The public
navbar uses a document link to preserve the boutique's isolated CSS and avoid
duplicating the site header. This is a same-origin shop, with no iframe.

Shopify requests go through `/api/commerce`. Server variables:

- `SHOPIFY_STORE_DOMAIN=eyaij4-ur.myshopify.com`
- `SHOPIFY_STOREFRONT_PUBLIC_TOKEN`: server-only Shopify Storefront token
- `HANAMI_CHECKOUT_ENABLED`: set to `true` only after checkout access, taxes
  and delivery are verified; otherwise checkout remains closed.

Prices and availability come from Shopify. Unpublished products are omitted.
The committed catalogue map contains public identities and VAT rates, never
purchase costs or customer data. Formats reconditioned by Hanami keep their
own prices and quantities.

The autumn terrace keeps the six approved products. Recommendation and reward
UI proposals are visual explorations and are not activated by this integration.

The quantity selector opens on the add-to-cart icon. It requires confirmation,
displays the selected total and respects the remaining cart limit of 99 units.

The compact store header keeps its logo, search and basket on a single row at
mobile and desktop sizes. The original wordmark carries the Store label;
between 40 and 168 pixels of scroll it progressively crossfades to the original
H-and-leaf symbol without moving the controls. A passive listener batches updates
with requestAnimationFrame; reduced motion removes the small scale/translation.

`/pistes-mobile/index.html` compares three visual reward concepts on the same
basket (same products, quantities and total). These images do not activate any
discount. This branch remains a development preview; do not deploy it to the
live Hanami domain without separate authorization.
