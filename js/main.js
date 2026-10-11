/**
 * App flow: gate → intro → map. Progress, storage, celebration.
 */
(function () {
  const state = {
    discovered: new Set(),
    introComplete: false,
  };

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  const SCREEN_FADE_MS = 700;

  function activateScreen(el) {
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("is-active"));
  }

  function deactivateScreen(el, done) {
    if (!el || el.hidden) {
      if (done) done();
      return;
    }
    el.classList.remove("is-active");
    setTimeout(() => {
      el.hidden = true;
      if (done) done();
    }, SCREEN_FADE_MS);
  }

  /** Fade out `from`, fade in `to` (overlap for a softer handoff). */
  function crossfadeScreen(from, to, onMid) {
    if (to) activateScreen(to);
    if (from && !from.hidden) from.classList.remove("is-active");
    setTimeout(() => {
      if (from) from.hidden = true;
      if (onMid) onMid();
    }, Math.round(SCREEN_FADE_MS * 0.45));
  }

  function progressSessionActive() {
    return !CONFIG.GATE_ENABLED || gateSessionOk();
  }

  function loadDiscovered() {
    if (!progressSessionActive()) return;
    try {
      const raw = sessionStorage.getItem(CONFIG.SESSION_DISCOVERED_KEY);
      if (raw) {
        JSON.parse(raw).forEach((id) => state.discovered.add(id));
      }
    } catch (_) {
      /* private mode / blocked storage */
    }
  }

  function saveDiscovered() {
    if (!progressSessionActive()) return;
    try {
      sessionStorage.setItem(
        CONFIG.SESSION_DISCOVERED_KEY,
        JSON.stringify([...state.discovered])
      );
    } catch (_) {}
  }

  /** Fresh visit after the gate — progress starts at 0. */
  function resetSessionProgress() {
    state.discovered = new Set();
    try {
      sessionStorage.removeItem(CONFIG.SESSION_DISCOVERED_KEY);
    } catch (_) {}
    MapController.setDiscovered(state.discovered);
    updateProgress();
  }

  function updateProgress() {
    const total = LOCATIONS.length;
    const count = state.discovered.size;
    $("progress-count").textContent = String(count);
    const pct = total ? Math.round((count / total) * 100) : 0;
    $("progress-pct").textContent = String(pct);
    $("progress-fill").style.width = pct + "%";
  }

  function markDiscovered(id) {
    if (state.discovered.has(id)) return;
    state.discovered.add(id);
    saveDiscovered();
    MapController.setDiscovered(state.discovered);
    updateProgress();

    const total = LOCATIONS.length;
    if (
      state.introComplete &&
      total > 0 &&
      state.discovered.size >= total &&
      $("final-screen").dataset.shown !== "1"
    ) {
      setTimeout(showCelebration, 700);
    }
  }

  /* --- Gate (soft only — hash is in source; not real security) --- */
  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function gateSessionOk() {
    try {
      return sessionStorage.getItem(CONFIG.SESSION_GATE_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function setGateSessionOk() {
    try {
      sessionStorage.setItem(CONFIG.SESSION_GATE_KEY, "1");
    } catch (_) {}
  }

  async function initGate() {
    const screen = $("gate-screen");
    if (!CONFIG.GATE_ENABLED || gateSessionOk()) {
      screen.hidden = true;
      showIntroTap();
      return;
    }

    activateScreen(screen);
    $("gate-prompt").textContent = CONFIG.GATE_PROMPT;
    const form = $("gate-form");
    const input = $("gate-input");
    const err = $("gate-error");
    const card = screen.querySelector(".gate-card");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      err.hidden = true;
      const guess = (input.value || "").trim().toLowerCase();
      const hash = await sha256Hex(guess);
      if (hash === CONFIG.GATE_PASSWORD_SHA256) {
        resetSessionProgress();
        setGateSessionOk();
        crossfadeScreen(screen, $("intro-tap-screen"));
      } else {
        err.hidden = false;
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
      }
    });
  }

  function showIntroTap() {
    activateScreen($("intro-tap-screen"));
  }

  function bindIntro() {
    const tapScreen = $("intro-tap-screen");
    const msgScreen = $("intro-message-screen");
    const flashScreen = $("intro-flash-screen");
    const disperseScreen = $("disperse-screen");

    $("intro-message-text").textContent = CONFIG.INTRO_MESSAGE;

    const btnContinue = $("btn-continue");

    $("btn-tap-begin").addEventListener("click", () => {
      const msg = $("intro-message-text");
      msg.classList.remove("is-visible");
      btnContinue.classList.remove("is-visible");
      btnContinue.setAttribute("aria-hidden", "true");
      btnContinue.tabIndex = -1;

      crossfadeScreen(tapScreen, msgScreen, () => {
        msg.classList.add("is-visible");
        setTimeout(() => {
          btnContinue.classList.add("is-visible");
          btnContinue.setAttribute("aria-hidden", "false");
          btnContinue.tabIndex = 0;
        }, 3500);
      });
    });

    btnContinue.addEventListener("click", startFlash);
    $("skip-intro").addEventListener("click", () => {
      skipToMap();
    });

    function startFlash() {
      crossfadeScreen(msgScreen, flashScreen, () => {
        runFlashAfterFade();
      });
    }

    function runFlashAfterFade() {
      IntroFlow.runFlashSequence(
        CONFIG.INTRO_PHOTOS,
        $("flash-frame"),
        $("flash-image"),
        $("flash-loading"),
        (loaded) => {
          $("app").hidden = false;
          $("app").classList.add("is-intro-reveal");
          MapController.prepareIntroView();
          activateScreen(disperseScreen);
          IntroFlow.runDisperse(
            loaded,
            $("disperse-cards"),
            (i) => MapController.getDisperseTargetForIndex(i),
            () => {
              deactivateScreen(disperseScreen);
              $("app").classList.remove("is-intro-reveal");
              $("flash-frame").hidden = true;
              flashScreen.hidden = true;
              flashScreen.classList.remove("is-active");
              MapController.flyToFullTrip();
              finishIntro({ animateView: false });
            }
          );
          $("flash-frame").hidden = true;
          deactivateScreen(flashScreen);
        }
      );
    }

    /** @param {{ animateView?: boolean }} opts — animateView false if flyToFullTrip already ran */
    function finishIntro(opts) {
      const animateView = !opts || opts.animateView !== false;
      state.introComplete = true;
      hideAllOverlayScreens();
      $("app").hidden = false;
      MapController.onIntroComplete(animateView);
      updateProgress();
    }

    function hideAllOverlayScreens() {
      [
        "gate-screen",
        "intro-tap-screen",
        "intro-message-screen",
        "intro-flash-screen",
        "disperse-screen",
      ].forEach((id) => {
        const el = $(id);
        if (!el) return;
        el.classList.remove("is-active");
        el.hidden = true;
      });
      const disperseCards = $("disperse-cards");
      if (disperseCards) disperseCards.innerHTML = "";
      $("flash-frame").hidden = true;
      $("flash-loading").hidden = true;
      $("app").classList.remove("is-intro-reveal");
    }

    function skipToMap() {
      hideAllOverlayScreens();
      $("app").hidden = false;
      /* Leaflet needs a laid-out #app before ensureMap / invalidateSize */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          finishIntro({ animateView: true });
        });
      });
    }

    window.__skipToMap = skipToMap;
  }

  function showCelebration() {
    if ($("final-screen").dataset.shown === "1") return;
    $("final-screen").dataset.shown = "1";
    const msg = CONFIG.FINAL_MESSAGE;
    $("final-line-headline").textContent = msg.headline;
    $("final-line-birthday").textContent = msg.birthday;
    $("final-line-closing").textContent = msg.closing;
    if (LocationPanel.isOpen && LocationPanel.isOpen()) {
      LocationPanel.close();
    }
    const screen = $("final-screen");
    screen.hidden = false;
    screen.classList.remove("is-active");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => screen.classList.add("is-active"));
    });
    runConfetti();
  }

  function runConfetti() {
    const canvas = $("confetti-canvas");
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: 4 + Math.random() * 6,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 4,
      color: ["#ff6b6b", "#7ec4a8", "#ffd93d", "#ff9a8b"][
        Math.floor(Math.random() * 4)
      ],
    }));

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.r, p.r * 0.6);
      });
      frame += 1;
      if (frame < 240) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
  }

  function bindFinal() {
    $("btn-final-close").addEventListener("click", () => {
      const screen = $("final-screen");
      screen.classList.remove("is-active");
      setTimeout(() => {
        screen.hidden = true;
      }, SCREEN_FADE_MS);
    });
  }

  function init() {
    els.app = $("app");
    loadDiscovered();

    LocationPanel.init({
      onFirstOpen: (id) => markDiscovered(id),
      onClose: () => MapController.clearFocus(),
    });

    MapController.init({
      onPinActivate: (loc) => {
        LocationPanel.open(loc, state.discovered.has(loc.id));
      },
    });
    MapController.setDiscovered(state.discovered);

    updateProgress();

    bindIntro();
    bindFinal();
    initGate();

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
