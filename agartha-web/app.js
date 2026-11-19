// Service Worker (PWA) kaydı — sadece http/https üzerinde çalışır
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

const SESSION_KEY = "agartha_session_v1";
const THEME_STORAGE_KEY = "agartha_theme_v1";

const APP_THEMES = {
  midnight: {
    name: "Gece Mavisi",
    bg: "#0b1120",
    surface: "#111827",
    surface2: "#1e293b",
    border: "#263348",
    text: "#f8fafc",
    muted: "#94a3b8",
    navText: "#acbbce",
    accent: "#38bdf8",
    accent2: "#6366f1",
    onAccent: "#ffffff",
    bubbleMe: "#1d4ed8",
    bubbleOther: "#1e293b"
  },
  purple: {
    name: "Siber Mor",
    bg: "#120826",
    surface: "#1b0d38",
    surface2: "#2a1654",
    border: "#3f2378",
    text: "#faf5ff",
    muted: "#c4b5fd",
    navText: "#d8b4fe",
    accent: "#c084fc",
    accent2: "#7c3aed",
    onAccent: "#ffffff",
    bubbleMe: "#7c3aed",
    bubbleOther: "#2a1654"
  },
  neonLime: {
    name: "Cırtlak Yeşil",
    bg: "#061309",
    surface: "#0b1f10",
    surface2: "#13331b",
    border: "#1f542c",
    text: "#f0fdf4",
    muted: "#86efac",
    navText: "#bbf7d0",
    accent: "#39ff14",
    accent2: "#10b981",
    onAccent: "#052e16",
    bubbleMe: "#15803d",
    bubbleOther: "#13331b"
  },
  crimson: {
    name: "Kızıl Alev",
    bg: "#18080c",
    surface: "#250c12",
    surface2: "#3b131d",
    border: "#5c1d2d",
    text: "#fff1f2",
    muted: "#fda4af",
    navText: "#fecdd3",
    accent: "#fb7185",
    accent2: "#e11d48",
    onAccent: "#ffffff",
    bubbleMe: "#be123c",
    bubbleOther: "#3b131d"
  },
  magenta: {
    name: "Neon Pembe",
    bg: "#190717",
    surface: "#280b25",
    surface2: "#3f133b",
    border: "#631e5c",
    text: "#fdf2f8",
    muted: "#f9a8d4",
    navText: "#fbcfe8",
    accent: "#f472b6",
    accent2: "#db2777",
    onAccent: "#ffffff",
    bubbleMe: "#db2777",
    bubbleOther: "#3f133b"
  },
  sunset: {
    name: "Turuncu Alev",
    bg: "#180e06",
    surface: "#26160a",
    surface2: "#3c2210",
    border: "#5e3619",
    text: "#fff7ed",
    muted: "#fdba74",
    navText: "#fed7aa",
    accent: "#fb923c",
    accent2: "#ea580c",
    onAccent: "#ffffff",
    bubbleMe: "#c2410c",
    bubbleOther: "#3c2210"
  },
  gold: {
    name: "Altın Sarı",
    bg: "#151105",
    surface: "#221b08",
    surface2: "#362b0d",
    border: "#544314",
    text: "#fefce8",
    muted: "#fde047",
    navText: "#fef08a",
    accent: "#facc15",
    accent2: "#d97706",
    onAccent: "#1c1917",
    bubbleMe: "#a16207",
    bubbleOther: "#362b0d"
  },
  ocean: {
    name: "Turkuaz",
    bg: "#051618",
    surface: "#092326",
    surface2: "#10383d",
    border: "#19565e",
    text: "#f0fdfa",
    muted: "#5eead4",
    navText: "#99f6e4",
    accent: "#2dd4bf",
    accent2: "#0891b2",
    onAccent: "#042f2e",
    bubbleMe: "#0f766e",
    bubbleOther: "#10383d"
  },
  amoled: {
    name: "Saf Siyah (AMOLED)",
    bg: "#000000",
    surface: "#0a0a0a",
    surface2: "#171717",
    border: "#262626",
    text: "#fafafa",
    muted: "#a3a3a3",
    navText: "#d4d4d4",
    accent: "#38bdf8",
    accent2: "#818cf8",
    onAccent: "#ffffff",
    bubbleMe: "#2563eb",
    bubbleOther: "#171717"
  },
  cyberpunk: {
    name: "Cyberpunk 2077",
    bg: "#0d0b1a",
    surface: "#17132b",
    surface2: "#241d42",
    border: "#3e2e6e",
    text: "#fefce8",
    muted: "#00f0ff",
    navText: "#fde047",
    accent: "#fcee09",
    accent2: "#00f0ff",
    onAccent: "#090714",
    bubbleMe: "#0284c7",
    bubbleOther: "#241d42"
  },
  synthwave: {
    name: "Synthwave 80s",
    bg: "#140624",
    surface: "#210a3b",
    surface2: "#331159",
    border: "#5a1e96",
    text: "#fdf4ff",
    muted: "#ff7eb6",
    navText: "#f5d0fe",
    accent: "#ff2a85",
    accent2: "#7b2cbf",
    onAccent: "#ffffff",
    bubbleMe: "#db2777",
    bubbleOther: "#331159"
  },
  radioactive: {
    name: "Radyoaktif",
    bg: "#030c03",
    surface: "#081708",
    surface2: "#102b10",
    border: "#1f521f",
    text: "#ecfccb",
    muted: "#a3e635",
    navText: "#bef264",
    accent: "#76ff03",
    accent2: "#00e676",
    onAccent: "#052e16",
    bubbleMe: "#4d7c0f",
    bubbleOther: "#102b10"
  },
  electricCyan: {
    name: "Elektrik Cyan",
    bg: "#03131c",
    surface: "#061f2e",
    surface2: "#0b324a",
    border: "#135278",
    text: "#ecfeff",
    muted: "#67e8f9",
    navText: "#a5f3fc",
    accent: "#00f5ff",
    accent2: "#0066ff",
    onAccent: "#021824",
    bubbleMe: "#0284c7",
    bubbleOther: "#0b324a"
  },
  lava: {
    name: "Lav Patlaması",
    bg: "#190502",
    surface: "#290904",
    surface2: "#421008",
    border: "#6e1c0e",
    text: "#fff7ed",
    muted: "#ffab91",
    navText: "#fed7aa",
    accent: "#ff3d00",
    accent2: "#ff9100",
    onAccent: "#ffffff",
    bubbleMe: "#ea580c",
    bubbleOther: "#421008"
  },
  sakura: {
    name: "Sakura Neon",
    bg: "#210c19",
    surface: "#301225",
    surface2: "#471c37",
    border: "#702c57",
    text: "#fff1f2",
    muted: "#f9a8d4",
    navText: "#fbcfe8",
    accent: "#ff66b2",
    accent2: "#ff99cc",
    onAccent: "#2b091d",
    bubbleMe: "#be185d",
    bubbleOther: "#471c37"
  },
  matrix: {
    name: "Matrix Terminal",
    bg: "#000800",
    surface: "#031203",
    surface2: "#072207",
    border: "#0f450f",
    text: "#b9fbc0",
    muted: "#4ade80",
    navText: "#86efac",
    accent: "#00ff41",
    accent2: "#008f11",
    onAccent: "#001400",
    bubbleMe: "#166534",
    bubbleOther: "#072207"
  },
  rainbow: {
    name: "RGB Parti Modu",
    bg: "#090616",
    surface: "#120c29",
    surface2: "#1e1542",
    border: "#3b2a7a",
    text: "#ffffff",
    muted: "#f472b6",
    navText: "#e879f9",
    accent: "#ff0080",
    accent2: "#00dfd8",
    onAccent: "#ffffff",
    bubbleMe: "#9333ea",
    bubbleOther: "#1e1542"
  },
  light: {
    name: "Aydınlık",
    bg: "#f1f5f9",
    surface: "#ffffff",
    surface2: "#e2e8f0",
    border: "#cbd5e1",
    text: "#0f172a",
    muted: "#475569",
    navText: "#475569",
    accent: "#2563eb",
    accent2: "#4f46e5",
    onAccent: "#ffffff",
    bubbleMe: "#2563eb",
    bubbleOther: "#e2e8f0"
  }
};

const state = {
  db: null,
  user: null, // { id, name, isAdmin }
  activeRoom: null, // { id, title, isGroup, otherId }
  chatRef: null,
  typingRef: null,
  invitesRef: null,
  typingTimeout: null,
  usersCache: {},
  startedAt: Date.now(),
  notifiedMsgKeys: new Set(),
  unreadRooms: new Set(),
  dmListeners: {},
  presenceSetup: false,
  driveConfig: { url: "", secret: "" },
  pendingRegAvatar: "",
  pendingPhotoFile: null,
  pendingPhotoUrl: "",
  mediaRecorder: null,
  audioStream: null,
  audioChunks: [],
  recordingTimer: null,
  recordingSeconds: 0,
  pendingAudioBlob: null,
  pendingAudioMime: "",
  pendingAudioPreviewUrl: "",
  pendingAudioData: "",
  liveLocWatchId: null,
  liveLocRoomId: null,
  liveLocMsgKey: null,
  lastLocUpdateAt: 0,
  preloadedChats: {}
};

// DOM Elemanları
const loadingView = document.getElementById("loading-view");
const loadingStatus = document.getElementById("loading-status");
const authView = document.getElementById("auth-view");
const mainView = document.getElementById("main-view");
const chatView = document.getElementById("chat-view");

const configWarning = document.getElementById("config-warning");
const loginForm = document.getElementById("login-form");
const loginUsername = document.getElementById("login-username");
const loginCode = document.getElementById("login-code");
const loginError = document.getElementById("login-error");

const registerForm = document.getElementById("register-form");
const regAvatarPreview = document.getElementById("reg-avatar-preview");
const regAvatarInput = document.getElementById("reg-avatar-input");
const regAvatarBtn = document.getElementById("reg-avatar-btn");
const regUsername = document.getElementById("reg-username");
const regNickname = document.getElementById("reg-nickname");
const regPassword = document.getElementById("reg-password");
const regInvite = document.getElementById("reg-invite");
const registerError = document.getElementById("register-error");

