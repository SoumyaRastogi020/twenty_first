
/**
 * Site-wide settings. Edit this file to change intro media, messages, and the gate.
 * GitHub Pages: paths are case-sensitive — match folder and file names exactly.
 */
const CARTO_API_KEY = "cb1_4g4c_1_7e2a1b11a3a2aca88449addb";

const CONFIG = {
  /** Soft gate only — not real security; the hash is visible in this file. */
  GATE_ENABLED: true,
  GATE_PROMPT: "onlypops insta password but ulta",
  /** SHA-256 (hex) of the correct answer, lowercase UTF-8, trimmed on compare. */
  GATE_PASSWORD_SHA256:
    "c3170f3fec9164d11ea4bf505590227390d8c648911706fc5c958ab9004972ef",

  INTRO_MESSAGE:
    "Even if you don't remember all of your 21 years, I'm going to make sure you remember the last three, because you're the reason they were memorable for me.",

  /** One path per intro flash frame (200ms each). Add/remove entries here. */
  /** Same order as photo1 (1).jpg … photo1 (20).jpg in your startup folder */
  INTRO_PHOTOS: [
    "assets/intro/01.jpg",
    "assets/intro/02.jpg",
    "assets/intro/03.jpg",
    "assets/intro/04.jpg",
    "assets/intro/05.jpg",
    "assets/intro/06.jpg",
    "assets/intro/07.jpg",
    "assets/intro/08.jpg",
    "assets/intro/09.jpg",
    "assets/intro/10.jpg",
    "assets/intro/11.jpg",
    "assets/intro/12.jpg",
    "assets/intro/13.jpg",
    "assets/intro/14.jpg",
    "assets/intro/15.jpg",
    "assets/intro/16.jpg",
    "assets/intro/17.jpg",
    "assets/intro/18.jpg",
    "assets/intro/19.jpg",
    "assets/intro/20.jpg",
  ],

  /** Shown after every pin is discovered. */
  FINAL_MESSAGE: {
    title: "You found every place",
    text:
      "Replace this in config.js with your own closing note — something warm and very you.",
  },

  /** Leaflet map — requires internet for tiles */
  MAP_MIN_ZOOM: 7,
  MAP_MAX_ZOOM: 18,
  /** SW and NE corners [lat, lng] */
  MAP_MAX_BOUNDS: [
    [17.8, 71.8],
    [20.6, 75.0],
  ],
  MAP_MAX_BOUNDS_VISCOSITY: 0.8,
  /** Place names stay open as tooltips at this zoom and above */
  MAP_LABEL_ZOOM: 14,
  MAP_FIT_PADDING: [48, 48],

  MAP_TILE_VOYAGER: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`,
  MAP_TILE_SATELLITE:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  MAP_ATTRIBUTION_VOYAGER:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  MAP_ATTRIBUTION_SATELLITE:
    "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",

  /** localStorage key for discovered pin ids */
  STORAGE_KEY: "twenty_first_discovered_v1",
  SESSION_GATE_KEY: "twenty_first_gate_ok",
};

/**
 * New password hash (run in browser console on https, or Node):
 *
 *   const t=new TextEncoder().encode('your-secret');const d=await crypto.subtle.digest('SHA-256',t);console.log([...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join(''));
 *
 * Or: node -e "require('crypto').createHash('sha256').update('your-secret').digest('hex')"
 */
