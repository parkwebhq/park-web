# park-web

The waitlist site for **Park**, a Mac browser where every page is a card on an
endless canvas.

| Path | What |
| --- | --- |
| `index.html` | The page: the hero canvas, the scroll-driven "stroll" scene, the "Coming from Arc?" rows, the trailhead sign and the waitlist. Dev status lives in the `status-data` block near the bottom; its average walks the trail sticker in the waitlist. |
| `og.png` | The link preview card. |
| `assets/park-badge.svg` | The favicon: the "After hours" badge. |
| `email/park-logo.png` | The badge in Park's emails (sign-in and welcome, sent by Supabase), at 3× for 37×44. |
| `waitlist/` | The Google Apps Script that stores sign-ups in a Sheet, and how to set it up. |
| `beta/` | The beta opt-in page. Waitlist emails link to it as `/beta#<their address>`, which fills in the field without the address reaching a server. |
| `api/beta.js` | The Vercel Function behind that page: it adds the address to Resend's "Park beta" segment, and makes a contact first if there isn't one. Needs `RESEND_API_KEY`, a Full access key, in the Vercel project; until then the page says the list isn't open yet. |

Static files and one Vercel Function, no build step. Vercel serves `main` at
[parkweb.co](https://parkweb.co); `CNAME` is left over from GitHub Pages.

## Look and feel

- **Colour:** paper `#f3f1e8`, sign green `#134634`, lime `#dcf94c`.
- **Type:** Fraunces (soft) for anything big, Inter for reading.
- **Badges:** the logo is always one of the sticker-sheet badges, never the bare P. The header wears "After hours"; the sign and footer wear "Fresh cut".
- **Stickers:** `sticker()` in `index.html` builds every badge the way the sheet does: the mark grown into a die-cut (its inside corner filleted at 0.8 of the growth), a two-layer shadow, an edge, the vinyl and a soft gloss. The trail sticker in the waitlist is `park.svg` as drawn. The hero stickers can be moved, and they stay where you leave them.
- **Canvases:** where one canvas meets another, the edge is wavy. The stroll plays on its own lime band.

© 2026 Circa75 Media, LLC