const profileTrigger = document.getElementById("profile-trigger");
const openSettingsBtn = document.getElementById("open-settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const openProfileBtn = document.getElementById("open-profile-btn");
const openCustomizeBtn = document.getElementById("open-customize-btn");
const customizeModal = document.getElementById("customize-modal");
const closeCustomizeBtn = document.getElementById("close-customize-btn");
const headerAvatar = document.getElementById("header-avatar");
const currentUserLabel = document.getElementById("current-user-label");
const notifyBtn = document.getElementById("notify-btn");
const notifyStatusLabel = document.getElementById("notify-status-label");
const openAdminBtn = document.getElementById("open-admin-btn");
const logoutBtn = document.getElementById("logout-btn");
const themeGrid = document.getElementById("theme-grid");
const customThemeInput = document.getElementById("custom-theme-input");
const customBgInput = document.getElementById("custom-bg-input");
const applyCustomThemeBtn = document.getElementById("apply-custom-theme-btn");
const randomThemeBtn = document.getElementById("random-theme-btn");

const openMainGroupBtn = document.getElementById("open-main-group-btn");
const mainGroupBadge = document.getElementById("main-group-badge");
const mainGroupPreview = document.getElementById("main-group-preview");
const mainGroupTime = document.getElementById("main-group-time");
const contactsList = document.getElementById("contacts-list");

const placeForm = document.getElementById("place-form");
const placeNameInput = document.getElementById("place-name");
const placeAreaInput = document.getElementById("place-area");
const placeCategoryInput = document.getElementById("place-category");
const placeNoteInput = document.getElementById("place-note");
const placesList = document.getElementById("places-list");
const aiList = document.getElementById("ai-list");

const chatBackBtn = document.getElementById("chat-back-btn");
const chatBgLayer = document.getElementById("chat-bg-layer");
const chatRoomHeaderInfo = document.getElementById("chat-room-header-info");
const chatRoomAvatar = document.getElementById("chat-room-avatar");
const chatRoomTitle = document.getElementById("chat-room-title");
const chatRoomSubtitle = document.getElementById("chat-room-subtitle");
const quickPlaceBtn = document.getElementById("quick-place-btn");
const deleteChatBtn = document.getElementById("delete-chat-btn");
const messagesContainer = document.getElementById("messages-container");
const typingIndicator = document.getElementById("typing-indicator");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const sendBtn = messageForm.querySelector(".send-btn");
const photoInput = document.getElementById("photo-input");
const photoBtn = document.getElementById("photo-btn");
const photoPreviewBar = document.getElementById("photo-preview-bar");
const photoPreviewImg = document.getElementById("photo-preview-img");
const photoPreviewName = document.getElementById("photo-preview-name");
const cancelPhotoBtn = document.getElementById("cancel-photo-btn");
const micBtn = document.getElementById("mic-btn");
const audioPreviewBar = document.getElementById("audio-preview-bar");
const audioPreviewPlayer = document.getElementById("audio-preview-player");
const cancelAudioBtn = document.getElementById("cancel-audio-btn");
const locBtn = document.getElementById("loc-btn");
const liveLocBar = document.getElementById("live-loc-bar");
const stopLiveLocBtn = document.getElementById("stop-live-loc-btn");
const locationModal = document.getElementById("location-modal");
const closeLocBtn = document.getElementById("close-loc-btn");
const sendStaticLocBtn = document.getElementById("send-static-loc-btn");
const startLiveLocBtn = document.getElementById("start-live-loc-btn");

const imageModal = document.getElementById("image-modal");
const imageModalImg = document.getElementById("image-modal-img");
const downloadImageBtn = document.getElementById("download-image-btn");
const closeImageBtn = document.getElementById("close-image-btn");

const profileModal = document.getElementById("profile-modal");
const closeProfileBtn = document.getElementById("close-profile-btn");
const profileBannerPreview = document.getElementById("profile-banner-preview");
const profileAvatarPreview = document.getElementById("profile-avatar-preview");
const profileNamePreview = document.getElementById("profile-name-preview");
const profileBioPreview = document.getElementById("profile-bio-preview");
const profileAvatarInput = document.getElementById("profile-avatar-input");
const profileAvatarBtn = document.getElementById("profile-avatar-btn");
const profileNicknameInput = document.getElementById("profile-nickname-input");
const profileEmojiInput = document.getElementById("profile-emoji-input");
const profileBioInput = document.getElementById("profile-bio-input");
const emojiPresets = document.getElementById("emoji-presets");
const profileBannerInput = document.getElementById("profile-banner-input");
const saveProfileDetailsBtn = document.getElementById("save-profile-details-btn");
const profileColorInput = document.getElementById("profile-color-input");
const profileColorHex = document.getElementById("profile-color-hex");
const profileColorPreview = document.getElementById("profile-color-preview");
const colorPresets = document.getElementById("color-presets");
const saveColorBtn = document.getElementById("save-color-btn");
const resetColorBtn = document.getElementById("reset-color-btn");
const profileBgPreview = document.getElementById("profile-bg-preview");
const profileBgInput = document.getElementById("profile-bg-input");
const profileBgBtn = document.getElementById("profile-bg-btn");
const resetBgBtn = document.getElementById("reset-bg-btn");

const userProfileModal = document.getElementById("user-profile-modal");
const closeUserProfileBtn = document.getElementById("close-user-profile-btn");
const viewUserBanner = document.getElementById("view-user-banner");
const viewUserAvatar = document.getElementById("view-user-avatar");
const viewUserName = document.getElementById("view-user-name");
const viewUserStatus = document.getElementById("view-user-status");
const viewUserBio = document.getElementById("view-user-bio");

const adminModal = document.getElementById("admin-modal");
const closeAdminBtn = document.getElementById("close-admin-btn");
const inviteForm = document.getElementById("invite-form");
const inviteLabelInput = document.getElementById("invite-label");
const invitesList = document.getElementById("invites-list");
const adminUsersList = document.getElementById("admin-users-list");
const driveConfigForm = document.getElementById("drive-config-form");
const driveUrlInput = document.getElementById("drive-url-input");
const driveSecretInput = document.getElementById("drive-secret-input");

const MIC_ICON_HTML =
  '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-3 0h6"/></svg>';

// Yardımcılar
function isConfigured() {
  return (
    typeof FIREBASE_CONFIG !== "undefined" &&
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey !== "BURAYA_API_KEY"
  );
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getDisplayName(u) {
  if (!u) return "?";
  const nick = String(u.nickname || "").trim();
  return nick || String(u.name || "").trim() || "?";
}

function isValidHexColor(hex) {
  return /^#[0-9a-fA-F]{6}$/.test(String(hex || "").trim());
}

function getContrastTextColor(hex) {
  if (!isValidHexColor(hex)) return "#f8fafc";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#0f172a" : "#f8fafc";
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))))
      .toString(16)
      .padStart(2, "0");
  return `#${f(0)}${f(8)}${f(4)}`;
}

function applyAppTheme(themeId, customHex = "", customBgHex = "") {
  const root = document.documentElement;
  root.classList.toggle("theme-rainbow", themeId === "rainbow");
  let t = APP_THEMES[themeId] || APP_THEMES.midnight;

  if (themeId === "custom" && isValidHexColor(customHex)) {
    const bgHex = isValidHexColor(customBgHex) ? customBgHex : "#080812";
    const bgIsLight = getContrastTextColor(bgHex) === "#0f172a";
    t = {
      name: "Özel",
      bg: bgHex,
      surface: bgIsLight ? "#ffffff" : "#111322",
      surface2: bgIsLight ? "#e2e8f0" : "#1e2238",
      border: bgIsLight ? "#cbd5e1" : "#2f3557",
      text: bgIsLight ? "#0f172a" : "#f8fafc",
      muted: bgIsLight ? "#475569" : "#94a3b8",
      navText: bgIsLight ? "#475569" : "#cbd5e1",
      accent: customHex,
      accent2: customHex,
      onAccent: getContrastTextColor(customHex),
      bubbleMe: customHex,
      bubbleOther: bgIsLight ? "#e2e8f0" : "#1e2238"
    };
  }

  root.style.setProperty("--bg", t.bg);
  root.style.setProperty("--surface", t.surface);
  root.style.setProperty("--surface-2", t.surface2);
  root.style.setProperty("--border", t.border);
  root.style.setProperty("--text", t.text);
  root.style.setProperty("--muted", t.muted);
  root.style.setProperty("--nav-text", t.navText);
  root.style.setProperty("--accent", t.accent);
  root.style.setProperty("--accent-2", t.accent2);
  root.style.setProperty("--on-accent", t.onAccent);
  root.style.setProperty("--bubble-me", t.bubbleMe);
  root.style.setProperty("--bubble-other", t.bubbleOther);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", t.surface);

  localStorage.setItem(
    THEME_STORAGE_KEY,
    JSON.stringify({ id: themeId, customHex, customBgHex })
  );
  renderThemeGrid(themeId);
}

function loadSavedTheme() {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) {
      renderThemeGrid("midnight");
      return;
    }
    const parsed = JSON.parse(raw);
    applyAppTheme(parsed.id || "midnight", parsed.customHex || "", parsed.customBgHex || "");
    if (customThemeInput && isValidHexColor(parsed.customHex)) {
      customThemeInput.value = parsed.customHex;
    }
    if (customBgInput && isValidHexColor(parsed.customBgHex)) {
      customBgInput.value = parsed.customBgHex;
    }
  } catch {
    renderThemeGrid("midnight");
  }
}

function renderThemeGrid(activeId) {
  if (!themeGrid) return;
  themeGrid.innerHTML = Object.entries(APP_THEMES)
    .map(([id, t]) => {
      const isActive = id === activeId ? " active" : "";
      return `
        <button type="button" class="theme-chip${isActive}" data-theme-id="${id}">
          <span class="theme-dot" style="background: linear-gradient(135deg, ${t.accent}, ${t.bg});"></span>
          <span>${t.name}</span>
        </button>
      `;
    })
    .join("");

  themeGrid.querySelectorAll("[data-theme-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tid = btn.dataset.themeId;
      applyAppTheme(tid);
      if (state.db && state.user) {
        state.db.ref("users/" + state.user.id + "/appTheme").set({ id: tid, customHex: "" });
      }
    });
  });
}

function linkifyText(str) {
  const safe = escapeHtml(str);
  return safe.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a class="msg-link" href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
}

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function normalizeTurkish(str) {
  return String(str || "")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "u")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function showView(viewEl) {
  [loadingView, authView, mainView, chatView].forEach((v) => v && v.classList.remove("active"));
  if (viewEl) viewEl.classList.add("active");
}

function pushBackState(tag) {
  try {
    history.pushState({ agartha: tag }, "");
  } catch {
    // Bazı ortamlarda pushState engellenebilir
  }
}

function closeActiveChatWithAnimation() {
  if (!chatView.classList.contains("active")) return;
  cleanupActiveRoomListeners();
  state.activeRoom = null;
  chatView.classList.add("leaving");
  setTimeout(() => {
    chatView.classList.remove("leaving");
    showView(mainView);
  }, 180);
}

window.addEventListener("popstate", () => {
  // 1. Önce açık bir modal varsa onu kapat
  if (imageModal && !imageModal.classList.contains("hidden")) {
    imageModal.classList.add("hidden");
    imageModalImg.src = "";
    return;
  }
  if (locationModal && !locationModal.classList.contains("hidden")) {
    locationModal.classList.add("hidden");
    return;
  }
  if (userProfileModal && !userProfileModal.classList.contains("hidden")) {
    userProfileModal.classList.add("hidden");
    return;
  }
  if (profileModal && !profileModal.classList.contains("hidden")) {
    profileModal.classList.add("hidden");
    return;
  }
  if (customizeModal && !customizeModal.classList.contains("hidden")) {
    customizeModal.classList.add("hidden");
    return;
  }
  if (adminModal && !adminModal.classList.contains("hidden")) {
    adminModal.classList.add("hidden");
    if (state.invitesRef) {
      state.invitesRef.off();
      state.invitesRef = null;
    }
    return;
  }
  if (settingsModal && !settingsModal.classList.contains("hidden")) {
    settingsModal.classList.add("hidden");
    return;
  }

  // 2. Sohbet odası açıksa ana ekrana dön
  if (chatView.classList.contains("active")) {
    closeActiveChatWithAnimation();
    return;
  }

  // 3. Ana ekranda Mekanlar veya AI sekmesindeyse Sohbetler sekmesine dön
  if (mainView.classList.contains("active")) {
    const activeTabIdx = bottomTabs.findIndex((t) => t.classList.contains("active"));
    if (activeTabIdx > 0) {
      selectBottomTab(0);
    }
  }
});

function showError(msg) {
  loginError.textContent = msg;
  loginError.classList.remove("hidden");
}

function clearError() {
  loginError.textContent = "";
  loginError.classList.add("hidden");
  registerError.textContent = "";
  registerError.classList.add("hidden");
}

function showRegisterError(msg) {
  registerError.textContent = msg;
  registerError.classList.remove("hidden");
}

