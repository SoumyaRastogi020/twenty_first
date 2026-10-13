/**
 * Shared media URL helpers (posters, lazy video).
 */
const MediaUtils = (function () {
  /** Reel video placeholder: intro photo for this pin (see CONFIG.REEL_VIDEO_STILL). */
  function reelVideoStill(locationId) {
    if (!locationId || typeof CONFIG === "undefined" || !CONFIG.REEL_VIDEO_STILL) {
      return "";
    }
    return CONFIG.REEL_VIDEO_STILL[locationId] || "";
  }

  /**
   * @param {object} block — video content block
   * @param {string} [locationId] — when set, reel stills use REEL_VIDEO_STILL
   */
  function videoPosterSrc(block, locationId) {
    const reelStill = reelVideoStill(locationId);
    if (reelStill) return reelStill;
    if (block.poster) return block.poster;
    return "";
  }

  return { videoPosterSrc, reelVideoStill };
})();
