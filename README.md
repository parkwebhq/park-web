# park-web

The waitlist site for **Park**, a Mac browser where every page is a card on an
endless canvas.

| Path | What |
| --- | --- |
| `index.html` | The page: the hero canvas, the scroll-driven "stroll" scene, the trailhead sign and the waitlist. Dev status lives in the `status-data` block near the bottom; its average walks the trail sticker in the waitlist. |
| `og.png` | The link preview card. |
| `assets/park-badge.svg` | The favicon: the "After hours" badge. |
| `waitlist/` | The Google Apps Script that stores sign-ups in a Sheet, and how to set it up. |

Static files, no build step. Served by GitHub Pages from `main` at
[parkweb.co](https://parkweb.co); `CNAME` holds the domain.

## Look and feel

- **Colour:** paper `#f3f1e8`, sign green `#134634`, lime `#dcf94c`.
- **Type:** Fraunces (soft) for anything big, Inter for reading.
- **Badges:** the logo is always one of the sticker-sheet badges, never the bare P. The header wears "After hours"; the sign and footer wear "Fresh cut".
- **Stickers:** `sticker()` in `index.html` builds every badge the way the sheet does: the mark grown into a die-cut (its inside corner filleted at 0.8 of the growth), a two-layer shadow, an edge, the vinyl and a soft gloss. The trail sticker in the waitlist is `park.svg` as drawn. The hero stickers can be moved, and they stay where you leave them.
- **Canvases:** where one canvas meets another, the edge is wavy. The stroll plays on its own lime band.

© 2026 Circa75 Media, LLC