document.querySelectorAll("[data-auth-tab]").forEach((tabBtn) => {
  tabBtn.addEventListener("click", () => {
    clearError();
    const mode = tabBtn.dataset.authTab;
    document.querySelectorAll("[data-auth-tab]").forEach((b) => b.classList.remove("active"));
    tabBtn.classList.add("active");
    if (mode === "register") {
      loginForm.classList.add("hidden");
      registerForm.classList.remove("hidden");
    } else {
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
    }
  });
});

regAvatarBtn.addEventListener("click", () => regAvatarInput.click());

regAvatarInput.addEventListener("change", async () => {
  const file = regAvatarInput.files && regAvatarInput.files[0];
  regAvatarInput.value = "";
  if (!file) return;
  try {
    const avatarData = await compressImageToBase64(file, 180, 0.75);
    state.pendingRegAvatar = avatarData;
    regAvatarPreview.src = avatarData;
  } catch {
    showRegisterError("Profil fotoğrafı yüklenemedi.");
  }
});

function slugifyId(name) {
  const base = normalizeTurkish(name) || "user";
  return base + "_" + Math.random().toString(36).slice(2, 6);
}

function getDmRoomId(id1, id2) {
  return "dm_" + [id1, id2].sort().join("__");
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  if (window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return "fallback_" + Math.abs(hash).toString(16);
}

function compressImageToBase64(file, maxSize = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Görsel yüklenemedi"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width >= height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function fileToRawBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.onload = () => {
      const result = String(reader.result || "");
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}

async function uploadToGoogleDrive(file) {
  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Sadece fotoğraf dosyaları yüklenebilir");
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error("Fotoğraf boyutu en fazla 25 MB olabilir");
  }
  const base64 = await fileToRawBase64(file);
  const res = await fetch(state.driveConfig.url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      secret: state.driveConfig.secret || "",
      fileName: file.name || ("agartha_" + Date.now() + ".jpg"),
      mimeType: file.type || "image/jpeg",
      base64
    })
  });
  const data = await res.json();
  if (!data || !data.ok || !data.url) {
    throw new Error((data && data.error) || "Drive yükleme hatası");
  }
  return data;
}

function pickAudioMimeType() {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return "";
  const candidates = [
    "audio/mp4",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus"
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Ses okunamadı"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(blob);
  });
}

async function uploadBlobToGoogleDrive(blob, fileName, mimeType) {
  const dataUrl = await blobToDataUrl(blob);
  const idx = dataUrl.indexOf(",");
  const base64 = idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
  const res = await fetch(state.driveConfig.url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      secret: state.driveConfig.secret || "",
      fileName,
      mimeType,
      base64
    })
  });
  const data = await res.json();
  if (!data || !data.ok || !data.id) {
    throw new Error((data && data.error) || "Drive ses yükleme hatası");
  }
  return data;
}

function extractDriveFileIds(msg) {
  if (!msg) return [];
  const ids = [];
  if (msg.driveFileId) ids.push(msg.driveFileId);
  if (msg.audioDriveFileId) ids.push(msg.audioDriveFileId);
  if (!msg.driveFileId && msg.imageUrl) {
    const match = String(msg.imageUrl).match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) ids.push(match[1]);
  }
  return ids;
}

async function deleteFromGoogleDrive(fileId) {
  if (!fileId || !state.driveConfig || !state.driveConfig.url) return;
  try {
    await fetch(state.driveConfig.url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "delete",
        secret: state.driveConfig.secret || "",
        fileId
      })
    });
  } catch {
    // Drive silme başarısız olsa da sohbet akışını bozma
  }
}

// Başlatma
function init() {
  loadSavedTheme();
  try {
    if (typeof firebase === "undefined") {
      showError("Firebase kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin.");
      return;
    }
    if (!isConfigured()) {
      configWarning.classList.remove("hidden");
      return;
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    state.db = firebase.database();

    const kickedMsg = sessionStorage.getItem("agartha_kicked");
    if (kickedMsg) {
      sessionStorage.removeItem("agartha_kicked");
      showError(kickedMsg);
    }

    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (loadingView) showView(loadingView);
        verifyAndEnter(parsed);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  } catch (err) {
    showError("Başlatma hatası: " + (err.message || err));
  }
}

function verifyAndEnter(sessionUser) {
  state.db
    .ref("users/" + sessionUser.id)
    .once("value")
    .then((snap) => {
      const data = snap.val();
      if (!data) {
        localStorage.removeItem(SESSION_KEY);
        showView(authView);
        showError("Hesabınız yönetici tarafından silindi.");
        return;
      }
      if (data.active === false) {
        showView(authView);
        showError("Erişiminiz askıya alındı. Yönetici yetkiyi açtığında otomatik giriş yapılacaktır.");
        waitForReactivation(sessionUser);
        return;
      }
      state.user = {
        id: sessionUser.id,
        name: data.name,
        nickname: data.nickname || "",
        isAdmin: Boolean(data.isAdmin),
        avatarData: data.avatarData || "",
        bubbleColor: data.bubbleColor || "",
        bio: data.bio || "",
        statusEmoji: data.statusEmoji || "",
        bannerColor: data.bannerColor || "",
        chatBgData: data.chatBgData || ""
      };
      enterMainApp();
    })
    .catch(() => {
      showError("Sunucuya bağlanılamadı.");
    });
}

function waitForReactivation(sessionUser) {
  const ref = state.db.ref("users/" + sessionUser.id);
  ref.on("value", (snap) => {
    const data = snap.val();
    if (!data) {
      ref.off();
      localStorage.removeItem(SESSION_KEY);
      showError("Hesabınız yönetici tarafından silindi.");
      return;
    }
    if (data.active !== false) {
      ref.off();
      clearError();
      state.user = {
        id: sessionUser.id,
        name: data.name,
        nickname: data.nickname || "",
        isAdmin: Boolean(data.isAdmin),
        avatarData: data.avatarData || "",
        bubbleColor: data.bubbleColor || "",
        bio: data.bio || "",
        statusEmoji: data.statusEmoji || "",
        bannerColor: data.bannerColor || "",
        chatBgData: data.chatBgData || ""
      };
      enterMainApp();
    }
  });
}

// Giriş İşlemi
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  if (!state.db) {
    init();
  }
  if (!state.db) {
    if (!isConfigured()) {
      showError("Önce firebase-config.js dosyasını doldurun.");
    }
    return;
  }

  const username = loginUsername.value.trim();
  const code = loginCode.value.trim();
  if (!username || !code) return;

  try {
    const codeHash = await sha256(code);
    const adminHashSnap = await state.db.ref("config/adminHash").once("value");
    const savedAdminHash = adminHashSnap.val();

    if (!savedAdminHash) {
      await state.db.ref("config/adminHash").set(codeHash);
    }

    if (!savedAdminHash || codeHash === savedAdminHash) {
      const userId = "admin_" + (normalizeTurkish(username) || "root");
      const existingAdminSnap = await state.db.ref("users/" + userId).once("value");
      const existingAdmin = existingAdminSnap.val();
      const avatarData = (existingAdmin && existingAdmin.avatarData) || "";
      const nickname = (existingAdmin && existingAdmin.nickname) || "";
      const bubbleColor = (existingAdmin && existingAdmin.bubbleColor) || "";
      const bio = (existingAdmin && existingAdmin.bio) || "";
      const statusEmoji = (existingAdmin && existingAdmin.statusEmoji) || "";
      const bannerColor = (existingAdmin && existingAdmin.bannerColor) || "";
      const chatBgData = (existingAdmin && existingAdmin.chatBgData) || "";
      await state.db.ref("users/" + userId).set({
        name: username,
        nickname,
        isAdmin: true,
        active: existingAdmin ? existingAdmin.active !== false : true,
        online: true,
        avatarData,
        bubbleColor,
        bio,
        statusEmoji,
        bannerColor,
        chatBgData,
        joinedAt: (existingAdmin && existingAdmin.joinedAt) || Date.now()
      });
      state.user = { id: userId, name: username, nickname, isAdmin: true, avatarData, bubbleColor, bio, statusEmoji, bannerColor, chatBgData };
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: userId, name: username, isAdmin: true }));
      enterMainApp();
      return;
    }

    // Mevcut kullanıcı kendi adı + şifresi (veya eski davet kodu) ile giriş yapıyorsa
    const usersSnap = await state.db.ref("users").once("value");
    const allUsers = usersSnap.val() || {};
    const matchedEntry = Object.entries(allUsers).find(([, u]) => {
      const sameName =
        String(u.name || "").trim().toLowerCase() === username.toLowerCase();
      const sameSecret =
        u.passwordHash === codeHash ||
        u.codeHash === codeHash ||
        u.inviteCode === code;
      return sameName && sameSecret;
    });

    if (matchedEntry) {
      const [existingId, existingUser] = matchedEntry;
      if (existingUser.active === false) {
        showError("Erişiminiz yönetici tarafından askıya alınmış.");
        return;
      }
      await state.db.ref("users/" + existingId).update({ online: true });
      state.user = {
        id: existingId,
        name: existingUser.name,
        nickname: existingUser.nickname || "",
        isAdmin: Boolean(existingUser.isAdmin),
        avatarData: existingUser.avatarData || "",
        bubbleColor: existingUser.bubbleColor || "",
        bio: existingUser.bio || "",
        statusEmoji: existingUser.statusEmoji || "",
        bannerColor: existingUser.bannerColor || "",
        chatBgData: existingUser.chatBgData || ""
      };
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ id: existingId, name: existingUser.name, isAdmin: Boolean(existingUser.isAdmin) })
      );
      enterMainApp();
      return;
    }

    showError("Kullanıcı adı veya şifre hatalı. Yeni kullanıcıysanız 'Hesap Oluştur' sekmesini kullanın.");
  } catch (err) {
    showError("Giriş hatası: " + (err.message || "Bağlantı sorunu"));
  }
});

// Hesap Oluşturma İşlemi
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  if (!state.db) {
    init();
  }
  if (!state.db) {
    if (!isConfigured()) {
      showRegisterError("Önce firebase-config.js dosyasını doldurun.");
    }
    return;
  }

  const username = regUsername.value.trim();
  const nickname = regNickname ? regNickname.value.trim() : "";
  const password = regPassword.value.trim();
  const code = regInvite.value.trim();
  if (!username || !password || !code) return;

  try {
    const inviteSnap = await state.db.ref("invites/" + code).once("value");
    const invite = inviteSnap.val();
    if (!invite || invite.active !== true) {
      showRegisterError("Geçersiz veya daha önce kullanılmış erişim kodu.");
      return;
    }

    const usersSnap = await state.db.ref("users").once("value");
    const allUsers = usersSnap.val() || {};
    const nameTaken = Object.values(allUsers).some(
      (u) => String(u.name || "").trim().toLowerCase() === username.toLowerCase()
    );
    if (nameTaken) {
      showRegisterError("Bu kullanıcı adı zaten alınmış. Farklı bir kullanıcı adı seçin.");
      return;
    }

    const passwordHash = await sha256(password);
    const userId = slugifyId(username);
    const avatarData = state.pendingRegAvatar || "";
    const finalNickname = nickname || username;

    await state.db.ref("users/" + userId).set({
      name: username,
      nickname: finalNickname,
      isAdmin: false,
      active: true,
      online: true,
      inviteCode: code,
      passwordHash,
      avatarData,
      joinedAt: Date.now()
    });

    await state.db.ref("invites/" + code).update({
      active: false,
      usedBy: finalNickname,
      claimedByUserId: userId,
      usedAt: Date.now()
    });

    state.user = {
      id: userId,
      name: username,
      nickname: finalNickname,
      isAdmin: false,
      avatarData,
      bubbleColor: "",
      bio: "",
      statusEmoji: "",
      bannerColor: ""
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: userId, name: username, isAdmin: false }));
    enterMainApp();
  } catch (err) {
    showRegisterError("Kayıt hatası: " + (err.message || "Bağlantı sorunu"));
  }
});

