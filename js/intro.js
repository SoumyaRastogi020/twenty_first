/**
 * Intro sequence: preload flash photos, 200ms slideshow, grid, then disperse into map.
 */
const IntroFlow = (function () {
  const FLASH_MS = 200;
  const GRID_HOLD_MS = 1100;
  const FLY_MS = 2000;
  const FLY_MS_MOBILE = 1400;

  function preloadImages(urls) {
    return Promise.all(
      urls.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.decoding = "async";
            img.onload = () => resolve({ src, ok: true });
            img.onerror = () => resolve({ src, ok: false });
            img.src = src;
          })
      )
    );
  }

  function decodeCardImages(cards) {
    return Promise.all(
      cards.map(({ el }) => {
        const img = el.querySelector("img");
        if (!img) return Promise.resolve();
        const done = () =>
          img.decode ? img.decode().catch(() => {}) : Promise.resolve();
        if (img.complete && img.naturalWidth > 0) return done();
        return new Promise((resolve) => {
          img.onload = () => done().then(resolve);
          img.onerror = resolve;
        });
      })
    );
  }

  function runFlashSequence(urls, flashFrameEl, flashImgEl, loadingEl, onDone) {
    const valid = urls.filter(Boolean);
    if (!valid.length) {
      onDone([]);
      return;
    }

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    loadingEl.hidden = false;
    flashFrameEl.hidden = true;

    preloadImages(valid).then((results) => {
      const loaded = results.filter((r) => r.ok).map((r) => r.src);
      loadingEl.hidden = true;
      flashFrameEl.hidden = false;
      flashFrameEl.style.setProperty("--flash-ms", FLASH_MS + "ms");

      if (!loaded.length) {
        onDone([]);
        return;
      }

      let index = 0;
      let frameStart = null;

      function showPhoto(i) {
        flashImgEl.src = loaded[i];
        flashImgEl.classList.remove("is-zooming");
        if (!reducedMotion) {
          void flashImgEl.offsetWidth;
          flashImgEl.classList.add("is-zooming");
        }
      }

      function showFrame(now) {
        if (frameStart === null) {
          frameStart = now;
          showPhoto(index);
        }

        const elapsed = now - frameStart;
        if (elapsed >= FLASH_MS) {
          index += 1;
          frameStart = now;
          if (index >= loaded.length) {
            onDone(loaded);
            return;
          }
          showPhoto(index);
        }
        requestAnimationFrame(showFrame);
      }

      requestAnimationFrame(showFrame);
    });
  }

  /**
   * Show all photos in a grid, then fly each one toward map pin positions (visible shrink).
   */
  function runDisperse(photoUrls, container, getTargetForIndex, onComplete) {
    container.innerHTML = "";
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const urls = photoUrls.filter(Boolean);
    if (!urls.length) {
      onComplete();
      return;
    }

    const backdrop = document.createElement("div");
    backdrop.className = "intro-grid-backdrop";
    container.appendChild(backdrop);

    const grid = document.createElement("div");
    grid.className = "intro-photo-grid";
    grid.setAttribute("aria-hidden", "true");
    container.appendChild(grid);

    const cards = urls.map((src, i) => {
      const el = document.createElement("div");
      el.className = "polaroid polaroid--in-grid";
      const img = document.createElement("img");
      img.decoding = "async";
      img.src = src;
      img.alt = "";
      el.appendChild(img);
      grid.appendChild(el);
      return { el, i };
    });

    if (reduced) {
      setTimeout(() => {
        container.innerHTML = "";
        onComplete();
      }, 400);
      return;
    }

    const flyMs =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 899px)").matches
        ? FLY_MS_MOBILE
        : FLY_MS;

    function startFlyPhase() {
      backdrop.classList.add("is-clear");

      const viewportCx = window.innerWidth / 2;
      const viewportCy = window.innerHeight / 2;

      const snapshots = cards.map(({ el }) => {
        const rect = el.getBoundingClientRect();
        return {
          w: rect.width,
          h: rect.height,
          tx: rect.left + rect.width / 2 - viewportCx,
          ty: rect.top + rect.height / 2 - viewportCy,
        };
      });

      grid.remove();

      cards.forEach(({ el, i }, idx) => {
        const snap = snapshots[idx];
        el.classList.remove("polaroid--in-grid");
        el.classList.add("polaroid--free");
        el.style.width = snap.w + "px";
        el.style.height = snap.h + "px";
        el.style.transform = `translate(calc(-50% + ${snap.tx}px), calc(-50% + ${snap.ty}px)) rotate(0deg) scale(1)`;
        el.style.opacity = "1";
        container.appendChild(el);
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cards.forEach(({ el, i }, idx) => {
            const target = getTargetForIndex
              ? getTargetForIndex(i)
              : { tx: 0, ty: 0 };
            const rot = (Math.random() - 0.5) * 20;
            el.style.transitionDelay = idx * 35 + "ms";
            el.classList.add("is-flying");
            el.style.transform = `translate(calc(-50% + ${target.tx}px), calc(-50% + ${target.ty}px)) rotate(${rot}deg) scale(0.06)`;
            el.style.opacity = "0.35";
          });
        });
      });
    }

    setTimeout(() => {
      decodeCardImages(cards).then(startFlyPhase);
    }, GRID_HOLD_MS);

    setTimeout(() => {
      container.innerHTML = "";
      onComplete();
    }, GRID_HOLD_MS + flyMs + cards.length * 35);
  }

  return {
    FLASH_MS,
    GRID_HOLD_MS,
    FLY_MS,
    runFlashSequence,
    runDisperse,
  };
})();
