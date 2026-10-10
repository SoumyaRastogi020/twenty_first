/**
 * All map places and their stories.
 *
 * Coordinates: in Google Maps, right-click a spot → click the lat/lng numbers to copy.
 * Paste lat and lng below (more decimals = more precise). Nudge if a pin sits off the road.
 *
 * Add files under assets/<id>/ and point src paths in content[].
 */
const LOCATIONS = [
  {
    id: "dahisar",
    name: "Dahisar",
    lat: 19.2502,
    lng: 72.8596,
    content: [
      { type: "story", title: "Dahisar", date: "—", text: "Your story here." },
      { type: "photo", src: "assets/dahisar/1.svg", caption: "Placeholder photo" },
    ],
  },
  {
    id: "borivali",
    name: "Borivali",
    lat: 19.2307,
    lng: 72.8567,
    content: [
      { type: "snippet", text: "A little note about Borivali." },
      { type: "photo", src: "assets/borivali/1.svg", caption: "" },
    ],
  },
  {
    id: "sgnp",
    name: "Sanjay Gandhi National Park",
    lat: 19.2147,
    lng: 72.9106,
    content: [
      {
        type: "story",
        title: "SGNP",
        date: "—",
        text: "Green escape — add your memory.",
      },
      { type: "photo", src: "assets/sgnp/1.svg", caption: "Trail day" },
    ],
  },
  {
    id: "jogeshwari",
    name: "Jogeshwari",
    lat: 19.1364,
    lng: 72.849,
    content: [{ type: "snippet", text: "Jogeshwari moment." }],
  },
  {
    id: "santacruz-metro",
    name: "Santacruz Metro Station",
    lat: 19.082,
    lng: 72.842,
    content: [
      { type: "story", title: "Metro", date: "—", text: "Commute stories." },
    ],
  },
  {
    id: "khar",
    name: "Khar",
    lat: 19.0714,
    lng: 72.8396,
    content: [{ type: "photo", src: "assets/khar/1.svg", caption: "Khar" }],
  },
  {
    id: "bandra",
    name: "Bandra",
    lat: 19.0544,
    lng: 72.8402,
    content: [
      { type: "story", title: "Bandra", date: "—", text: "Sea link views and lanes." },
      { type: "photo", src: "assets/bandra/1.svg", caption: "" },
    ],
  },
  {
    id: "lower-parel",
    name: "Lower Parel",
    lat: 18.9953,
    lng: 72.8306,
    content: [{ type: "snippet", text: "Lower Parel — mills to malls." }],
  },
  {
    id: "mumbai-central",
    name: "Mumbai Central",
    lat: 18.969,
    lng: 72.8205,
    content: [
      { type: "photo", src: "assets/mumbai-central/1.svg", caption: "Station" },
    ],
  },
  {
    id: "charni-road",
    name: "Charni Road",
    lat: 18.9524,
    lng: 72.823,
    content: [{ type: "story", title: "Charni Road", date: "—", text: "..." }],
  },
  {
    id: "marine-drive",
    name: "Marine Drive",
    lat: 18.944,
    lng: 72.8234,
    content: [
      {
        type: "story",
        title: "Queen's Necklace",
        date: "—",
        text: "Evening walks along the curve.",
      },
      { type: "photo", src: "assets/marine-drive/1.svg", caption: "Marine Drive" },
    ],
  },
  {
    id: "crawford-market",
    name: "Crawford Market",
    lat: 18.9473,
    lng: 72.8342,
    content: [{ type: "snippet", text: "Chaos and colour." }],
  },
  {
    id: "xaviers-college",
    name: "St. Xavier's College",
    lat: 18.9433,
    lng: 72.832,
    content: [
      { type: "story", title: "Xavier's", date: "—", text: "Campus memories." },
    ],
  },
  {
    id: "fort",
    name: "Fort",
    lat: 18.934,
    lng: 72.835,
    content: [{ type: "photo", src: "assets/fort/1.svg", caption: "Fort" }],
  },
  {
    id: "kala-ghoda",
    name: "Kala Ghoda",
    lat: 18.9285,
    lng: 72.8312,
    content: [{ type: "snippet", text: "Art and cafés." }],
  },
  {
    id: "colaba-causeway",
    name: "Colaba Causeway",
    lat: 18.9158,
    lng: 72.826,
    content: [
      {
        type: "story",
        title: "Causeway",
        date: "—",
        text: "Shopping and street food.",
      },
      { type: "photo", src: "assets/colaba-causeway/1.svg", caption: "" },
    ],
  },
  {
    id: "dy-patil-stadium",
    name: "DY Patil Stadium, Navi Mumbai",
    lat: 19.0433,
    lng: 73.0262,
    content: [
      {
        type: "video",
        src: "assets/dy-patil-stadium/clip1.mp4",
        poster: "assets/dy-patil-stadium/clip1.svg",
      },
    ],
  },
  {
    id: "ulwe",
    name: "Ulwe, Navi Mumbai",
    lat: 18.9877,
    lng: 73.0231,
    content: [{ type: "story", title: "Ulwe", date: "—", text: "Across the harbour." }],
  },
  {
    id: "imagica",
    name: "Imagica",
    lat: 18.8003,
    lng: 73.2745,
    content: [{ type: "photo", src: "assets/imagica/1.svg", caption: "Imagica day" }],
  },
  {
    id: "mapro-lonavla",
    name: "Mapro, Lonavla",
    lat: 18.748,
    lng: 73.405,
    content: [
      { type: "snippet", text: "Strawberry cream and misty hills." },
      { type: "photo", src: "assets/mapro-lonavla/1.svg", caption: "" },
    ],
  },
  {
    id: "pune",
    name: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    content: [
      { type: "story", title: "Pune", date: "—", text: "Weekend city." },
    ],
  },
  {
    id: "nashik",
    name: "Nashik",
    lat: 19.9975,
    lng: 73.7898,
    content: [{ type: "photo", src: "assets/nashik/1.svg", caption: "Nashik" }],
  },
];