function applyChatBackground(bgData) {
  if (!chatBgLayer) return;
  if (bgData) {
    chatBgLayer.style.backgroundImage = `url("${bgData}")`;
    chatBgLayer.classList.remove("hidden");
  } else {
    chatBgLayer.style.backgroundImage = "";
    chatBgLayer.classList.add("hidden");
  }
}

function updateHeaderIdentity() {
  const emojiPrefix = state.user.statusEmoji ? `${state.user.statusEmoji} ` : "";
  const disp = getDisplayName(state.user);
  currentUserLabel.textContent = state.user.isAdmin
    ? `${emojiPrefix}${disp} (Admin)`
    : `${emojiPrefix}${disp}`;
  headerAvatar.src = state.user.avatarData || "./icon-192.png";
  headerAvatar.style.border = isValidHexColor(state.user.bannerColor)
    ? `2px solid ${state.user.bannerColor}`
    : "";
  applyChatBackground(state.user.chatBgData || "");
}

async function preloadInitialData() {
  if (loadingStatus) {
    loadingStatus.textContent = "Kişiler ve mesajlar indiriliyor...";
  }
  const tasks = [];

  tasks.push(
    state.db.ref("users/" + state.user.id + "/appTheme").once("value").then((snap) => {
      const val = snap.val();
      if (val && val.id) {
        applyAppTheme(val.id, val.customHex || "", val.customBgHex || "");
        if (customThemeInput && isValidHexColor(val.customHex)) {
          customThemeInput.value = val.customHex;
        }
        if (customBgInput && isValidHexColor(val.customBgHex)) {
          customBgInput.value = val.customBgHex;
        }
      }
    }).catch(() => {})
  );

  tasks.push(
    state.db.ref("chats/main_group/messages").limitToLast(100).once("value").then((snap) => {
      state.preloadedChats["main_group"] = snap.val() || {};
    }).catch(() => {})
  );

  tasks.push(
    state.db.ref("users").once("value").then(async (snap) => {
      const users = snap.val() || {};
      state.usersCache = users;
      const others = Object.entries(users).filter(
        ([id, u]) => id !== state.user.id && u.active !== false
      );
      if (loadingStatus) {
        loadingStatus.textContent = `${others.length + 1} sohbet odası yükleniyor...`;
      }
      await Promise.all(
        others.map(([otherId]) => {
          const dmId = getDmRoomId(state.user.id, otherId);
          return state.db
            .ref(`chats/${dmId}/messages`)
            .limitToLast(100)
            .once("value")
            .then((dmSnap) => {
              state.preloadedChats[dmId] = dmSnap.val() || {};
            })
            .catch(() => {});
        })
      );
    }).catch(() => {})
  );

  tasks.push(state.db.ref("places").limitToLast(50).once("value").catch(() => {}));
  tasks.push(state.db.ref("recommendations").limitToLast(30).once("value").catch(() => {}));
  tasks.push(state.db.ref("config/drive").once("value").catch(() => {}));

  const timeout = new Promise((resolve) => setTimeout(resolve, 8000));
  await Promise.race([Promise.allSettled(tasks), timeout]);
}

async function enterMainApp() {
  if (loadingView) {
    if (loadingStatus) loadingStatus.textContent = "Mesajlar yükleniyor, lütfen bekleyin...";
    showView(loadingView);
  }

  updateHeaderIdentity();

  if (state.user.isAdmin) {
    openAdminBtn.classList.remove("hidden");
  } else {
    openAdminBtn.classList.add("hidden");
  }

  await preloadInitialData();

  updateNotifyButton();
  setupPresence();
  listenDriveConfig();
  listenUsers();
  listenMainGroupPreview();
  listenPlaces();
  listenAiRecommendations();
  watchOwnAccess();
  showView(mainView);
}

function listenDriveConfig() {
  state.db.ref("config/drive").on("value", (snap) => {
    const val = snap.val() || {};
    state.driveConfig = {
      url: String(val.url || "").trim(),
      secret: String(val.secret || "").trim()
    };
  });
}

function setupPresence() {
  if (state.presenceSetup) return;
  state.presenceSetup = true;

  const userRef = state.db.ref("users/" + state.user.id);
  const connectedRef = state.db.ref(".info/connected");
  connectedRef.on("value", (snap) => {
    if (snap.val() === true) {
      userRef.onDisconnect().update({
        online: false,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
      });
      userRef.update({ online: true });
    }
  });
}

function updateNotifyButton() {
  if (!("Notification" in window)) {
    notifyBtn.classList.add("hidden");
    return;
  }
  if (Notification.permission === "granted") {
    if (notifyStatusLabel) notifyStatusLabel.textContent = "Açık";
    notifyBtn.style.borderColor = "rgba(34, 197, 94, 0.5)";
  } else if (Notification.permission === "denied") {
    if (notifyStatusLabel) notifyStatusLabel.textContent = "Engelli";
    notifyBtn.style.borderColor = "";
  } else {
    if (notifyStatusLabel) notifyStatusLabel.textContent = "Kapalı (Açmak için dokun)";
    notifyBtn.style.borderColor = "";
  }
}

notifyBtn.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    alert("Bu tarayıcı bildirimleri desteklemiyor. iPhone'da önce Ana Ekrana Ekle yapmalısınız.");
    return;
  }
  const perm = await Notification.requestPermission();
  updateNotifyButton();
  if (perm === "granted") {
    showIncomingNotification("Agartha", "Bildirimler açıldı! Yeni mesaj geldiğinde haber vereceğiz.", "test");
  }
});

async function showIncomingNotification(title, body, uniqueKey) {
  if (uniqueKey && state.notifiedMsgKeys.has(uniqueKey)) return;
  if (uniqueKey) state.notifiedMsgKeys.add(uniqueKey);

  if (navigator.vibrate) {
    navigator.vibrate([120, 60, 120]);
  }

  if (!("Notification" in window) || Notification.permission !== "granted") return;

  try {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body,
        icon: "./icon-192.png",
        badge: "./icon-192.png",
        tag: uniqueKey || "agartha-msg"
      });
      return;
    }
  } catch {
    // Fallback'e düş
  }

  new Notification(title, { body, icon: "./icon-192.png" });
}

function watchOwnAccess() {
  state.db.ref("users/" + state.user.id).on("value", (snap) => {
    const data = snap.val();
    if (!data) {
      sessionStorage.setItem(
        "agartha_kicked",
        "Hesabınız yönetici tarafından silindi."
      );
      logout();
      return;
    }
    if (data.active === false) {
      showView(authView);
      showError("Erişiminiz askıya alındı. Yönetici yetkiyi açtığında otomatik giriş yapılacaktır.");
      return;
    }
    if (authView.classList.contains("active")) {
      clearError();
      showView(mainView);
    }
    const nextAdmin = Boolean(data.isAdmin);
    state.user.nickname = data.nickname || "";
    state.user.avatarData = data.avatarData || "";
    state.user.bubbleColor = data.bubbleColor || "";
    state.user.bio = data.bio || "";
    state.user.statusEmoji = data.statusEmoji || "";
    state.user.bannerColor = data.bannerColor || "";
    state.user.chatBgData = data.chatBgData || "";
    updateHeaderIdentity();
    if (nextAdmin !== state.user.isAdmin) {
      state.user.isAdmin = nextAdmin;
      localStorage.setItem(SESSION_KEY, JSON.stringify(state.user));
      currentUserLabel.textContent = nextAdmin
        ? `${state.user.name} (Admin)`
        : state.user.name;
      if (nextAdmin) {
        openAdminBtn.classList.remove("hidden");
        renderAdminUsers(state.usersCache);
      } else {
        openAdminBtn.classList.add("hidden");
        adminModal.classList.add("hidden");
      }
    }
  });
}

function logout() {
  if (state.db && state.user) {
    state.db.ref("users/" + state.user.id).update({
      online: false,
      lastSeen: Date.now()
    }).catch(() => {});
  }
  localStorage.removeItem(SESSION_KEY);
  location.reload();
}

logoutBtn.addEventListener("click", logout);

// Alt Sekme Geçişleri
const bottomTabs = Array.from(mainView.querySelectorAll(".bottom-nav .nav-btn"));
const bottomPanels = bottomTabs.map((tab) => document.getElementById("tab-" + tab.dataset.tab));

function selectBottomTab(index) {
  bottomTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    bottomPanels[tabIndex].classList.toggle("active", selected);
  });
}

bottomTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    const prevIndex = bottomTabs.findIndex((t) => t.classList.contains("active"));
    selectBottomTab(index);
    if (prevIndex === 0 && index > 0) {
      pushBackState("tab");
    }
  });

  tab.addEventListener("keydown", (event) => {
    const lastIndex = bottomTabs.length - 1;
    let nextIndex;

    switch (event.key) {
      case "ArrowLeft":
        nextIndex = index === 0 ? lastIndex : index - 1;
        break;
      case "ArrowRight":
        nextIndex = index === lastIndex ? 0 : index + 1;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = lastIndex;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectBottomTab(nextIndex);
    bottomTabs[nextIndex].focus();
  });
});

function renderContactsList() {
  const others = Object.entries(state.usersCache).filter(
    ([id, u]) => id !== state.user.id && u.active !== false
  );

  if (others.length === 0) {
    contactsList.innerHTML = `<div class="empty-hint">Henüz başka yetkili kişi yok.</div>`;
    return;
  }

  contactsList.innerHTML = others
    .map(([id, u]) => {
      const dispName = getDisplayName(u);
      const initial = escapeHtml(dispName.charAt(0).toUpperCase());
      const role = u.isAdmin ? " • Yönetici" : "";
      const dmId = getDmRoomId(state.user.id, id);
      const unreadHtml = state.unreadRooms.has(dmId) ? `<span class="unread-dot"></span>` : "";
      const onlineDot = u.online ? `<span class="online-dot"></span>` : "";
      const statusText = u.online
        ? "Çevrimiçi"
        : u.lastSeen
        ? `Son görülme ${formatTime(u.lastSeen)}`
        : "Özel sohbet aç";
      const emojiPrefix = u.statusEmoji ? `${escapeHtml(u.statusEmoji)} ` : "";
      const bioSuffix = u.bio ? ` • ${escapeHtml(u.bio)}` : "";
      const ringStyle = isValidHexColor(u.bannerColor)
        ? ` style="border: 2px solid ${u.bannerColor};"`
        : "";

      const avatarHtml = u.avatarData
        ? `<img class="avatar-img" src="${escapeHtml(u.avatarData)}" alt="${escapeHtml(dispName)}"${ringStyle} />`
        : `<div class="avatar"${ringStyle}>${initial}</div>`;

      return `
        <button class="chat-item" data-dm-id="${escapeHtml(id)}" data-dm-name="${escapeHtml(dispName)}">
          <div class="avatar-wrap">
            ${avatarHtml}
            ${onlineDot}
          </div>
          <div class="chat-item-body">
            <div class="chat-item-top">
              <span class="chat-name">${emojiPrefix}${escapeHtml(dispName)}${unreadHtml}</span>
            </div>
            <div class="chat-preview">${statusText}${bioSuffix}${role}</div>
          </div>
        </button>
      `;
    })
    .join("");

  contactsList.querySelectorAll("[data-dm-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const otherId = btn.dataset.dmId;
      const otherName = btn.dataset.dmName;
      openChatRoom(getDmRoomId(state.user.id, otherId), otherName, false, otherId);
    });
  });
}

