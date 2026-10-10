# Twenty First — Bombay memory map

A mobile-first static birthday site: intro sequence, then an interactive **Leaflet** map with pins for places and stories. No build step — plain HTML, CSS, and JavaScript for **GitHub Pages**.

**Internet required:** map tiles load from Carto / Esri CDNs (see `config.js`).

## Project layout

```
index.html          Entry page (+ Leaflet from cdnjs)
config.js           Intro, gate, tile URLs, map bounds/zoom
data/locations.js   All pins (lat/lng) and content blocks
css/style.css
js/main.js          Flow, progress, gate, celebration
js/intro.js         Photo flash + disperse toward pins
js/map.js           Leaflet map, clusters, custom markers
js/panel.js         Location panel + lightbox
assets/intro/       Intro flash images (listed in config.js)
assets/<location-id>/  Photos and videos per place
```

## Run locally

Use any static server (recommended — gate uses Web Crypto, which needs **HTTPS** or `localhost`):

```bash
python -m http.server 8080
# Then open http://localhost:8080
```

Opening `index.html` as a `file://` URL may break the password gate and map tiles.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source:** Deploy from branch `main`, folder `/ (root)`.
3. Your site will be at `https://<username>.github.io/<repo>/`.

**Gotchas**

- Paths are **case-sensitive** on GitHub Pages.
- Individual files must be **under 100 MB** (keep photos and videos much smaller).
- The map needs a network connection for tiles and CDN scripts.

## Customize content (start here)

1. **`config.js`** — Intro message, final text, intro photo list, gate hash, **tile URLs**, map bounds.
2. **`data/locations.js`** — Real **`lat` / `lng`** per place, then stories and media paths.
3. **`assets/`** — Drop `.jpg` / `.mp4` into each location folder.

### Adjust pin coordinates

In Google Maps: **right-click** the spot → click the **coordinates** at the top to copy. Paste into `lat` and `lng` in `data/locations.js`. Reload and nudge until the pin sits where you want.

### Add a new location

1. Create `assets/your-id/` and add media.
2. Append to `LOCATIONS`:

```javascript
{
  id: "your-id",
  name: "Place Name",
  lat: 19.0,
  lng: 72.8,
  content: [
    { type: "photo", src: "assets/your-id/1.jpg", caption: "Optional" },
    { type: "story", title: "Title", date: "2024", text: "..." },
  ],
},
```

3. Reload — a new marker appears and the progress total updates.

### Swap map tile style

In **`config.js`**:

- **`MAP_TILE_VOYAGER`** — default street map (Carto Voyager).
- **`MAP_TILE_SATELLITE`** — Esri World Imagery (also toggled via the layer control on the map).

Change the URL pattern or attribution strings there. Warm tint on tiles only: edit **`--map-tile-filter`** in `css/style.css` (set to `none` to disable).

### Compress media

- **Photos:** ~1600px wide JPEG, quality 80–85 (Squoosh, ImageOptim).
- **Videos:** Short H.264 MP4, 720p:  
  `ffmpeg -i in.mov -vf scale=-2:720 -c:v libx264 -crf 23 -c:a aac -movflags +faststart out.mp4`

Missing media shows a gentle “coming soon” state.

## Password gate (soft only)

Not real security — the SHA-256 hash is visible in `config.js`.

```javascript
// Browser console (HTTPS or localhost):
const t = new TextEncoder().encode("your-new-secret");
const d = await crypto.subtle.digest("SHA-256", t);
console.log([...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join(""));
```

Or: `node -e "require('crypto').createHash('sha256').update('your-new-secret').digest('hex')"`

Paste into `GATE_PASSWORD_SHA256`. Unlock persists for the **session** via `sessionStorage`.

## Map behaviour

- **Leaflet 1.9.4** + **markercluster 1.5.3** (cdnjs).
- Initial view: **fitBounds** on all pins (Nashik → Pune); after intro disperse, **flyToBounds** animates the same.
- Zoom **7–18**; pan limited by `MAP_MAX_BOUNDS` in `config.js`.
- South Mumbai pins cluster at low zoom; tap cluster to zoom in, or pinch until they split (`disableClusteringAtZoom` ≈ label zoom).
- Place names: tooltips on hover (desktop), tap, or always at zoom **14+** (`MAP_LABEL_ZOOM`).
- **Reset view** / **South Mumbai** shortcuts on the right; on phones Leaflet’s +/- is hidden (use pinch); desktop has extra +/- buttons.
- **Skip intro** on the first screen is for testing — remove from `index.html` when done.

## Intro flash

Paths in `CONFIG.INTRO_PHOTOS`. All frames are **preloaded** before the 200ms sequence. After the flash, polaroids fly toward real pin positions on the map, then the map becomes fully interactive.

---

Relative paths only — safe for GitHub Pages project sites.
