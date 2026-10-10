/**
 * Location detail panel (bottom sheet / side panel) and lightbox.
 */
const LocationPanel = (function () {
  let els = {};
  let onOpenLocation = null;
  let onClosePanel = null;
  let dragState = null;
  let reelCleanup = null;

  function init(options) {
    onOpenLocation = options.onFirstOpen || null;
    onClosePanel = options.onClose || null;
    els = {
      root: document.getElementById("location-panel"),
      backdrop: document.getElementById("panel-backdrop"),
      sheet: document.getElementById("panel-sheet"),
      title: document.getElementById("panel-title"),
      body: document.getElementById("panel-body"),
      close: document.getElementById("panel-close"),
      handle: document.getElementById("panel-handle"),
      lightbox: document.getElementById("lightbox"),
      lightboxImg: document.getElementById("lightbox-img"),
      lightboxCaption: document.getElementById("lightbox-caption"),
      lightboxClose: document.getElementById("lightbox-close"),
    };

    els.close.addEventListener("click", close);
    els.backdrop.addEventListener("click", close);
    els.lightboxClose.addEventListener("click", closeLightbox);
    els.lightbox.addEventListener("click", (e) => {
      if (e.target === els.lightbox) closeLightbox();
    });

    setupSwipe();
  }

  function setupSwipe() {
    const sheet = els.sheet;
    const start = (y) => {
      dragState = { startY: y, currentY: y };
    };

    sheet.addEventListener(
      "pointerdown",
      (e) => {
        if (window.matchMedia("(min-width: 900px)").matches) return;
        if (e.target.closest(".reel-viewport")) return;
        if (e.target.closest(".panel-body") && sheet.scrollTop > 0) return;
        start(e.clientY);
        sheet.setPointerCapture(e.pointerId);
      },
      { passive: true }
    );

    sheet.addEventListener("pointermove", (e) => {
      if (!dragState) return;
      dragState.currentY = e.clientY;
      const dy = Math.max(0, dragState.currentY - dragState.startY);
      sheet.style.transform = `translateY(${dy}px)`;
    });

    sheet.addEventListener("pointerup", (e) => {
      if (!dragState) return;
      const dy = dragState.currentY - dragState.startY;
      dragState = null;
      sheet.style.transform = "";
      if (dy > 80) close();
    });

    sheet.addEventListener("pointercancel", () => {
      dragState = null;
      sheet.style.transform = "";
    });
  }

  function renderPhotoGroup(photos) {
    const wrap = document.createElement("div");
    wrap.className = "content-block content-block--photos";
    if (photos.length === 1) {
      wrap.appendChild(renderBlock(photos[0]));
      return wrap;
    }
    const strip = document.createElement("div");
    strip.className = "photo-strip";
    photos.forEach((block) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "photo-thumb photo-thumb--strip";
      const img = document.createElement("img");
      img.loading = "lazy";
      img.alt = block.caption || "Photo";
      img.src = block.src;
      img.onerror = () => {
        btn.classList.add("is-broken");
        btn.textContent = "Soon";
        img.remove();
      };
      btn.appendChild(img);
      btn.addEventListener("click", () => openLightbox(block.src, block.caption));
      strip.appendChild(btn);
    });
    wrap.appendChild(strip);
    const cap = photos.find((p) => p.caption);
    if (cap && cap.caption) {
      const p = document.createElement("p");
      p.className = "photo-caption";
      p.textContent = cap.caption;
      wrap.appendChild(p);
    }
    return wrap;
  }

  function renderBlock(block) {
    const wrap = document.createElement("div");
    wrap.className = "content-block content-block--" + block.type;

    if (block.type === "story") {
      wrap.innerHTML = `
        <p class="story-date">${escapeHtml(block.date || "")}</p>
        <h3 class="story-title">${escapeHtml(block.title || "")}</h3>
        <p class="story-text">${escapeHtml(block.text || "")}</p>`;
      return wrap;
    }

    if (block.type === "snippet") {
      wrap.textContent = block.text || "";
      return wrap;
    }

    if (block.type === "photo") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "photo-thumb";
      const img = document.createElement("img");
      img.loading = "lazy";
      img.alt = block.caption || "Photo";
      img.src = block.src;
      img.onerror = () => {
        btn.classList.add("is-broken");
        btn.textContent = "Photo coming soon";
        img.remove();
      };
      btn.appendChild(img);
      btn.addEventListener("click", () => openLightbox(block.src, block.caption));
      wrap.appendChild(btn);
      if (block.caption) {
        const cap = document.createElement("p");
        cap.className = "photo-caption";
        cap.textContent = block.caption;
        wrap.appendChild(cap);
      }
      return wrap;
    }

    if (block.type === "video") {
      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      if (block.poster) video.poster = block.poster;
      video.src = block.src;
      video.onerror = () => {
        wrap.innerHTML = '<p class="media-missing">Video coming soon</p>';
      };
      wrap.appendChild(video);
      return wrap;
    }

    return wrap;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function open(location, isDiscovered) {
    if (reelCleanup) {
      reelCleanup();
      reelCleanup = null;
    }

    els.title.textContent = location.name;
    els.body.innerHTML = "";
    const isReel = location.presentation === "reel";

    els.root.classList.toggle("is-reel", isReel);
    els.sheet.classList.toggle("is-reel-sheet", isReel);

    if (isReel) {
      reelCleanup = ReelPanel.mount(location, els.body, {
        openLightbox: openLightbox,
      });
    } else {
      const blocks = location.content || [];
      let i = 0;
      while (i < blocks.length) {
        if (blocks[i].type === "photo") {
          const group = [];
          while (i < blocks.length && blocks[i].type === "photo") {
            group.push(blocks[i]);
            i += 1;
          }
          els.body.appendChild(renderPhotoGroup(group));
          continue;
        }
        els.body.appendChild(renderBlock(blocks[i]));
        i += 1;
      }
    }

    els.root.hidden = false;
    els.root.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => els.root.classList.add("is-open"));

    if (!isDiscovered && onOpenLocation) {
      onOpenLocation(location.id);
    }
  }

  function close() {
    els.root.classList.remove("is-open");
    setTimeout(() => {
      if (reelCleanup) {
        reelCleanup();
        reelCleanup = null;
      }
      els.root.classList.remove("is-reel");
      els.sheet.classList.remove("is-reel-sheet");
      els.root.hidden = true;
      els.root.setAttribute("aria-hidden", "true");
      if (onClosePanel) onClosePanel();
    }, 380);
  }

  function openLightbox(src, caption) {
    els.lightboxImg.src = src;
    els.lightboxCaption.textContent = caption || "";
    els.lightbox.hidden = false;
  }

  function closeLightbox() {
    els.lightbox.hidden = true;
    els.lightboxImg.src = "";
  }

  function isOpen() {
    return els.root && !els.root.hidden;
  }

  return { init, open, close, isOpen };
})();
