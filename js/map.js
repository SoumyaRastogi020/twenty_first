/**
 * Leaflet map, marker clusters, and custom pin markers.
 */
const MapController = (function () {
  let map = null;
  let clusterGroup = null;
  let markersById = new Map();
  let discovered = new Set();
  let onPinActivate = null;
  let fullTripBounds = null;
  let southMumbaiBounds = null;
  let focusedPinId = null;

  const SOUTH_MUMBAI_IDS = [
    "charni-road",
    "marine-drive",
    "crawford-market",
    "xaviers-college",
    "fort",
    "kala-ghoda",
    "colaba-causeway",
  ];

  function createPinIcon(isDiscovered) {
    return L.divIcon({
      className: "leaflet-pin-icon",
      html: `<span class="pin-hit"><span class="pin-dot${
        isDiscovered ? " is-discovered" : ""
      }"></span></span>`,
      iconSize: [44, 44],
      iconAnchor: [22, 40],
    });
  }

  function createClusterIcon(cluster) {
    const kids = cluster.getAllChildMarkers();
    const count = kids.length;
    const allDisc = kids.every((m) => m._discovered);
    const anyDisc = kids.some((m) => m._discovered);
    let extra = "";
    if (allDisc) extra = " is-all-discovered";
    else if (anyDisc) extra = " is-partial";
    return L.divIcon({
      html: `<span class="cluster-bubble">${count}</span>`,
      className: "leaflet-cluster-icon" + extra,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  }

  function buildBounds(latLngs) {
    return L.latLngBounds(latLngs);
  }

  function ensureMap() {
    if (map) return;

    const voyager = L.tileLayer(CONFIG.MAP_TILE_VOYAGER, {
      attribution: CONFIG.MAP_ATTRIBUTION_VOYAGER,
      subdomains: "abcd",
      maxZoom: CONFIG.MAP_MAX_ZOOM,
    });

    const satellite = L.tileLayer(CONFIG.MAP_TILE_SATELLITE, {
      attribution: CONFIG.MAP_ATTRIBUTION_SATELLITE,
      maxZoom: CONFIG.MAP_MAX_ZOOM,
    });

    map = L.map("leaflet-map", {
      zoomControl: false,
      minZoom: CONFIG.MAP_MIN_ZOOM,
      maxZoom: CONFIG.MAP_MAX_ZOOM,
      maxBounds: CONFIG.MAP_MAX_BOUNDS,
      maxBoundsViscosity: CONFIG.MAP_MAX_BOUNDS_VISCOSITY,
      layers: [voyager],
    });

    L.control
      .layers(
        { Voyager: voyager, Satellite: satellite },
        null,
        { position: "topright" }
      )
      .addTo(map);

    L.control
      .zoom({ position: "bottomright" })
      .addTo(map);

    clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 52,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: CONFIG.MAP_LABEL_ZOOM,
      iconCreateFunction: createClusterIcon,
    });

    LOCATIONS.forEach((loc) => {
      const isDisc = discovered.has(loc.id);
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createPinIcon(isDisc),
        alt: loc.name,
      });
      marker._locId = loc.id;
      marker._discovered = isDisc;
      marker._loc = loc;

      marker.bindTooltip(loc.name, {
        direction: "top",
        offset: [0, -12],
        className: "pin-tooltip",
        opacity: 0.95,
      });

      marker.on("click", () => {
        focusedPinId = loc.id;
        marker.openTooltip();
        if (onPinActivate) onPinActivate(loc);
        panForOpenPanel(loc);
      });

      markersById.set(loc.id, marker);
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    const allLatLngs = LOCATIONS.map((l) => [l.lat, l.lng]);
    fullTripBounds = buildBounds(allLatLngs);

    const southLatLngs = LOCATIONS.filter((l) =>
      SOUTH_MUMBAI_IDS.includes(l.id)
    ).map((l) => [l.lat, l.lng]);
    southMumbaiBounds = buildBounds(southLatLngs);

    map.on("zoomend", updatePermanentTooltips);
    map.on("click", () => {
      if (focusedPinId) {
        focusedPinId = null;
        updatePermanentTooltips();
      }
    });

    bindCustomControls();

    window.addEventListener("resize", () => {
      if (map) map.invalidateSize();
    });
  }

  function bindCustomControls() {
    document.getElementById("btn-reset-view").addEventListener("click", () => {
      flyToFullTrip();
    });
    document.getElementById("btn-south-mumbai").addEventListener("click", () => {
      if (!map || !southMumbaiBounds) return;
      map.flyToBounds(southMumbaiBounds, {
        padding: CONFIG.MAP_FIT_PADDING,
        duration: 1.2,
        maxZoom: 15,
      });
    });
    const zoomIn = document.getElementById("btn-zoom-in");
    const zoomOut = document.getElementById("btn-zoom-out");
    if (zoomIn) zoomIn.addEventListener("click", () => map && map.zoomIn());
    if (zoomOut) zoomOut.addEventListener("click", () => map && map.zoomOut());
  }

  function updatePermanentTooltips() {
    if (!map) return;
    const showAll = map.getZoom() >= CONFIG.MAP_LABEL_ZOOM;
    markersById.forEach((marker, id) => {
      const loc = marker._loc;
      const keepOpen = showAll || focusedPinId === id;
      marker.unbindTooltip();
      marker.bindTooltip(loc.name, {
        direction: "top",
        offset: [0, -12],
        className: "pin-tooltip",
        opacity: 0.95,
        permanent: showAll,
      });
      if (keepOpen && !showAll) marker.openTooltip();
    });
  }

  function fitFullTrip(animate) {
    if (!map || !fullTripBounds) return;
    map.fitBounds(fullTripBounds, {
      padding: CONFIG.MAP_FIT_PADDING,
      animate: !!animate,
    });
  }

  function flyToFullTrip() {
    if (!map || !fullTripBounds) return;
    map.flyToBounds(fullTripBounds, {
      padding: CONFIG.MAP_FIT_PADDING,
      duration: 1.4,
    });
  }

  /** Call before disperse: map visible behind overlay, bounds set for latLngToContainerPoint. */
  function prepareIntroView() {
    ensureMap();
    map.invalidateSize();
    fitFullTrip(false);
    updatePermanentTooltips();
  }

  /**
   * Offset from viewport center to a pin (for polaroid disperse), in pixels.
   */
  function getDisperseTargetForIndex(index) {
    if (!map) return { tx: 0, ty: 0 };
    const loc = LOCATIONS[index % LOCATIONS.length];
    const pt = map.latLngToContainerPoint([loc.lat, loc.lng]);
    const mapRect = map.getContainer().getBoundingClientRect();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    return {
      tx: mapRect.left + pt.x - cx,
      ty: mapRect.top + pt.y - cy,
    };
  }

  function panForOpenPanel(loc) {
    if (!map) return;
    const isMobile = window.matchMedia("(max-width: 899px)").matches;
    if (!isMobile) return;

    const pt = map.latLngToContainerPoint([loc.lat, loc.lng]);
    const mapRect = map.getContainer().getBoundingClientRect();
    const screenY = mapRect.top + pt.y;
    const panelCover = window.innerHeight * 0.42;
    const safeFromBottom = window.innerHeight - panelCover - 72;

    if (screenY > safeFromBottom) {
      map.panBy([0, screenY - safeFromBottom], {
        animate: true,
        duration: 0.45,
      });
    }
  }

  function refreshMarkerStyles() {
    markersById.forEach((marker, id) => {
      const isDisc = discovered.has(id);
      marker._discovered = isDisc;
      marker.setIcon(createPinIcon(isDisc));
    });
    if (clusterGroup) clusterGroup.refreshClusters();
    updatePermanentTooltips();
  }

  function init(options) {
    onPinActivate = options.onPinActivate;
    /* Map is created lazily when intro finishes or prepareIntroView runs */
  }

  function setDiscovered(ids) {
    discovered = new Set(ids);
    if (map) refreshMarkerStyles();
  }

  function clearFocus() {
    focusedPinId = null;
    updatePermanentTooltips();
  }

  /** After intro (or skip): size map and optionally fly to full trip. */
  function onIntroComplete(animateView) {
    ensureMap();
    map.invalidateSize();
    if (animateView) flyToFullTrip();
    else fitFullTrip(false);
    updatePermanentTooltips();
  }

  return {
    init,
    setDiscovered,
    clearFocus,
    prepareIntroView,
    flyToFullTrip,
    getDisperseTargetForIndex,
    panForOpenPanel,
    ensureMap,
    onIntroComplete,
  };
})();