// Kişiler Listesi
function listenUsers() {
  state.db.ref("users").on("value", (snap) => {
    const users = snap.val() || {};
    state.usersCache = users;

    renderContactsList();

    // Aktif özel sohbette karşı tarafın çevrimiçi durumunu güncelle
    if (state.activeRoom && !state.activeRoom.isGroup && state.activeRoom.otherId) {
      const other = users[state.activeRoom.otherId];
      if (other) {
        chatRoomSubtitle.textContent = other.online
          ? "Çevrimiçi"
          : other.lastSeen
          ? `Son görülme ${formatTime(other.lastSeen)}`
          : "Özel sohbet";
      }
    }

    if (state.user.isAdmin) {
      renderAdminUsers(users);
    }

    const others = Object.entries(users).filter(
      ([id, u]) => id !== state.user.id && u.active !== false
    );

    others.forEach(([otherId, u]) => {
      const dmId = getDmRoomId(state.user.id, otherId);
      if (state.dmListeners[dmId]) return;
      const ref = state.db.ref(`chats/${dmId}/messages`).limitToLast(1);
      state.dmListeners[dmId] = ref;
      ref.on("child_added", (msgSnap) => {
        const msg = msgSnap.val();
        if (!msg || (msg.timestamp || 0) <= state.startedAt) return;
        if (msg.senderId === state.user.id) return;
        const isViewingThis = state.activeRoom && state.activeRoom.id === dmId;
        if (!isViewingThis) {
          state.unreadRooms.add(dmId);
          renderContactsList();
        }
        if (!(isViewingThis && document.visibilityState === "visible")) {
          showIncomingNotification(
            `${msg.senderName || u.name} (Özel)`,
            msg.text ||
              (msg.imageUrl || msg.imageData
                ? "Fotoğraf gönderdi"
                : msg.audioUrl || msg.audioData
                ? "Sesli mesaj"
                : msg.location
                ? msg.location.live
                  ? "Canlı konum başlattı"
                  : "Konum paylaştı"
                : ""),
            msgSnap.key
          );
        }
      });
    });
  });
}

function listenMainGroupPreview() {
  state.db
    .ref("chats/main_group/messages")
    .limitToLast(1)
    .on("value", (snap) => {
      const val = snap.val();
      if (!val) {
        mainGroupPreview.textContent = "Herkesin ortak sohbet odası";
        mainGroupTime.textContent = "";
        return;
      }
      const [key, msg] = Object.entries(val)[0];
      const previewText =
        msg.text ||
        (msg.imageUrl || msg.imageData
          ? "Fotoğraf"
          : msg.audioUrl || msg.audioData
          ? "Sesli mesaj"
          : msg.location
          ? msg.location.live
            ? "Canlı Konum"
            : "Konum"
          : "");
      mainGroupPreview.textContent = `${msg.senderName}: ${previewText}`;
      mainGroupTime.textContent = formatTime(msg.timestamp);

      if ((msg.timestamp || 0) > state.startedAt && msg.senderId !== state.user.id) {
        const isViewingGroup = state.activeRoom && state.activeRoom.id === "main_group";
        if (!isViewingGroup) {
          mainGroupBadge.classList.remove("hidden");
        }
        if (!(isViewingGroup && document.visibilityState === "visible")) {
          showIncomingNotification("Ana Grup", `${msg.senderName}: ${previewText}`, key);
        }
      }
    });
}

openMainGroupBtn.addEventListener("click", () => {
  mainGroupBadge.classList.add("hidden");
  openChatRoom("main_group", "Ana Grup", true, null);
});

