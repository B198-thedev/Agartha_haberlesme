/* =========================================================
   AGARTHA LIQUID GLASS — OPTİK MOTOR & 60 FPS KONTROLCÜ
   ========================================================= */
(function () {
  "use strict";

  const root = document.documentElement;
  const ua = navigator.userAgent || "";

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isGecko = /Firefox|FxiOS/.test(ua);
  const isChromium =
    !isIOS &&
    !isGecko &&
    (/Chrome|Chromium|Edg|Android.*Chrome/.test(ua) || Boolean(window.chrome));

  const supportsCss =
    typeof CSS !== "undefined" && typeof CSS.supports === "function";
  const supportsBackdrop =
    supportsCss &&
    (CSS.supports("backdrop-filter", "blur(2px)") ||
      CSS.supports("-webkit-backdrop-filter", "blur(2px)"));
  const supportsSvgBackdrop =
    isChromium &&
    supportsBackdrop &&
    CSS.supports("backdrop-filter", "url(#lg-refract-pill) blur(8px)");

  const isLowPower = Boolean(
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
      (navigator.connection && navigator.connection.saveData)
  );

  const mqReduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  const mqReduceTrans = window.matchMedia
    ? window.matchMedia("(prefers-reduced-transparency: reduce)")
    : null;
  const mqContrastMore = window.matchMedia
    ? window.matchMedia("(prefers-contrast: more)")
    : null;
  const mqFinePointer = window.matchMedia
    ? window.matchMedia("(hover: hover) and (pointer: fine)")
    : null;

  const SURFACE_SELECTOR = [
    ".bottom-nav",
    ".top-bar",
    ".message-input-bar",
    ".chat-item",
    ".card",
    ".settings-item",
    ".announcement-banner",
    ".auth-card",
    ".modal-card",
    ".inapp-toast",
    ".update-banner",
    ".attach-menu",
    ".reaction-picker-pop",
    ".msg-bubble",
    ".btn-primary",
    ".send-btn",
    ".icon-btn",
    ".ai-subnav"
  ].join(", ");

  let svgInjected = false;
  let activeGlowEl = null;
  let activePressedEl = null;
  let moveRafId = 0;
  let pendingPointer = null;
  let navSwitchTimer = 0;
  let navObserver = null;

  function isGlassEnabled() {
    return root.classList.contains("liquid-glass");
  }

  function isMotionReduced() {
    return Boolean(
      (mqReduceMotion && mqReduceMotion.matches) ||
        root.classList.contains("anim-off")
    );
  }

  function isTransparencyReduced() {
    return Boolean(
      (mqReduceTrans && mqReduceTrans.matches) ||
        (mqContrastMore && mqContrastMore.matches)
    );
  }

  function shouldUseSvgRefract() {
    return (
      isGlassEnabled() &&
      supportsSvgBackdrop &&
      !isLowPower &&
      !isMotionReduced() &&
      !isTransparencyReduced()
    );
  }

  /**
   * Rounded-rectangle Signed Distance Field tabanlı Snell-kırılma haritası.
   * Merkez tamamen nötr (128,128,128) kalır; yalnız kenar bevel şeridi ışığı büker.
   */
  function buildDisplacementDataUrl(width, height, radius, bevel) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const img = ctx.createImageData(width, height);
    const data = img.data;
    const hw = width * 0.5;
    const hh = height * 0.5;
    const r = Math.min(radius, hw - 1, hh - 1);
    const bx = Math.max(0, hw - r);
    const by = Math.max(0, hh - r);

    for (let y = 0; y < height; y++) {
      const py = y + 0.5 - hh;
      const sy = py < 0 ? -1 : 1;
      const qy = Math.abs(py) - by;

      for (let x = 0; x < width; x++) {
        const px = x + 0.5 - hw;
        const sx = px < 0 ? -1 : 1;
        const qx = Math.abs(px) - bx;
        const idx = (y * width + x) * 4;

        let d;
        let nx = 0;
        let ny = 0;

        if (qx > 0 && qy > 0) {
          const dist = Math.hypot(qx, qy);
          d = r - dist;
          if (dist > 0.0001) {
            nx = (sx * qx) / dist;
            ny = (sy * qy) / dist;
          }
        } else {
          const dxEdge = hw - Math.abs(px);
          const dyEdge = hh - Math.abs(py);
          if (dxEdge < dyEdge) {
            d = dxEdge;
            nx = sx;
          } else {
            d = dyEdge;
            ny = sy;
          }
        }

        if (d >= 0 && d < bevel) {
          const t = 1 - d / bevel;
          const mag = Math.pow(t, 2.15);
          // Dışbükey lens kenarı: arkaplan örneklerini merkez-kenar eğrisi boyunca bük
          const disp = mag * 118;
          data[idx] = Math.max(0, Math.min(255, Math.round(128 - nx * disp)));
          data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 - ny * disp)));
          data[idx + 2] = 128;
          data[idx + 3] = 255;
        } else {
          data[idx] = 128;
          data[idx + 1] = 128;
          data[idx + 2] = 128;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(img, 0, 0);
    try {
      return canvas.toDataURL("image/png");
    } catch {
      return "";
    }
  }

  function ensureSvgFilters() {
    if (svgInjected) return Boolean(document.getElementById("lg-svg-filters"));
    svgInjected = true;
    if (!document.body) return false;

    const specs = [
      { id: "lg-refract-pill", w: 160, h: 64, r: 30, bevel: 11, scale: 14 },
      { id: "lg-refract-bar", w: 180, h: 64, r: 22, bevel: 10, scale: 10 },
      { id: "lg-refract-pop", w: 128, h: 128, r: 20, bevel: 14, scale: 12 }
    ];

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.id = "lg-svg-filters";
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText =
      "position:fixed;width:0;height:0;pointer-events:none;overflow:hidden;";

    const defs = document.createElementNS(svgNS, "defs");

    for (const spec of specs) {
      const url = buildDisplacementDataUrl(
        spec.w,
        spec.h,
        spec.r,
        spec.bevel
      );
      if (!url) continue;

      const filter = document.createElementNS(svgNS, "filter");
      filter.id = spec.id;
      filter.setAttribute("x", "0%");
      filter.setAttribute("y", "0%");
      filter.setAttribute("width", "100%");
      filter.setAttribute("height", "100%");
      filter.setAttribute("color-interpolation-filters", "sRGB");

      const feImg = document.createElementNS(svgNS, "feImage");
      feImg.setAttribute("href", url);
      feImg.setAttribute("x", "0%");
      feImg.setAttribute("y", "0%");
      feImg.setAttribute("width", "100%");
      feImg.setAttribute("height", "100%");
      feImg.setAttribute("preserveAspectRatio", "none");
      feImg.setAttribute("result", "dispMap");

      const feDisp = document.createElementNS(svgNS, "feDisplacementMap");
      feDisp.setAttribute("in", "SourceGraphic");
      feDisp.setAttribute("in2", "dispMap");
      feDisp.setAttribute("scale", String(spec.scale));
      feDisp.setAttribute("xChannelSelector", "R");
      feDisp.setAttribute("yChannelSelector", "G");

      filter.appendChild(feImg);
      filter.appendChild(feDisp);
      defs.appendChild(filter);
    }

    if (!defs.childElementCount) return false;
    svg.appendChild(defs);
    document.body.appendChild(svg);
    return true;
  }

  function clearGlow() {
    if (activeGlowEl) {
      activeGlowEl.style.setProperty("--lg-glow", "0");
      activeGlowEl = null;
    }
  }

  function clearPressed() {
    if (activePressedEl) {
      activePressedEl.classList.remove("lg-pressed");
      activePressedEl = null;
    }
  }

  function setSpecularPoint(el, clientX, clientY, glowValue) {
    if (!el || typeof el.getBoundingClientRect !== "function") return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const px = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const py = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    el.style.setProperty("--lg-x", px.toFixed(1) + "%");
    el.style.setProperty("--lg-y", py.toFixed(1) + "%");
    if (glowValue !== undefined) {
      el.style.setProperty("--lg-glow", String(glowValue));
    }
  }

  function onPointerMove(e) {
    if (!isGlassEnabled() || isLowPower || isMotionReduced()) return;
    if (mqFinePointer && !mqFinePointer.matches) return;
    if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;

    pendingPointer = {
      target: e.target,
      x: e.clientX,
      y: e.clientY
    };

    if (moveRafId) return;
    moveRafId = window.requestAnimationFrame(() => {
      moveRafId = 0;
      const pt = pendingPointer;
      pendingPointer = null;
      if (!pt || !isGlassEnabled()) {
        clearGlow();
        return;
      }

      const rawTarget = pt.target;
      const surface =
        rawTarget && typeof rawTarget.closest === "function"
          ? rawTarget.closest(SURFACE_SELECTOR)
          : null;

      if (activeGlowEl && activeGlowEl !== surface) {
        activeGlowEl.style.setProperty("--lg-glow", "0");
      }

      if (surface && !surface.closest(".modal.hidden")) {
        setSpecularPoint(surface, pt.x, pt.y, "1");
        activeGlowEl = surface;
      } else {
        activeGlowEl = null;
      }
    });
  }

  function onPointerDown(e) {
    if (!isGlassEnabled() || isMotionReduced()) return;
    const rawTarget = e.target;
    const surface =
      rawTarget && typeof rawTarget.closest === "function"
        ? rawTarget.closest(SURFACE_SELECTOR)
        : null;
    if (!surface) return;

    clearPressed();
    setSpecularPoint(surface, e.clientX, e.clientY);
    surface.classList.add("lg-pressed");
    activePressedEl = surface;
  }

  function onPointerRelease() {
    clearPressed();
  }

  function onPointerOut(e) {
    if (!e.relatedTarget) {
      clearGlow();
    }
  }

  function triggerNavLensStretch() {
    if (!isGlassEnabled() || isMotionReduced()) return;
    const indicator = document.querySelector("#main-view .bottom-nav .nav-indicator");
    if (!indicator) return;
    indicator.classList.remove("is-switching");
    // Tek karede yeniden tetikle
    void indicator.offsetWidth;
    indicator.classList.add("is-switching");
    if (navSwitchTimer) clearTimeout(navSwitchTimer);
    navSwitchTimer = window.setTimeout(() => {
      indicator.classList.remove("is-switching");
      navSwitchTimer = 0;
    }, 360);
  }

  function setupNavObserver() {
    if (navObserver || typeof MutationObserver === "undefined") return;
    const bottomNav = document.querySelector("#main-view .bottom-nav");
    if (!bottomNav) return;

    navObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          m.type === "attributes" &&
          m.target &&
          m.target.classList &&
          m.target.classList.contains("nav-btn") &&
          m.target.classList.contains("active")
        ) {
          triggerNavLensStretch();
          break;
        }
      }
    });

    navObserver.observe(bottomNav, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  let isSyncing = false;

  function setRootClass(cls, enabled) {
    const has = root.classList.contains(cls);
    if (enabled && !has) {
      root.classList.add(cls);
    } else if (!enabled && has) {
      root.classList.remove(cls);
    }
  }

  function syncState() {
    if (isSyncing) return;
    isSyncing = true;
    try {
      setRootClass("lg-low-power", isLowPower);

      if (!isGlassEnabled()) {
        setRootClass("lg-svg-refract", false);
        clearGlow();
        clearPressed();
        return;
      }

      if (shouldUseSvgRefract()) {
        const ok = ensureSvgFilters();
        setRootClass("lg-svg-refract", ok);
      } else {
        setRootClass("lg-svg-refract", false);
      }

      setupNavObserver();
    } finally {
      isSyncing = false;
    }
  }

  function init() {
    syncState();

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerup", onPointerRelease, { passive: true });
    document.addEventListener("pointercancel", onPointerRelease, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("blur", () => {
      clearGlow();
      clearPressed();
    });

    if (typeof MutationObserver !== "undefined") {
      const rootObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.attributeName === "class") {
            syncState();
            break;
          }
        }
      });
      rootObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
    }

    [mqReduceMotion, mqReduceTrans, mqContrastMore].forEach((mq) => {
      if (mq && typeof mq.addEventListener === "function") {
        mq.addEventListener("change", syncState);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.AgarthaLiquidGlass = {
    sync: syncState,
    capabilities: {
      isIOS,
      isGecko,
      isChromium,
      supportsBackdrop,
      supportsSvgBackdrop,
      isLowPower
    }
  };
})();
