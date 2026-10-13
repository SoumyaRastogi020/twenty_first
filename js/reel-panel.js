/**
 * Horizontal "reel" panel: auto-scrolls left until the user taps, then manual scroll.
 */
const ReelPanel = (function () {
  const SCROLL_PX_PER_SEC = 32;

  function createItem(block, locationId) {
    const item = document.createElement("div");
    item.className = "reel-item";

    if (block.type === "snippet") {
      item.classList.add("reel-item--note");
      item.textContent = block.text || "";
      return item;
    }

    if (block.type === "photo") {
      item.classList.add("reel-item--photo");
      const img = document.createElement("img");
      img.src = block.src;
      img.alt = block.caption || "";
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;
      img.onerror = () => {
        item.innerHTML = '<span class="reel-item__missing">Photo soon</span>';
      };
      item.appendChild(img);
      return item;
    }

    if (block.type === "video") {
      item.classList.add("reel-item--video");
      const wrap = document.createElement("div");
      wrap.className = "reel-video-wrap";

      const posterSrc = MediaUtils.videoPosterSrc(block, locationId);
      const posterImg = document.createElement("img");
      posterImg.className = "reel-video-poster";
      posterImg.alt = "";
      posterImg.decoding = "async";
      posterImg.draggable = false;

      const video = document.createElement("video");
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.preload = "none";
      video.dataset.src = block.src;

      function hidePoster() {
        posterImg.classList.add("is-hidden");
      }

      if (posterSrc) {
        posterImg.src = posterSrc;
        posterImg.onerror = () => {
          posterImg.classList.add("is-missing");
        };
      } else {
        posterImg.classList.add("is-missing");
      }

      video.addEventListener(
        "loadeddata",
        () => {
          hidePoster();
        },
        { once: true }
      );

      wrap.appendChild(video);
      wrap.appendChild(posterImg);
      item.appendChild(wrap);
      return item;
    }

    if (block.type === "story") {
      item.classList.add("reel-item--note");
      item.innerHTML = `<strong>${escapeHtml(block.title || "")}</strong><br>${escapeHtml(block.text || "")}`;
      return item;
    }

    return null;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function attachLazyVideos(track, viewport) {
    const items = track.querySelectorAll(".reel-item--video");
    if (!items.length) return;

    const loadItem = (item) => {
      if (item.dataset.videoLoaded === "1") return;
      const video = item.querySelector("video");
      if (!video || !video.dataset.src) return;
      item.dataset.videoLoaded = "1";
      video.src = video.dataset.src;
      video.load();
      video.play().catch(() => {});
    };

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => loadItem(item));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadItem(entry.target);
        });
      },
      { root: viewport, rootMargin: "120px 0px", threshold: 0.05 }
    );

    items.forEach((item) => io.observe(item));

    return () => io.disconnect();
  }

  /**
   * @returns {() => void} cleanup when panel closes
   */
  function mount(location, bodyEl, panelApi) {
    const viewport = document.createElement("div");
    viewport.className = "reel-viewport";
    viewport.setAttribute("aria-label", "Memory reel");

    const track = document.createElement("div");
    track.className = "reel-track";

    (location.content || []).forEach((block) => {
      const el = createItem(block, location.id);
      if (el) track.appendChild(el);
    });

    viewport.appendChild(track);
    bodyEl.appendChild(viewport);

    const disconnectLazy = attachLazyVideos(track, viewport);
    const videos = track.querySelectorAll("video");
    let paused = false;
    let offsetPx = 0;
    let lastTs = null;
    let rafId = null;

    function maxOffset() {
      return Math.max(0, track.scrollWidth - viewport.clientWidth);
    }

    function pauseReel() {
      if (paused) return;
      paused = true;
      viewport.classList.add("is-manual");
      offsetPx = Math.min(offsetPx, maxOffset());
      track.style.transform = "none";
      track.style.willChange = "auto";
      viewport.scrollLeft = offsetPx;
    }

    function onVideoActivate(video, e) {
      if (e) e.stopPropagation();
      pauseReel();
      if (!video.src && video.dataset.src) {
        video.src = video.dataset.src;
        video.load();
      }
      videos.forEach((v) => {
        if (v !== video) {
          v.pause();
          v.muted = true;
        }
      });
      video.muted = false;
      video.loop = false;
      video.controls = true;
      video.play().catch(() => {});
    }

    videos.forEach((video) => {
      video.addEventListener("click", (e) => onVideoActivate(video, e));
    });

    track.querySelectorAll(".reel-item--photo img").forEach((img) => {
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        pauseReel();
        if (panelApi.openLightbox) panelApi.openLightbox(img.src, "");
      });
    });

    viewport.addEventListener("pointerdown", () => pauseReel(), { passive: true });
    viewport.addEventListener(
      "wheel",
      () => {
        pauseReel();
      },
      { passive: true }
    );

    function tick(ts) {
      if (lastTs == null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      if (!paused) {
        const max = maxOffset();
        if (max > 0) {
          offsetPx += SCROLL_PX_PER_SEC * dt;
          if (offsetPx > max) offsetPx = 0;
          track.style.transform = `translate3d(${-offsetPx}px, 0, 0)`;
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      if (!paused) offsetPx = Math.min(offsetPx, maxOffset());
    };
    window.addEventListener("resize", onResize);

    return function cleanup() {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (disconnectLazy) disconnectLazy();
      videos.forEach((v) => {
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
    };
  }

  return { mount };
})();