// Sohbet Odası
function openChatRoom(roomId, title, isGroup, otherId) {
  cleanupActiveRoomListeners();

  state.unreadRooms.delete(roomId);
  if (!isGroup) renderContactsList();

  state.activeRoom = { id: roomId, title, isGroup, otherId };
  chatRoomTitle.textContent = title;
  if (isGroup) {
    chatRoomAvatar.src = "./icon-192.png";
    chatRoomAvatar.classList.remove("hidden");
    chatRoomSubtitle.textContent = "Tüm yetkili arkadaşlar";
  } else {
    const other = otherId ? state.usersCache[otherId] : null;
    if (other && other.avatarData) {
      chatRoomAvatar.src = other.avatarData;
      chatRoomAvatar.classList.remove("hidden");
    } else {
      chatRoomAvatar.classList.add("hidden");
    }
    chatRoomSubtitle.textContent = other?.online
      ? "Çevrimiçi"
      : other?.lastSeen
      ? `Son görülme ${formatTime(other.lastSeen)}`
      : "Özel sohbet";
  }

  if (!isGroup || state.user.isAdmin) {
    deleteChatBtn.classList.remove("hidden");
  } else {
    deleteChatBtn.classList.add("hidden");
  }

  messagesContainer.innerHTML = "";
  typingIndicator.classList.add("hidden");
  showView(chatView);
  pushBackState("chat");

  function renderRoomMessages(data) {
    state.preloadedChats[roomId] = data;
    const entries = Object.entries(data).sort(
      (a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0)
    );

    if (entries.length === 0) {
      messagesContainer.innerHTML = `<div class="empty-hint">Henüz mesaj yok. İlk mesajı sen yaz!</div>`;
      return;
    }

    messagesContainer.innerHTML = entries
      .map(([msgKey, m]) => {
        const isMe = m.senderId === state.user.id;
        const canDelete = isMe || state.user.isAdmin;
        const senderUser = state.usersCache[m.senderId];
        const liveSenderName = senderUser ? getDisplayName(senderUser) : (m.senderName || "?");
        const customColor =
          senderUser && isValidHexColor(senderUser.bubbleColor)
            ? senderUser.bubbleColor
            : "";
        const customStyle = customColor
          ? ` style="background-color:${customColor};color:${getContrastTextColor(customColor)};border-color:${customColor};"`
          : "";
        const senderColorStyle = customColor ? ` style="color:inherit;opacity:0.9;"` : "";
        const senderHtml =
          !isMe && isGroup
            ? `<div class="msg-sender"${senderColorStyle}>${escapeHtml(liveSenderName)}</div>`
            : "";
        const delHtml = canDelete
          ? `<button class="msg-delete-btn" data-del-msg="${escapeHtml(msgKey)}" title="Mesajı sil">&times;</button>`
          : "";
        const fullImgSrc = m.imageUrl || m.imageData;
        const thumbImgSrc =
          m.imageUrl && m.imageUrl.includes("lh3.googleusercontent.com/d/")
            ? m.imageUrl + "=w400"
            : fullImgSrc;
        const imgHtml = fullImgSrc
          ? `<img class="msg-image" src="${escapeHtml(thumbImgSrc)}" data-full="${escapeHtml(fullImgSrc)}" data-download="${escapeHtml(m.downloadUrl || "")}" alt="Fotoğraf" loading="lazy" />`
          : "";
        const audioSrc = m.audioUrl || m.audioData;
        const audioHtml = audioSrc
          ? `<audio class="msg-audio" controls preload="metadata" src="${escapeHtml(audioSrc)}"></audio>`
          : "";
        let locHtml = "";
        if (m.location && typeof m.location.lat === "number" && typeof m.location.lng === "number") {
          const latStr = m.location.lat.toFixed(5);
          const lngStr = m.location.lng.toFixed(5);
          const mapsUrl = `https://www.google.com/maps?q=${m.location.lat},${m.location.lng}`;
          const titleLabel = m.location.live
            ? m.location.active
              ? '<span class="live-status-text"><span class="live-pulse-dot"></span>Canlı Konum (Aktif)</span>'
              : "Canlı Konum (Sona erdi)"
            : "Anlık Konum";
          const updatedInfo = m.location.updatedAt ? ` • ${formatTime(m.location.updatedAt)}` : "";
          locHtml = `
            <div class="loc-card">
              <div class="loc-card-title">${titleLabel}</div>
              <div class="loc-card-coords">${latStr}, ${lngStr}${updatedInfo}</div>
              <a class="loc-card-link" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Haritada Aç</a>
            </div>
          `;
        }
        const textHtml = m.text ? `<div class="msg-text">${linkifyText(m.text)}</div>` : "";
        const senderAvatarHtml = !isMe
          ? senderUser && senderUser.avatarData
            ? `<img class="msg-avatar" data-view-user="${escapeHtml(m.senderId)}" src="${escapeHtml(senderUser.avatarData)}" alt=""${senderRingStyle(senderUser)} />`
            : `<div class="msg-avatar" data-view-user="${escapeHtml(m.senderId)}"${senderRingStyle(senderUser)}>${escapeHtml(liveSenderName.charAt(0).toUpperCase())}</div>`
          : "";
        return `
          <div class="msg-row ${isMe ? "me" : "other"}">
            ${senderAvatarHtml}
            <div class="msg-bubble ${isMe ? "me" : "other"}"${customStyle}>
              ${senderHtml}
              ${imgHtml}
              ${audioHtml}
              ${locHtml}
              ${textHtml}
              <div class="msg-footer">
                ${delHtml}
                <span class="msg-time">${formatTime(m.timestamp)}</span>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    messagesContainer.querySelectorAll(".msg-image").forEach((imgEl) => {
      imgEl.addEventListener("click", () => {
        imageModalImg.src = imgEl.dataset.full || imgEl.src;
        const dl = imgEl.dataset.download;
        if (dl) {
          downloadImageBtn.href = dl;
          downloadImageBtn.classList.remove("hidden");
        } else {
          downloadImageBtn.classList.add("hidden");
        }
        imageModal.classList.remove("hidden");
        pushBackState("image-modal");
      });
    });

    messagesContainer.querySelectorAll("[data-view-user]").forEach((el) => {
      el.addEventListener("click", () => openUserProfileCard(el.dataset.viewUser));
    });

    messagesContainer.querySelectorAll("[data-del-msg]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Bu mesaj silinsin mi?")) return;
        const msgKey = btn.dataset.delMsg;
        const rowEl = btn.closest(".msg-row");
        if (rowEl) {
          rowEl.classList.add("deleting");
          await new Promise((r) => setTimeout(r, 180));
        }
        const targetMsg = data[msgKey];
        const fileIds = extractDriveFileIds(targetMsg);
        if (fileIds.length > 0) {
          await Promise.all(fileIds.map((fid) => deleteFromGoogleDrive(fid)));
        }
        await state.db.ref(`chats/${roomId}/messages/${msgKey}`).remove();
      });
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function senderRingStyle(senderUser) {
    return senderUser && isValidHexColor(senderUser.bannerColor)
      ? ` style="border-color:${senderUser.bannerColor};border-width:2px;cursor:pointer;"`
      : ` style="cursor:pointer;"`;
  }

  if (state.preloadedChats[roomId]) {
    renderRoomMessages(state.preloadedChats[roomId]);
  }

  state.chatRef = state.db.ref(`chats/${roomId}/messages`).limitToLast(100);
  state.chatRef.on("value", (snap) => {
    renderRoomMessages(snap.val() || {});
  });

  // Yazıyor... (Typing) dinleyicisi
  state.typingRef = state.db.ref(`chats/${roomId}/typing`);
  state.typingRef.on("value", (snap) => {
    const val = snap.val() || {};
    const typers = Object.entries(val)
      .filter(([uid, name]) => uid !== state.user.id && name)
      .map(([, name]) => name);

    if (typers.length > 0) {
      typingIndicator.innerHTML = `${escapeHtml(typers.join(", "))} yazıyor<span class="typing-dots"><span></span><span></span><span></span></span>`;
      typingIndicator.classList.remove("hidden");
    } else {
      typingIndicator.classList.add("hidden");
    }
  });
}

function cleanupActiveRoomListeners() {
  if (state.chatRef) {
    state.chatRef.off();
    state.chatRef = null;
  }
  if (state.typingRef) {
    state.typingRef.off();
    state.typingRef = null;
  }
  if (state.activeRoom && state.db && state.user) {
    state.db.ref(`chats/${state.activeRoom.id}/typing/${state.user.id}`).remove();
  }
  clearTimeout(state.typingTimeout);
  clearPendingPhoto();
  stopActiveRecording(true);
  clearPendingAudio();
  messageInput.value = "";
  resizeMessageInput();
  updateMicVisibility();
}

function resizeMessageInput() {
  if (!messageInput) return;
  messageInput.style.height = "auto";
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px";
}

function updateMicVisibility() {
  if (!micBtn || !messageInput) return;
  const isRecording = state.mediaRecorder && state.mediaRecorder.state === "recording";
  const hasText = messageInput.value.trim().length > 0;
  micBtn.classList.toggle("hidden", hasText && !isRecording);
}

function clearPendingAudio() {
  state.pendingAudioBlob = null;
  state.pendingAudioMime = "";
  state.pendingAudioData = "";
  if (state.pendingAudioPreviewUrl) {
    URL.revokeObjectURL(state.pendingAudioPreviewUrl);
    state.pendingAudioPreviewUrl = "";
  }
  audioPreviewPlayer.src = "";
  audioPreviewBar.classList.add("hidden");
}

function stopActiveRecording(discard = false) {
  clearInterval(state.recordingTimer);
  state.recordingTimer = null;
  if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
    if (discard) state.mediaRecorder.onstop = null;
    state.mediaRecorder.stop();
  }
  if (discard && state.audioStream) {
    state.audioStream.getTracks().forEach((t) => t.stop());
    state.audioStream = null;
  }
  if (discard) {
    state.mediaRecorder = null;
  }
  micBtn.classList.remove("mic-recording");
  micBtn.innerHTML = MIC_ICON_HTML;
}

function clearPendingPhoto() {
  state.pendingPhotoFile = null;
  if (state.pendingPhotoUrl) {
    URL.revokeObjectURL(state.pendingPhotoUrl);
    state.pendingPhotoUrl = "";
  }
  photoPreviewImg.src = "";
  photoPreviewName.textContent = "";
  photoPreviewBar.classList.add("hidden");
}

messageInput.addEventListener("input", () => {
  resizeMessageInput();
  updateMicVisibility();
  if (!state.activeRoom || !state.db || !state.user) return;
  const myTypingRef = state.db.ref(`chats/${state.activeRoom.id}/typing/${state.user.id}`);
  if (messageInput.value.trim()) {
    myTypingRef.set(getDisplayName(state.user));
    myTypingRef.onDisconnect().remove();
    clearTimeout(state.typingTimeout);
    state.typingTimeout = setTimeout(() => {
      myTypingRef.remove();
    }, 2500);
  } else {
    myTypingRef.remove();
  }
});

messageInput.addEventListener("keydown", (e) => {
  const isDesktop = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  if (e.key === "Enter" && !e.shiftKey && isDesktop) {
    e.preventDefault();
    if (typeof messageForm.requestSubmit === "function") {
      messageForm.requestSubmit();
    } else {
      messageForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  }
});

chatBackBtn.addEventListener("click", () => {
  closeActiveChatWithAnimation();
});

deleteChatBtn.addEventListener("click", async () => {
  if (!state.activeRoom) return;
  const label = state.activeRoom.isGroup
    ? "Ana Grup mesajları"
    : `${state.activeRoom.title} ile olan özel konuşma`;
  if (!confirm(`${label} kalıcı olarak silinsin mi?`)) return;

  const roomId = state.activeRoom.id;
  cleanupActiveRoomListeners();
  state.activeRoom = null;

  const msgsSnap = await state.db.ref(`chats/${roomId}/messages`).once("value");
  const msgs = msgsSnap.val() || {};
  const fileIds = Object.values(msgs).flatMap(extractDriveFileIds);
  await Promise.all(fileIds.map((fid) => deleteFromGoogleDrive(fid)));

  await state.db.ref(`chats/${roomId}`).remove();
  showView(mainView);
});

sendBtn.addEventListener("mousedown", (e) => {
  e.preventDefault();
});

sendBtn.addEventListener("touchend", (e) => {
  if (sendBtn.disabled) return;
  e.preventDefault();
  messageInput.focus({ preventScroll: true });
  if (typeof messageForm.requestSubmit === "function") {
    messageForm.requestSubmit();
  } else {
    messageForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }
});

messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!state.activeRoom) return;
  const text = messageInput.value.trim();
  const file = state.pendingPhotoFile;
  const audioBlob = state.pendingAudioBlob;
  const audioMime = state.pendingAudioMime;
  if (!text && !file && !audioBlob) {
    messageInput.focus({ preventScroll: true });
    return;
  }

  messageInput.value = "";
  resizeMessageInput();
  updateMicVisibility();
  messageInput.focus({ preventScroll: true });
  clearTimeout(state.typingTimeout);
  state.db.ref(`chats/${state.activeRoom.id}/typing/${state.user.id}`).remove();

  sendBtn.classList.remove("sending");
  void sendBtn.offsetWidth;
  sendBtn.classList.add("sending");

  if (!file && !audioBlob) {
    await state.db.ref(`chats/${state.activeRoom.id}/messages`).push({
      senderId: state.user.id,
      senderName: getDisplayName(state.user),
      text,
      timestamp: Date.now()
    });
    return;
  }

  clearPendingPhoto();
  clearPendingAudio();
  sendBtn.disabled = true;
  sendBtn.textContent = "Yükleniyor...";
  photoBtn.disabled = true;
  micBtn.disabled = true;
  try {
    const payload = {
      senderId: state.user.id,
      senderName: getDisplayName(state.user),
      text,
      timestamp: Date.now()
    };

    if (file) {
      if (state.driveConfig && state.driveConfig.url) {
        const uploaded = await uploadToGoogleDrive(file);
        payload.imageUrl = uploaded.url;
        payload.downloadUrl = uploaded.downloadUrl;
        payload.driveFileId = uploaded.id;
      } else {
        payload.imageData = await compressImageToBase64(file, 900, 0.72);
      }
    }

    if (audioBlob) {
      if (state.driveConfig && state.driveConfig.url) {
        const ext = audioMime.includes("mp4") ? "m4a" : audioMime.includes("ogg") ? "ogg" : "webm";
        const uploadedAudio = await uploadBlobToGoogleDrive(
          audioBlob,
          `agartha_ses_${Date.now()}.${ext}`,
          audioMime || "audio/mp4"
        );
        payload.audioUrl = uploadedAudio.downloadUrl;
        payload.audioDriveFileId = uploadedAudio.id;
      } else {
        payload.audioData = await blobToDataUrl(audioBlob);
      }
    }

    await state.db.ref(`chats/${state.activeRoom.id}/messages`).push(payload);
  } catch (err) {
    alert("Medya gönderilemedi: " + (err.message || "Hata"));
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Gönder";
    photoBtn.disabled = false;
    micBtn.disabled = false;
  }
});

photoBtn.addEventListener("click", () => {
  if (!state.activeRoom) return;
  photoInput.click();
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files && photoInput.files[0];
  photoInput.value = "";
  if (!file || !state.activeRoom) return;

  clearPendingPhoto();
  state.pendingPhotoFile = file;
  state.pendingPhotoUrl = URL.createObjectURL(file);
  photoPreviewImg.src = state.pendingPhotoUrl;
  photoPreviewName.textContent = file.name || "Seçilen fotoğraf";
  photoPreviewBar.classList.remove("hidden");
  messageInput.focus();
});

cancelPhotoBtn.addEventListener("click", clearPendingPhoto);
cancelAudioBtn.addEventListener("click", clearPendingAudio);

// Konum & Canlı Konum Paylaşımı
function stopLiveLocation() {
  if (state.liveLocWatchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(state.liveLocWatchId);
    state.liveLocWatchId = null;
  }
  if (state.liveLocRoomId && state.liveLocMsgKey && state.db) {
    state.db
      .ref(`chats/${state.liveLocRoomId}/messages/${state.liveLocMsgKey}/location`)
      .update({ active: false, updatedAt: Date.now() })
      .catch(() => {});
  }
  state.liveLocRoomId = null;
  state.liveLocMsgKey = null;
  if (liveLocBar) liveLocBar.classList.add("hidden");
}

if (locBtn && locationModal) {
  locBtn.addEventListener("click", () => {
    if (!state.activeRoom) return;
    locationModal.classList.remove("hidden");
    pushBackState("location-modal");
  });
}

if (closeLocBtn && locationModal) {
  closeLocBtn.addEventListener("click", () => {
    locationModal.classList.add("hidden");
  });
}

if (stopLiveLocBtn) {
  stopLiveLocBtn.addEventListener("click", stopLiveLocation);
}

if (sendStaticLocBtn) {
  sendStaticLocBtn.addEventListener("click", () => {
    if (!state.activeRoom) return;
    if (!navigator.geolocation) {
      alert("Bu tarayıcı konum paylaşımını desteklemiyor.");
      return;
    }
    sendStaticLocBtn.disabled = true;
    sendStaticLocBtn.textContent = "Konum alınıyor...";
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const now = Date.now();
        await state.db.ref(`chats/${state.activeRoom.id}/messages`).push({
          senderId: state.user.id,
          senderName: getDisplayName(state.user),
          text: "",
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            live: false,
            active: false,
            updatedAt: now
          },
          timestamp: now
        });
        sendStaticLocBtn.disabled = false;
        sendStaticLocBtn.textContent = "Anlık Konum Gönder";
        locationModal.classList.add("hidden");
      },
      (err) => {
        sendStaticLocBtn.disabled = false;
        sendStaticLocBtn.textContent = "Anlık Konum Gönder";
        alert("Konum alınamadı: " + (err.message || "İzin verilmedi"));
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  });
}

if (startLiveLocBtn) {
  startLiveLocBtn.addEventListener("click", () => {
    if (!state.activeRoom) return;
    if (!navigator.geolocation) {
      alert("Bu tarayıcı konum paylaşımını desteklemiyor.");
      return;
    }
    stopLiveLocation();
    startLiveLocBtn.disabled = true;
    startLiveLocBtn.textContent = "Başlatılıyor...";

    const roomId = state.activeRoom.id;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const now = Date.now();
        const msgRef = await state.db.ref(`chats/${roomId}/messages`).push({
          senderId: state.user.id,
          senderName: getDisplayName(state.user),
          text: "",
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            live: true,
            active: true,
            updatedAt: now
          },
          timestamp: now
        });

        state.liveLocRoomId = roomId;
        state.liveLocMsgKey = msgRef.key;
        state.lastLocUpdateAt = now;

        const locNodeRef = state.db.ref(`chats/${roomId}/messages/${msgRef.key}/location`);
        locNodeRef.onDisconnect().update({ active: false });

        state.liveLocWatchId = navigator.geolocation.watchPosition(
          (nextPos) => {
            const ts = Date.now();
            if (ts - state.lastLocUpdateAt < 3000) return;
            state.lastLocUpdateAt = ts;
            locNodeRef.update({
              lat: nextPos.coords.latitude,
              lng: nextPos.coords.longitude,
              active: true,
              updatedAt: ts
            });
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
        );

        if (liveLocBar) liveLocBar.classList.remove("hidden");
        startLiveLocBtn.disabled = false;
        startLiveLocBtn.textContent = "Canlı Konum Başlat";
        locationModal.classList.add("hidden");
      },
      (err) => {
        startLiveLocBtn.disabled = false;
        startLiveLocBtn.textContent = "Canlı Konum Başlat";
        alert("Canlı konum başlatılamadı: " + (err.message || "İzin verilmedi"));
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  });
}

micBtn.addEventListener("click", async () => {
  if (!state.activeRoom) return;
  if (state.mediaRecorder && state.mediaRecorder.state === "recording") {
    stopActiveRecording(false);
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
    alert("Bu tarayıcıda ses kaydı desteklenmiyor.");
    return;
  }

  try {
    clearPendingAudio();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.audioStream = stream;
    state.audioChunks = [];

    const mimeType = pickAudioMimeType();
    let recorder;
    try {
      recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
    } catch {
      recorder = new MediaRecorder(stream);
    }
    state.mediaRecorder = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) state.audioChunks.push(e.data);
    };

    recorder.onstop = async () => {
      if (state.audioStream) {
        state.audioStream.getTracks().forEach((t) => t.stop());
        state.audioStream = null;
      }
      state.mediaRecorder = null;
      const finalType = recorder.mimeType || mimeType || "audio/mp4";
      const blob = new Blob(state.audioChunks, { type: finalType });
      state.audioChunks = [];
      if (blob.size === 0) {
        alert("Ses kaydı boş oluştu, lütfen tekrar deneyin.");
        return;
      }
      state.pendingAudioBlob = blob;
      state.pendingAudioMime = finalType.split(";")[0].trim();
      state.pendingAudioPreviewUrl = URL.createObjectURL(blob);
      audioPreviewPlayer.src = state.pendingAudioPreviewUrl;
      audioPreviewPlayer.load();
      audioPreviewBar.classList.remove("hidden");
    };

    recorder.start(250);
    state.recordingSeconds = 0;
    micBtn.classList.add("mic-recording");
    micBtn.textContent = "00:00";

    state.recordingTimer = setInterval(() => {
      state.recordingSeconds += 1;
      const m = String(Math.floor(state.recordingSeconds / 60)).padStart(2, "0");
      const s = String(state.recordingSeconds % 60).padStart(2, "0");
      micBtn.textContent = `${m}:${s}`;
      if (state.recordingSeconds >= 60) {
        stopActiveRecording(false);
      }
    }, 1000);
  } catch (err) {
    stopActiveRecording(true);
    alert("Mikrofon hatası (" + (err.name || "") + "): " + (err.message || "İzin verilmedi"));
  }
});

closeImageBtn.addEventListener("click", () => {
  imageModal.classList.add("hidden");
  imageModalImg.src = "";
});

imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) {
    imageModal.classList.add("hidden");
    imageModalImg.src = "";
  }
});

// Profil Fotoğrafı ve Baloncuk Rengi Güncelleme
function updateColorPreview(hex) {
  if (isValidHexColor(hex)) {
    profileColorPreview.style.backgroundColor = hex;
    profileColorPreview.style.color = getContrastTextColor(hex);
  } else {
    profileColorPreview.style.backgroundColor = "";
    profileColorPreview.style.color = "";
  }
}

function updateProfilePreviewCard() {
  const nick = profileNicknameInput ? profileNicknameInput.value.trim() : getDisplayName(state.user);
  const emoji = profileEmojiInput ? profileEmojiInput.value.trim() : state.user.statusEmoji || "";
  const bio = profileBioInput ? profileBioInput.value.trim() : state.user.bio || "";
  const banner = profileBannerInput ? profileBannerInput.value : state.user.bannerColor || "#38bdf8";

  if (profileNamePreview) {
    const shownName = nick || state.user.name;
    profileNamePreview.textContent = `${emoji ? emoji + " " : ""}${shownName}`;
  }
  if (profileBioPreview) {
    profileBioPreview.textContent = bio || `@${state.user.name}`;
  }
  if (profileBannerPreview && isValidHexColor(banner)) {
    profileBannerPreview.style.background = `linear-gradient(135deg, ${banner}, #1e293b)`;
  }
  if (profileAvatarPreview && isValidHexColor(banner)) {
    profileAvatarPreview.style.borderColor = banner;
  }
}

function openProfileModal() {
  profileAvatarPreview.src = state.user.avatarData || "./icon-192.png";
  if (profileNicknameInput) profileNicknameInput.value = state.user.nickname || state.user.name || "";
  if (profileEmojiInput) profileEmojiInput.value = state.user.statusEmoji || "";
  if (profileBioInput) profileBioInput.value = state.user.bio || "";
  if (profileBannerInput) {
    profileBannerInput.value = isValidHexColor(state.user.bannerColor)
      ? state.user.bannerColor
      : "#38bdf8";
  }
  updateProfilePreviewCard();
  profileModal.classList.remove("hidden");
  pushBackState("profile-modal");
}

function openCustomizeModal() {
  if (profileColorInput && profileColorPreview) {
    const currentHex = isValidHexColor(state.user.bubbleColor)
      ? state.user.bubbleColor
      : "#1d4ed8";
    profileColorInput.value = currentHex;
    if (profileColorHex) profileColorHex.value = currentHex;
    updateColorPreview(state.user.bubbleColor || "");
  }
  if (profileBgPreview) {
    if (state.user.chatBgData) {
      profileBgPreview.style.backgroundImage = `url("${state.user.chatBgData}")`;
      profileBgPreview.classList.remove("hidden");
    } else {
      profileBgPreview.style.backgroundImage = "";
      profileBgPreview.classList.add("hidden");
    }
  }
  if (customizeModal) {
    customizeModal.classList.remove("hidden");
    pushBackState("customize-modal");
  }
}

function openUserProfileCard(uid) {
  const u = state.usersCache[uid];
  if (!u || !userProfileModal) return;
  const banner = isValidHexColor(u.bannerColor) ? u.bannerColor : "#38bdf8";
  const dispName = getDisplayName(u);
  viewUserBanner.style.background = `linear-gradient(135deg, ${banner}, #1e293b)`;
  viewUserAvatar.src = u.avatarData || "./icon-192.png";
  viewUserAvatar.style.borderColor = banner;
  viewUserName.textContent = `${u.statusEmoji ? u.statusEmoji + " " : ""}${dispName}`;
  const statusStr = u.online
    ? "Çevrimiçi"
    : u.lastSeen
    ? `Son görülme ${formatTime(u.lastSeen)}`
    : "Üye";
  viewUserStatus.textContent = `@${u.name || ""} • ${statusStr}`;
  viewUserBio.textContent = u.bio || "Durum yazısı eklenmemiş.";
  userProfileModal.classList.remove("hidden");
  pushBackState("user-profile-modal");
}

if (closeUserProfileBtn) {
  closeUserProfileBtn.addEventListener("click", () => {
    userProfileModal.classList.add("hidden");
  });
}

if (chatRoomHeaderInfo) {
  chatRoomHeaderInfo.addEventListener("click", (e) => {
    if (e.target.closest("#chat-back-btn")) return;
    if (state.activeRoom && !state.activeRoom.isGroup && state.activeRoom.otherId) {
      openUserProfileCard(state.activeRoom.otherId);
    }
  });
}

if (profileNicknameInput) profileNicknameInput.addEventListener("input", updateProfilePreviewCard);
if (profileEmojiInput) profileEmojiInput.addEventListener("input", updateProfilePreviewCard);
if (profileBioInput) profileBioInput.addEventListener("input", updateProfilePreviewCard);
if (profileBannerInput) profileBannerInput.addEventListener("input", updateProfilePreviewCard);

if (emojiPresets) {
  emojiPresets.querySelectorAll("[data-emoji]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (profileEmojiInput) profileEmojiInput.value = btn.dataset.emoji;
      updateProfilePreviewCard();
    });
  });
}

