# Terrace packshot correction — 24 October 2026

Scope: the six-product terrace only. Product cards, detail photos, catalogue,
prices, purchasing rules and checkout are unchanged.

## Assets

Two front-view retouches were produced with the built-in Image Gen tool from
the existing manufacturer references. These are scene-specific retouches, not
newly sourced original manufacturer photographs.

| Reference retained in cards/details | Scene-only retouch |
| --- | --- |
| `public/assets/compo-basfoliar-ferrotop-10l.webp` | `public/assets/hero-basfoliar-front.png` |
| `public/assets/icl-sierrablen-plus-active-25kg.webp` | `public/assets/hero-sierrablen-front.png` |

All paths are relative to `apps/boutique/`. Original generated PNGs were copied
without raster editing. Perspective correction is limited to these two assets.
The other four scene images retain their original source files.

## Generation prompts

Basfoliar reference: `compo-basfoliar-ferrotop-10l.webp`.

> Precise object edit of the attached actual manufacturer product packshot. Deliver a tightly framed transparent-background PNG of this exact COMPO EXPERT Basfoliar Ferro Top SL white 10 L jerrycan, upright in a DIRECT FRONTAL view as if photographed at label height for a premium e-commerce shelf. Correct only camera angle and posture: vertical sides, level flat horizontal bottom resting on a plane, no rotation, no leaning, no visible underside. Preserve identity, white molded container, handle on upper left, green screw cap, exact original white/green label, COMPO EXPERT logo, product name "Basfoliar Ferro Top SL" with green SL, leaf-and-droplets graphic. Main label text horizontal and undistorted. Do not invent a formula, dosage, capacity text, brand, certification, new artwork, or new packaging. Keep the full product including cap and base. No props, background, pedestal, stone, floor, reflection, or shadow; real alpha transparency. Soft daylight from upper left, realistic material highlights, neutral colour balance. Canvas portrait, as tight to the product alpha bounds as possible (under 2% transparent margins on every side). This is a corrective retouch of the same product, not a new product design.

Sierrablen reference: `icl-sierrablen-plus-active-25kg.webp`.

> Precise object edit of the attached original ICL Sierrablen Plus Active 3 bag. Correct only its perspective into a DIRECT FRONTAL, upright packshot: main face squared to camera, vertical sides, completely level horizontal foot resting flat, no rotation or leaning, no exposed underside, not the current leaning three-quarter angle. Keep this same manufacturer packaging: white sack, orange top, green "Sierrablen Plus" label, large "3", "Active", exact formula "19-5-18+2MgO+TE", original small element row, green line pattern, ICL logo at bottom right, small white base. Do not substitute a newer bag, change 3 to 4-5, change formula or capacity, introduce new brand/artwork, or invent readable fine-print claims. Preserve material creases and convincing real sack volume while looking straight-on. Soft natural daylight from upper left, subtle highlights. Transparent PNG with genuine alpha; NO background, floor, stone, platform, reflection or cast/contact shadow. Entire product visible and tightly framed (less than 2% transparent margin around silhouette). Portrait canvas. This is a corrective retouch of the attached actual product, not a packaging redesign.

Final Sierrablen correction, using the first generated upright bag:

> Correct this transparent product packshot with TWO extremely narrow edits, keep everything else EXACTLY unchanged: 1) Remove the newly introduced small orange square badge containing "6-8 Weeks" to the right of the main 19-5-18 formula. Replace that badge area with the continuing plain orange vertical stripe underneath, no text or icon there. Do not add any duration claim. 2) Clean alpha transparency around the perimeter: remove all loose white/orange/green floating flecks, halos or detached pixels outside the actual sack silhouette. The bag must have clean anti-aliased edges and real transparent surroundings. Preserve the entire upright FRONT view, level flat base, vertical sides, same scale and tight crop; keep all other packaging/artwork/text exactly as supplied: Sierrablen Plus, Active, large 3, 19-5-18+2MgO+TE and ICL logo. No new claims, packaging redesign, backgrounds, shadow or floor. The existing product is already correctly straightened; do NOT change posture, lighting or proportions.

## Placement

- Coordinates remain attached to the background's native 1691 × 930 plane.
- Rear row base: 56.9% of plane height, inside the middle tread.
- Front row base: 73.4%, inside the lower tread.
- Contact shadows are narrow, warm ellipses directly under the objects.
- Cast shadows share one direction and stay shallow enough to lie on the tread.
- PNG transparent bottom margins are compensated with scene-only translation.
- The jerrycan uses the frontal asset's natural aspect ratio, without rotation.

## Verification

Vite boutique build and whitespace checks. Browser inspection at desktop and
mobile sizes: six loaded products, aligned bases and no horizontal overflow.
The Basfoliar detail still uses the original manufacturer image. No real mobile
device or physical lighting setup was tested.

Release scope remains the development branch and the separate public maquette
project. No publication to the live hanami-gazon.fr site is authorized here.
