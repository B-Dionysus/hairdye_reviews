# Hair Dye Reviews — Template

Simple single-page template for saving hair-dye reviews locally in the browser. Includes fields for product, shade, rating, date, notes, and an optional photo.

Files added
- `index.html` — main page and form
- `styles.css` — responsive styles
- `script.js` — client-side logic, image preview, and localStorage persistence

How it works
- Reviews are saved to `localStorage` under the key `hairdye_reviews_v1`.
- Images are stored as data-URLs in localStorage, so they remain available in the same browser on the same device.

Try it
1. Open `index.html` in a browser (double-click or use a local server).
2. Fill the form and optionally attach a photo — the preview will show.
3. Click "Save review" and see it appear below.

Notes & limitations
- No backend: data is stored only in the browser. Clearing browser storage will remove reviews.
- Images stored in localStorage increase storage usage; for many images consider adding a server or using IndexedDB.

Sample review

- Product: L'Oreal Feria
- Shade: 77 Raspberry
- Rating: 4
- Date: 2025-10-12
- Notes: Vibrant color on first wash; faded to a warm pink over 2 weeks. Developer 20 vol. Slightly dry — used deep conditioner.

# hairdye_reviews
keeping track of what hair dye works for me