if (saveProfileDetailsBtn) {
  saveProfileDetailsBtn.addEventListener("click", async () => {
    if (!state.user) return;
    const nickname = profileNicknameInput ? profileNicknameInput.value.trim().slice(0, 24) : "";
    const statusEmoji = profileEmojiInput ? profileEmojiInput.value.trim().slice(0, 4) : "";
    const bio = profileBioInput ? profileBioInput.value.trim().slice(0, 80) : "";
    const bannerColor =
      profileBannerInput && isValidHexColor(profileBannerInput.value)
        ? profileBannerInput.value
        : "";
    await state.db.ref("users/" + state.user.id).update({
      nickname,
      statusEmoji,
      bio,
      bannerColor
    });
    state.user.nickname = nickname;
    state.user.statusEmoji = statusEmoji;
    state.user.bio = bio;
    state.user.bannerColor = bannerColor;
    updateHeaderIdentity();
    alert("Profil özelleştirmelerin kaydedildi!");
  });
}

if (openSettingsBtn && settingsModal) {
  openSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("hidden");
    pushBackState("settings-modal");
  });
}

if (closeSettingsBtn && settingsModal) {
  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
  });
}

if (settingsModal) {
  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.add("hidden");
    }
  });
}

if (applyCustomThemeBtn && customThemeInput) {
  applyCustomThemeBtn.addEventListener("click", () => {
    const hex = customThemeInput.value;
    const bgHex = customBgInput ? customBgInput.value : "#080812";
    if (!isValidHexColor(hex)) return;
    applyAppTheme("custom", hex, bgHex);
    if (state.db && state.user) {
      state.db.ref("users/" + state.user.id + "/appTheme").set({ id: "custom", customHex: hex, customBgHex: bgHex });
    }
  });
}

if (randomThemeBtn) {
  randomThemeBtn.addEventListener("click", () => {
    const hue = Math.floor(Math.random() * 360);
    const accentHex = hslToHex(hue, 95, 58);
    const bgHex = hslToHex((hue + 190) % 360, 55, 7);
    if (customThemeInput) customThemeInput.value = accentHex;
    if (customBgInput) customBgInput.value = bgHex;
    applyAppTheme("custom", accentHex, bgHex);
    if (state.db && state.user) {
      state.db.ref("users/" + state.user.id + "/appTheme").set({ id: "custom", customHex: accentHex, customBgHex: bgHex });
    }
  });
}

if (profileTrigger) {
  profileTrigger.addEventListener("click", openProfileModal);
}

if (openProfileBtn) {
  openProfileBtn.addEventListener("click", () => {
    if (settingsModal) settingsModal.classList.add("hidden");
    openProfileModal();
  });
}

if (openCustomizeBtn) {
  openCustomizeBtn.addEventListener("click", () => {
    if (settingsModal) settingsModal.classList.add("hidden");
    openCustomizeModal();
  });
}

if (closeCustomizeBtn && customizeModal) {
  closeCustomizeBtn.addEventListener("click", () => {
    customizeModal.classList.add("hidden");
  });
}

if (customizeModal) {
  customizeModal.addEventListener("click", (e) => {
    if (e.target === customizeModal) {
      customizeModal.classList.add("hidden");
    }
  });
}

if (profileColorInput) {
  profileColorInput.addEventListener("input", () => {
    if (profileColorHex) profileColorHex.value = profileColorInput.value;
    updateColorPreview(profileColorInput.value);
  });
}

if (profileColorHex) {
  profileColorHex.addEventListener("input", () => {
    let val = profileColorHex.value.trim();
    if (val && !val.startsWith("#")) val = "#" + val;
    if (isValidHexColor(val)) {
      if (profileColorInput) profileColorInput.value = val;
      updateColorPreview(val);
    }
  });
}

if (colorPresets) {
  colorPresets.querySelectorAll("[data-color]").forEach((swatch) => {
    swatch.addEventListener("click", () => {
      const c = swatch.dataset.color;
      if (profileColorInput) profileColorInput.value = c;
      if (profileColorHex) profileColorHex.value = c;
      updateColorPreview(c);
    });
  });
}

if (saveColorBtn) {
  saveColorBtn.addEventListener("click", async () => {
    if (!state.user || !profileColorInput) return;
    let color = profileColorHex ? profileColorHex.value.trim() : profileColorInput.value;
    if (color && !color.startsWith("#")) color = "#" + color;
    if (!isValidHexColor(color)) color = profileColorInput.value;
    if (!isValidHexColor(color)) return;
    await state.db.ref("users/" + state.user.id + "/bubbleColor").set(color);
    state.user.bubbleColor = color;
    if (customizeModal) customizeModal.classList.add("hidden");
  });
}

if (resetColorBtn) {
  resetColorBtn.addEventListener("click", async () => {
    if (!state.user) return;
    await state.db.ref("users/" + state.user.id + "/bubbleColor").remove();
    state.user.bubbleColor = "";
    if (profileColorInput) profileColorInput.value = "#1d4ed8";
    if (profileColorHex) profileColorHex.value = "#1d4ed8";
    updateColorPreview("");
    if (customizeModal) customizeModal.classList.add("hidden");
  });
}

if (profileBgBtn && profileBgInput) {
  profileBgBtn.addEventListener("click", () => profileBgInput.click());
  profileBgInput.addEventListener("change", async () => {
    const file = profileBgInput.files && profileBgInput.files[0];
    profileBgInput.value = "";
    if (!file || !state.user) return;
    profileBgBtn.disabled = true;
    profileBgBtn.textContent = "Kaydediliyor...";
    try {
      const chatBgData = await compressImageToBase64(file, 720, 0.7);
      await state.db.ref("users/" + state.user.id + "/chatBgData").set(chatBgData);
      state.user.chatBgData = chatBgData;
      applyChatBackground(chatBgData);
      if (profileBgPreview) {
        profileBgPreview.style.backgroundImage = `url("${chatBgData}")`;
        profileBgPreview.classList.remove("hidden");
      }
    } catch {
      alert("Arka plan yüklenemedi.");
    } finally {
      profileBgBtn.disabled = false;
      profileBgBtn.textContent = "Arka Plan Seç";
    }
  });
}

if (resetBgBtn) {
  resetBgBtn.addEventListener("click", async () => {
    if (!state.user) return;
    await state.db.ref("users/" + state.user.id + "/chatBgData").remove();
    state.user.chatBgData = "";
    applyChatBackground("");
    if (profileBgPreview) {
      profileBgPreview.style.backgroundImage = "";
      profileBgPreview.classList.add("hidden");
    }
  });
}

closeProfileBtn.addEventListener("click", () => {
  profileModal.classList.add("hidden");
});

profileAvatarBtn.addEventListener("click", () => profileAvatarInput.click());

profileAvatarInput.addEventListener("change", async () => {
  const file = profileAvatarInput.files && profileAvatarInput.files[0];
  profileAvatarInput.value = "";
  if (!file || !state.user) return;
  try {
    const avatarData = await compressImageToBase64(file, 180, 0.75);
    await state.db.ref("users/" + state.user.id + "/avatarData").set(avatarData);
    state.user.avatarData = avatarData;
    headerAvatar.src = avatarData;
    profileAvatarPreview.src = avatarData;
  } catch {
    alert("Profil fotoğrafı güncellenemedi.");
  }
});

quickPlaceBtn.addEventListener("click", async () => {
  if (!state.activeRoom) return;
  const name = prompt("Gittiğiniz mekanın adı nedir?");
  if (!name || !name.trim()) return;
  const area = prompt("Semt / Şehir? (Örn. Kadıköy, İstanbul)") || "";

  const now = Date.now();
  await state.db.ref("places").push({
    name: name.trim(),
    area: area.trim(),
    category: "Diğer",
    note: `${state.activeRoom.title} sohbetinden paylaşıldı`,
    addedBy: state.user.id,
    addedByName: state.user.name,
    timestamp: now
  });

  await state.db.ref(`chats/${state.activeRoom.id}/messages`).push({
    senderId: state.user.id,
    senderName: getDisplayName(state.user),
    text: `Mekan paylaştı: ${name.trim()}${area.trim() ? " (" + area.trim() + ")" : ""}`,
    timestamp: now
  });
});

// Mekanlar Sekmesi
placeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = placeNameInput.value.trim();
  const area = placeAreaInput.value.trim();
  const category = placeCategoryInput.value;
  const note = placeNoteInput.value.trim();
  if (!name || !area) return;

  await state.db.ref("places").push({
    name,
    area,
    category,
    note,
    addedBy: state.user.id,
    addedByName: state.user.name,
    timestamp: Date.now()
  });

  placeNameInput.value = "";
  placeAreaInput.value = "";
  placeNoteInput.value = "";
});

function listenPlaces() {
  state.db.ref("places").limitToLast(50).on("value", (snap) => {
    const data = snap.val() || {};
    const entries = Object.entries(data).sort(
      (a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0)
    );

    if (entries.length === 0) {
      placesList.innerHTML = `<div class="empty-hint">Henüz mekan eklenmemiş.</div>`;
      return;
    }

    placesList.innerHTML = entries
      .map(([key, p]) => {
        const canDel = state.user.isAdmin || p.addedBy === state.user.id;
        const delBtn = canDel
          ? `<button class="icon-btn danger" data-del-place="${escapeHtml(key)}">Sil</button>`
          : "";
        const cat = p.category ? `${escapeHtml(p.category)} • ` : "";
        return `
        <div class="place-card">
          <div class="place-header">
            <div>
              <div class="place-title">${escapeHtml(p.name)}</div>
              <div class="place-meta">${cat}${escapeHtml(p.area)} • ${escapeHtml(p.addedByName || "")}</div>
            </div>
            ${delBtn}
          </div>
          ${p.note ? `<div class="place-note">${escapeHtml(p.note)}</div>` : ""}
        </div>
      `;
      })
      .join("");

    placesList.querySelectorAll("[data-del-place]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!confirm("Bu mekan kaydı silinsin mi?")) return;
        state.db.ref("places/" + btn.dataset.delPlace).remove();
      });
    });
  });
}

// AI Önerileri Sekmesi
function listenAiRecommendations() {
  state.db.ref("recommendations").limitToLast(30).on("value", (snap) => {
    const data = snap.val() || {};
    const list = Object.values(data).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (list.length === 0) {
      aiList.innerHTML = `<div class="empty-hint">Henüz AI önerisi yok. Bilgisayarınız analiz yaptığında öneriler burada görünecek.</div>`;
      return;
    }

    aiList.innerHTML = list
      .map(
        (r) => `
        <div class="ai-card">
          <div class="place-title">${escapeHtml(r.title || r.name)}</div>
          <div class="place-meta">${escapeHtml(r.area || "Öneri")}</div>
          ${r.reason ? `<div class="place-note">${escapeHtml(r.reason)}</div>` : ""}
        </div>
      `
      )
      .join("");
  });
}

// Admin Paneli
openAdminBtn.addEventListener("click", () => {
  if (settingsModal) settingsModal.classList.add("hidden");
  adminModal.classList.remove("hidden");
  pushBackState("admin-modal");
  driveUrlInput.value = state.driveConfig.url || "";
  driveSecretInput.value = state.driveConfig.secret || "";
  listenInvites();
  renderAdminUsers(state.usersCache);
});

driveConfigForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = driveUrlInput.value.trim();
  const secret = driveSecretInput.value.trim();
  await state.db.ref("config/drive").set({ url, secret });
  alert("Google Drive ayarı kaydedildi.");
});

closeAdminBtn.addEventListener("click", () => {
  adminModal.classList.add("hidden");
  if (state.invitesRef) {
    state.invitesRef.off();
    state.invitesRef = null;
  }
});

inviteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const label = inviteLabelInput.value.trim();
  if (!label) return;

  const code = "AGAR-" + Math.floor(1000 + Math.random() * 9000);
  await state.db.ref("invites/" + code).set({
    label,
    active: true,
    createdAt: Date.now()
  });

  inviteLabelInput.value = "";
});

function listenInvites() {
  if (state.invitesRef) {
    state.invitesRef.off();
  }
  state.invitesRef = state.db.ref("invites");
  state.invitesRef.on("value", (snap) => {
    const data = snap.val() || {};
    const entries = Object.entries(data).sort(
      (a, b) => (b[1].createdAt || 0) - (a[1].createdAt || 0)
    );

    if (entries.length === 0) {
      invitesList.innerHTML = `<div class="empty-hint">Henüz davet kodu yok.</div>`;
      return;
    }

    invitesList.innerHTML = entries
      .map(([code, inv]) => {
        const status = inv.active
          ? `<span class="badge-active">Kullanılabilir</span>`
          : `<span class="badge-revoked">Kullanıldı (${escapeHtml(inv.usedBy || "-")})</span>`;
        return `
          <div class="admin-row">
            <div>
              <div class="place-title">${escapeHtml(code)}</div>
              <div class="user-sub">${escapeHtml(inv.label)} • ${status}</div>
            </div>
            <div class="admin-row-actions">
              <button class="icon-btn" data-copy="${escapeHtml(code)}">Kopyala</button>
              <button class="icon-btn danger" data-del-invite="${escapeHtml(code)}">Sil</button>
            </div>
          </div>
        `;
      })
      .join("");

    invitesList.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        navigator.clipboard?.writeText(btn.dataset.copy);
        btn.textContent = "Kopyalandı";
        setTimeout(() => (btn.textContent = "Kopyala"), 1200);
      });
    });

    invitesList.querySelectorAll("[data-del-invite]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.db.ref("invites/" + btn.dataset.delInvite).remove();
      });
    });
  });
}

function renderAdminUsers(users) {
  const entries = Object.entries(users);
  adminUsersList.innerHTML = entries
    .map(([id, u]) => {
      const isSelf = id === state.user.id;
      const badge =
        u.active !== false
          ? `<span class="badge-active">Aktif</span>`
          : `<span class="badge-revoked">Engelli</span>`;
      const actionBtn = isSelf
        ? ""
        : `<button class="icon-btn" data-toggle-admin="${escapeHtml(id)}" data-next-admin="${!u.isAdmin}">
            ${u.isAdmin ? "Adminliği Al" : "Admin Yap"}
          </button>
          <button class="icon-btn ${u.active !== false ? "danger" : ""}" data-toggle-user="${escapeHtml(id)}" data-next="${u.active === false}">
            ${u.active !== false ? "Engelle" : "Aktif Et"}
          </button>
          <button class="icon-btn danger" data-delete-user="${escapeHtml(id)}" data-user-name="${escapeHtml(u.name)}">
            Sil
          </button>`;

      return `
        <div class="admin-row">
          <div>
            <div class="place-title">${escapeHtml(getDisplayName(u))} <span class="user-sub">(@${escapeHtml(u.name)})</span></div>
            <div class="user-sub">${u.isAdmin ? "Admin" : "Üye"} • ${badge}</div>
          </div>
          <div class="admin-row-actions">${actionBtn}</div>
        </div>
      `;
    })
    .join("");

  adminUsersList.querySelectorAll("[data-toggle-user]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const uid = btn.dataset.toggleUser;
      const nextActive = btn.dataset.next === "true";
      state.db.ref("users/" + uid + "/active").set(nextActive);
    });
  });

  adminUsersList.querySelectorAll("[data-toggle-admin]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const uid = btn.dataset.toggleAdmin;
      const nextAdmin = btn.dataset.nextAdmin === "true";
      state.db.ref("users/" + uid + "/isAdmin").set(nextAdmin);
    });
  });

  adminUsersList.querySelectorAll("[data-delete-user]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const uid = btn.dataset.deleteUser;
      const uname = btn.dataset.userName || "Bu kullanıcı";
      if (!confirm(`${uname} ve kullandığı davet kodu tamamen silinsin mi? (Açık oturumu anında kapanır)`)) return;
      const userRecord = state.usersCache[uid];
      if (userRecord && userRecord.inviteCode) {
        await state.db.ref("invites/" + userRecord.inviteCode).remove();
      }
      await state.db.ref("users/" + uid).remove();
    });
  });
}

init();
