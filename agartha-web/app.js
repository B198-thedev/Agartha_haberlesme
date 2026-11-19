// Service Worker (PWA) kaydı & Otomatik Güncelleme Bildirimi
const updateBanner = document.getElementById("update-banner");
const updateBannerText = document.getElementById("update-banner-text");

function showUpdateBanner(msg) {
  if (updateBannerText && msg) updateBannerText.textContent = msg;
  if (updateBanner) updateBanner.classList.remove("hidden");
}

function hideUpdateBanner() {
  if (updateBanner) updateBanner.classList.add("hidden");
}

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  let hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) {
      hadController = true;
      return;
    }
    if (refreshing) return;
    refreshing = true;
    showUpdateBanner("Uygulama güncellendi, yenileniyor...");
    setTimeout(() => location.reload(), 900);
  });

  navigator.serviceWorker
    .register("./sw.js", { updateViaCache: "none" })
    .then((reg) => {
      if (reg.waiting && hadController) {
        showUpdateBanner("Uygulama güncelleniyor, lütfen bekleyin...");
      }

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        if (hadController) {
          showUpdateBanner("Uygulama güncelleniyor, lütfen bekleyin...");
        }
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && hadController) {
            showUpdateBanner("Uygulama güncellendi, yenileniyor...");
          } else if (newWorker.state === "redundant" && !refreshing) {
            hideUpdateBanner();
          }
        });
      });

      setInterval(() => reg.update().catch(() => {}), 60000);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          reg.update().catch(() => {});
        }
      });
    })
    .catch(() => {});
}

const SESSION_KEY = "agartha_session_v1";
const THEME_STORAGE_KEY = "agartha_theme_v1";
const SOUND_STORAGE_KEY = "agartha_sound_v1";

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
  readByRef: null,
  deliveredByRef: null,
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
  turnConfig: { apiUrl: "" },
  mainGroupInfo: { name: "Ana Grup", description: "Tüm yetkili arkadaşlar", avatarData: "" },
  pendingRegAvatar: "",
  pendingPhotoFile: null,
  pendingPhotoUrl: "",
  pendingVideoFile: null,
  pendingVideoUrl: "",
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
  preloadedChats: {},
  chatSearchQuery: "",
  chatSearchMatches: [],
  chatSearchIndex: -1,
  replyTo: null,
  roomReadBy: {},
  roomDeliveredBy: {},
  lastRenderedMsgKey: null,
  soundStyle: localStorage.getItem(SOUND_STORAGE_KEY) || "chime",
  audioCtx: null,
  activeCall: null,
  ringtoneInterval: null,
  incomingCallRef: null,
  e2eeKeyPair: null,
  e2eePubJwk: null,
  e2eeGroupKeys: {},
  e2eeActiveGroupKeyId: "",
  mainGroupKeysSnap: {},
  decryptedCache: {},
  pendingLoginSecret: ""
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
const soundStyleSelect = document.getElementById("sound-style-select");
const openAdminBtn = document.getElementById("open-admin-btn");
const logoutBtn = document.getElementById("logout-btn");
const themeGrid = document.getElementById("theme-grid");
const customThemeInput = document.getElementById("custom-theme-input");
const customBgInput = document.getElementById("custom-bg-input");
const applyCustomThemeBtn = document.getElementById("apply-custom-theme-btn");
const randomThemeBtn = document.getElementById("random-theme-btn");

const openMainGroupBtn = document.getElementById("open-main-group-btn");
const mainGroupAvatar = document.getElementById("main-group-avatar");
const mainGroupTitle = document.getElementById("main-group-title");
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
const chatSearchBtn = document.getElementById("chat-search-btn");
const chatSearchBar = document.getElementById("chat-search-bar");
const chatSearchInput = document.getElementById("chat-search-input");
const chatSearchCount = document.getElementById("chat-search-count");
const chatSearchPrev = document.getElementById("chat-search-prev");
const chatSearchNext = document.getElementById("chat-search-next");
const chatSearchClose = document.getElementById("chat-search-close");
const voiceCallBtn = document.getElementById("voice-call-btn");
const groupSettingsBtn = document.getElementById("group-settings-btn");
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
const videoPreviewBar = document.getElementById("video-preview-bar");
const videoPreviewPlayer = document.getElementById("video-preview-player");
const videoPreviewName = document.getElementById("video-preview-name");
const cancelVideoBtn = document.getElementById("cancel-video-btn");
const micBtn = document.getElementById("mic-btn");
const audioPreviewBar = document.getElementById("audio-preview-bar");
const audioPreviewPlayer = document.getElementById("audio-preview-player");
const cancelAudioBtn = document.getElementById("cancel-audio-btn");
const locBtn = document.getElementById("loc-btn");
const attachPlusBtn = document.getElementById("attach-plus-btn");
const attachMenu = document.getElementById("attach-menu");
const liveLocBar = document.getElementById("live-loc-bar");
const stopLiveLocBtn = document.getElementById("stop-live-loc-btn");
const locationModal = document.getElementById("location-modal");
const closeLocBtn = document.getElementById("close-loc-btn");
const sendStaticLocBtn = document.getElementById("send-static-loc-btn");
const startLiveLocBtn = document.getElementById("start-live-loc-btn");
const replyPreviewBar = document.getElementById("reply-preview-bar");
const replyPreviewSender = document.getElementById("reply-preview-sender");
const replyPreviewText = document.getElementById("reply-preview-text");
const cancelReplyBtn = document.getElementById("cancel-reply-btn");

const callModal = document.getElementById("call-modal");
const callTimerEl = document.getElementById("call-timer");
const callPeerAvatar = document.getElementById("call-peer-avatar");
const callPeerName = document.getElementById("call-peer-name");
const callStatusText = document.getElementById("call-status-text");
const callIncomingControls = document.getElementById("call-incoming-controls");
const callActiveControls = document.getElementById("call-active-controls");
const callAcceptBtn = document.getElementById("call-accept-btn");
const callRejectBtn = document.getElementById("call-reject-btn");
const callMuteBtn = document.getElementById("call-mute-btn");
const callHangupBtn = document.getElementById("call-hangup-btn");
const remoteCallAudio = document.getElementById("remote-call-audio");

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
const bgTargetRoomSelect = document.getElementById("bg-target-room");
const bgPatternSelect = document.getElementById("bg-pattern-select");
const bgBlurRange = document.getElementById("bg-blur-range");
const bgBlurValue = document.getElementById("bg-blur-value");
const bgBrightRange = document.getElementById("bg-bright-range");
const bgBrightValue = document.getElementById("bg-bright-value");
const prefBubbleStyleSelect = document.getElementById("pref-bubble-style");
const prefFontSizeSelect = document.getElementById("pref-font-size");
const prefFontFamilySelect = document.getElementById("pref-font-family");
const prefDensitySelect = document.getElementById("pref-density");
const prefAnimModeSelect = document.getElementById("pref-anim-mode");
const prefHapticToggle = document.getElementById("pref-haptic-toggle");
const prefReactionPresetSelect = document.getElementById("pref-reaction-preset");
const prefReactionCustomInput = document.getElementById("pref-reaction-custom");
const hideReadToggle = document.getElementById("hide-read-toggle");

const userProfileModal = document.getElementById("user-profile-modal");
const closeUserProfileBtn = document.getElementById("close-user-profile-btn");
const viewUserBanner = document.getElementById("view-user-banner");
const viewUserAvatar = document.getElementById("view-user-avatar");
const viewUserName = document.getElementById("view-user-name");
const viewUserStatus = document.getElementById("view-user-status");
const viewUserBio = document.getElementById("view-user-bio");

const groupSettingsModal = document.getElementById("group-settings-modal");
const closeGroupSettingsBtn = document.getElementById("close-group-settings-btn");
const groupAvatarPreview = document.getElementById("group-avatar-preview");
const groupSettingsSubtitle = document.getElementById("group-settings-subtitle");
const groupAvatarInput = document.getElementById("group-avatar-input");
const groupAvatarBtn = document.getElementById("group-avatar-btn");
const groupAvatarRemoveBtn = document.getElementById("group-avatar-remove-btn");
const groupAvatarControls = document.getElementById("group-avatar-controls");
const groupInfoEditCard = document.getElementById("group-info-edit-card");
const groupNameInput = document.getElementById("group-name-input");
const groupDescInput = document.getElementById("group-desc-input");
const saveGroupInfoBtn = document.getElementById("save-group-info-btn");
const groupMembersLabel = document.getElementById("group-members-label");
const groupMembersList = document.getElementById("group-members-list");

const avatarCropModal = document.getElementById("avatar-crop-modal");
const cropModalTitle = document.getElementById("crop-modal-title");
const closeCropBtn = document.getElementById("close-crop-btn");
const cropCanvas = document.getElementById("crop-canvas");
const cropZoomRange = document.getElementById("crop-zoom-range");
const cropZoomValue = document.getElementById("crop-zoom-value");
const cropRotateBtn = document.getElementById("crop-rotate-btn");
const cropResetBtn = document.getElementById("crop-reset-btn");
const cropSaveBtn = document.getElementById("crop-save-btn");

const adminModal = document.getElementById("admin-modal");
const closeAdminBtn = document.getElementById("close-admin-btn");
const inviteForm = document.getElementById("invite-form");
const inviteLabelInput = document.getElementById("invite-label");
const invitesList = document.getElementById("invites-list");
const adminUsersList = document.getElementById("admin-users-list");
const driveConfigForm = document.getElementById("drive-config-form");
const driveUrlInput = document.getElementById("drive-url-input");
const driveSecretInput = document.getElementById("drive-secret-input");
const turnConfigForm = document.getElementById("turn-config-form");
const turnApiUrlInput = document.getElementById("turn-api-url-input");

const authAnnouncementsBtn = document.getElementById("auth-announcements-btn");
const homeAnnouncementsBtn = document.getElementById("home-announcements-btn");
const homeAnnouncementVersion = document.getElementById("home-announcement-version");
const homeAnnouncementSummary = document.getElementById("home-announcement-summary");
const openAnnouncementsBtn = document.getElementById("open-announcements-btn");
const announcementsModal = document.getElementById("announcements-modal");
const closeAnnouncementsBtn = document.getElementById("close-announcements-btn");
const announcementsModalVer = document.getElementById("announcements-modal-ver");
const adminAnnouncementCard = document.getElementById("admin-announcement-card");
const announcementForm = document.getElementById("announcement-form");
const announcementTitleInput = document.getElementById("announcement-title-input");
const announcementBodyInput = document.getElementById("announcement-body-input");
const customAnnouncementsSection = document.getElementById("custom-announcements-section");
const customAnnouncementsList = document.getElementById("custom-announcements-list");
const changelogSectionLabel = document.getElementById("changelog-section-label");
const changelogSearchInput = document.getElementById("changelog-search-input");
const changelogList = document.getElementById("changelog-list");

const MIC_ICON_HTML =
  '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-3 0h6"/></svg>';

const SINGLE_CHECK_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';
const DOUBLE_CHECK_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 13l4 4L15 8"/><path d="M9 15l2.5 2.5L22 7"/></svg>';

function ensureAudioContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!state.audioCtx) {
    state.audioCtx = new Ctx();
  }
  if (state.audioCtx.state === "suspended") {
    state.audioCtx.resume().catch(() => {});
  }
  return state.audioCtx;
}

document.addEventListener("pointerdown", () => ensureAudioContext(), { once: true, passive: true });

// Klavye açıldığında mesaj kutusunun klavyenin altında kalmasını önle
function syncVisualViewportHeight() {
  if (window.visualViewport) {
    document.documentElement.style.setProperty(
      "--app-height",
      window.visualViewport.height + "px"
    );
    window.scrollTo(0, 0);
  }
}

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () => {
    syncVisualViewportHeight();
    if (chatView && chatView.classList.contains("active") && messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
  window.visualViewport.addEventListener("scroll", syncVisualViewportHeight);
  syncVisualViewportHeight();
}

function playTone(ctx, freq, startOffset, duration, type = "sine", gainPeak = 0.08) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startOffset);
  gain.gain.exponentialRampToValueAtTime(gainPeak, ctx.currentTime + startOffset + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startOffset + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startOffset);
  osc.stop(ctx.currentTime + startOffset + duration + 0.02);
}

function playMessageSound(direction = "receive") {
  const style = state.soundStyle || "chime";
  if (style === "off") return;
  const ctx = ensureAudioContext();
  if (!ctx) return;

  try {
    if (style === "chime") {
      if (direction === "send") {
        playTone(ctx, 520, 0, 0.09, "sine", 0.05);
        playTone(ctx, 680, 0.05, 0.11, "sine", 0.05);
      } else {
        playTone(ctx, 587, 0, 0.12, "sine", 0.08);
        playTone(ctx, 880, 0.08, 0.18, "sine", 0.08);
      }
    } else if (style === "pop") {
      if (direction === "send") {
        playTone(ctx, 420, 0, 0.07, "triangle", 0.07);
      } else {
        playTone(ctx, 640, 0, 0.09, "triangle", 0.08);
        playTone(ctx, 780, 0.05, 0.09, "triangle", 0.06);
      }
    } else if (style === "crystal") {
      if (direction === "send") {
        playTone(ctx, 740, 0, 0.1, "sine", 0.045);
      } else {
        playTone(ctx, 987, 0, 0.16, "sine", 0.06);
        playTone(ctx, 1318, 0.07, 0.22, "sine", 0.06);
      }
    } else if (style === "retro") {
      if (direction === "send") {
        playTone(ctx, 440, 0, 0.06, "square", 0.03);
      } else {
        playTone(ctx, 523, 0, 0.07, "square", 0.035);
        playTone(ctx, 784, 0.07, 0.09, "square", 0.035);
      }
    }
  } catch {
    // Ses oynatılamazsa sessiz geç
  }
}

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

function sanitizeHttpUrl(rawUrl) {
  const s = String(rawUrl || "").trim();
  if (!s) return "";
  try {
    const parsed = new URL(s);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.href;
    }
  } catch {}
  return "";
}

function sanitizeMediaSrc(rawSrc, kind = "image") {
  const s = String(rawSrc || "").trim();
  if (!s) return "";
  if (s === "./icon-192.png" || s === "./icon-512.png") return s;
  if (kind === "image" && /^data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(s)) {
    return s;
  }
  if (
    kind === "audio" &&
    /^data:audio\/(mp4|webm|ogg|mpeg|wav|aac|x-m4a)(?:;[a-z0-9=+-]+)?;base64,[A-Za-z0-9+/=]+$/i.test(s)
  ) {
    return s;
  }
  if (
    kind === "video" &&
    /^data:video\/(mp4|webm|ogg|quicktime|3gpp|x-m4v)(?:;[a-z0-9=+-]+)?;base64,[A-Za-z0-9+/=]+$/i.test(s)
  ) {
    return s;
  }
  return sanitizeHttpUrl(s);
}

function sanitizeChatBgData(rawVal) {
  const s = String(rawVal || "").trim();
  if (!s) return "";
  if (/^data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(s)) {
    return s;
  }
  if (/["'()\\]/.test(s)) return "";
  return sanitizeHttpUrl(s);
}

function sanitizeDriveFileId(id) {
  const s = String(id || "").trim();
  return /^[a-zA-Z0-9_-]{10,120}$/.test(s) ? s : "";
}

function linkifyText(str) {
  const urlSplitRe = /(https?:\/\/[^\s<]+)/g;
  return String(str || "")
    .split(urlSplitRe)
    .map((part) => {
      if (/^https?:\/\/[^\s<]+$/.test(part)) {
        const cleanUrl = sanitizeHttpUrl(part);
        if (cleanUrl) {
          const safeUrl = escapeHtml(cleanUrl);
          return `<a class="msg-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(part)}</a>`;
        }
      }
      return escapeHtml(part);
    })
    .join("");
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightRawSegment(segment, query) {
  const re = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const pieces = segment.split(re);
  return pieces
    .map((p, idx) => (idx % 2 === 1 ? `<mark class="search-hit">${escapeHtml(p)}</mark>` : escapeHtml(p)))
    .join("");
}

function formatMessageTextWithSearch(str, query) {
  const raw = String(str || "");
  if (!query) return linkifyText(raw);

  const urlSplitRe = /(https?:\/\/[^\s<]+)/g;
  return raw
    .split(urlSplitRe)
    .map((part) => {
      if (/^https?:\/\/[^\s<]+$/.test(part)) {
        const cleanUrl = sanitizeHttpUrl(part);
        if (cleanUrl) {
          const safeUrl = escapeHtml(cleanUrl);
          const label = highlightRawSegment(part, query);
          return `<a class="msg-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        }
      }
      return highlightRawSegment(part, query);
    })
    .join("");
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
  // 0. Aktif/gelen sesli arama ekranı açıksa arkadaki sohbeti kapatma
  if (callModal && !callModal.classList.contains("hidden")) {
    pushBackState("call-modal");
    return;
  }
  if (avatarCropModal && !avatarCropModal.classList.contains("hidden")) {
    closeAvatarCropModal();
    return;
  }
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
  if (groupSettingsModal && !groupSettingsModal.classList.contains("hidden")) {
    groupSettingsModal.classList.add("hidden");
    return;
  }
  if (announcementsModal && !announcementsModal.classList.contains("hidden")) {
    announcementsModal.classList.add("hidden");
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

  // 2. Sohbet odası açıksa (arama açıksa önce aramayı kapat, değilse ana ekrana dön)
  if (chatView.classList.contains("active")) {
    if (chatSearchBar && !chatSearchBar.classList.contains("hidden")) {
      closeChatSearch();
      return;
    }
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

regAvatarInput.addEventListener("change", () => {
  const file = regAvatarInput.files && regAvatarInput.files[0];
  regAvatarInput.value = "";
  if (!file) return;
  openAvatarCropModal(file, {
    title: "Profil Fotoğrafını Ayarla",
    outputSize: 200,
    onSave: async (avatarData) => {
      state.pendingRegAvatar = avatarData;
      regAvatarPreview.src = avatarData;
    }
  });
});

function randomBytesHex(byteLen = 16) {
  const bytes = new Uint8Array(byteLen);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < byteLen; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateStrongInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let body = "";
  for (let i = 0; i < 8; i++) {
    body += alphabet[bytes[i] % alphabet.length];
  }
  return "AGAR-" + body;
}

function constantTimeEqual(a, b) {
  const s1 = String(a || "");
  const s2 = String(b || "");
  if (s1.length !== s2.length || s1.length === 0) return false;
  let diff = 0;
  for (let i = 0; i < s1.length; i++) {
    diff |= s1.charCodeAt(i) ^ s2.charCodeAt(i);
  }
  return diff === 0;
}

function slugifyId(name) {
  const base = normalizeTurkish(name) || "user";
  return base + "_" + randomBytesHex(3);
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

async function hashPasswordPBKDF2(password, saltHex) {
  const enc = new TextEncoder();
  if (window.crypto && window.crypto.subtle) {
    const keyMat = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const bits = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: enc.encode(saltHex),
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMat,
      256
    );
    return Array.from(new Uint8Array(bits))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return sha256(saltHex + ":" + password);
}

async function verifyUserSecret(secretInput, userRecord, legacyCodeHash) {
  if (!userRecord) return false;
  if (userRecord.hashAlgo === "pbkdf2-sha256-100k" && userRecord.passwordSalt && userRecord.passwordHash) {
    const derived = await hashPasswordPBKDF2(secretInput, userRecord.passwordSalt);
    return constantTimeEqual(derived, userRecord.passwordHash);
  }
  if (userRecord.passwordHash && constantTimeEqual(legacyCodeHash, userRecord.passwordHash)) {
    return true;
  }
  if (userRecord.codeHash && constantTimeEqual(legacyCodeHash, userRecord.codeHash)) {
    return true;
  }
  if (userRecord.inviteCode && constantTimeEqual(secretInput, userRecord.inviteCode)) {
    return true;
  }
  return false;
}

const LOGIN_RATE_KEY = "agartha_login_rl";
function checkLoginRateLimit() {
  try {
    const raw = localStorage.getItem(LOGIN_RATE_KEY);
    if (!raw) return 0;
    const rl = JSON.parse(raw);
    if (rl && rl.lockedUntil && Date.now() < rl.lockedUntil) {
      return Math.ceil((rl.lockedUntil - Date.now()) / 1000);
    }
  } catch {}
  return 0;
}

function recordFailedLogin() {
  try {
    const raw = localStorage.getItem(LOGIN_RATE_KEY);
    const rl = raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
    rl.count = (rl.count || 0) + 1;
    if (rl.count >= 5) {
      const step = Math.min(rl.count - 5, 4);
      const waitSec = 15 * Math.pow(2, step); // 15s, 30s, 60s, 120s, 240s
      rl.lockedUntil = Date.now() + waitSec * 1000;
    }
    localStorage.setItem(LOGIN_RATE_KEY, JSON.stringify(rl));
  } catch {}
}

function clearLoginFailures() {
  try {
    localStorage.removeItem(LOGIN_RATE_KEY);
  } catch {}
}

async function ensureFirebaseAuthSession() {
  if (typeof firebase === "undefined" || typeof firebase.auth !== "function") return null;
  const auth = firebase.auth();
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await auth.signInAnonymously();
    return cred && cred.user ? cred.user : auth.currentUser;
  } catch {
    return null;
  }
}

// =========================================================
// UÇTAN UCA ŞİFRELEME (E2EE — ECDH P-256 + AES-GCM-256)
// =========================================================
function bytesToBase64(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin);
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

async function importEcdhPublicKey(jwk) {
  if (!jwk || !window.crypto || !window.crypto.subtle) return null;
  return window.crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
  );
}

async function deriveSharedAesKey(otherPubJwk) {
  if (!state.e2eeKeyPair || !state.e2eeKeyPair.privateKey || !otherPubJwk) return null;
  const otherKey = await importEcdhPublicKey(otherPubJwk);
  if (!otherKey) return null;
  return window.crypto.subtle.deriveKey(
    { name: "ECDH", public: otherKey },
    state.e2eeKeyPair.privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function aesGcmEncryptBytes(aesKey, plainBytes) {
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);
  const cipherBuf = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    plainBytes
  );
  return {
    iv: bytesToBase64(iv),
    ct: bytesToBase64(new Uint8Array(cipherBuf))
  };
}

async function aesGcmDecryptBytes(aesKey, ivB64, ctB64) {
  const iv = base64ToBytes(ivB64);
  const ct = base64ToBytes(ctB64);
  const plainBuf = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    ct
  );
  return new Uint8Array(plainBuf);
}

async function deriveWrapKeyFromPassword(password, saltHex) {
  const enc = new TextEncoder();
  const keyMat = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode(saltHex), iterations: 100000, hash: "SHA-256" },
    keyMat,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function wrapPrivateJwkWithPassword(privJwk, password) {
  const salt = randomBytesHex(16);
  const wrapKey = await deriveWrapKeyFromPassword(password, salt);
  const enc = new TextEncoder().encode(JSON.stringify(privJwk));
  const { iv, ct } = await aesGcmEncryptBytes(wrapKey, enc);
  return { salt, iv, ct };
}

async function unwrapPrivateJwkWithPassword(wrapped, password) {
  const wrapKey = await deriveWrapKeyFromPassword(password, wrapped.salt);
  const plainBytes = await aesGcmDecryptBytes(wrapKey, wrapped.iv, wrapped.ct);
  return JSON.parse(new TextDecoder().decode(plainBytes));
}

async function ensureE2EEInitialized(loginSecret = "") {
  if (!state.user || !state.db || !window.crypto || !window.crypto.subtle) return;
  const storageKey = "agartha_e2ee_v1_" + state.user.id;
  try {
    let savedPair = null;
    const rawLocal = localStorage.getItem(storageKey);
    if (rawLocal) {
      savedPair = JSON.parse(rawLocal);
    }

    if (!savedPair && loginSecret) {
      const wrappedSnap = await state.db.ref(`users/${state.user.id}/e2eeWrappedPriv`).once("value");
      const wrapped = wrappedSnap.val();
      const pubSnap = await state.db.ref(`users/${state.user.id}/e2eePub`).once("value");
      const remotePub = pubSnap.val();
      if (wrapped && wrapped.salt && wrapped.iv && wrapped.ct && remotePub) {
        try {
          const privJwk = await unwrapPrivateJwkWithPassword(wrapped, loginSecret);
          savedPair = { pubJwk: remotePub, privJwk };
          localStorage.setItem(storageKey, JSON.stringify(savedPair));
        } catch {}
      }
    }

    if (!savedPair) {
      const kp = await window.crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: "P-256" },
        true,
        ["deriveKey"]
      );
      const pubJwk = await window.crypto.subtle.exportKey("jwk", kp.publicKey);
      const privJwk = await window.crypto.subtle.exportKey("jwk", kp.privateKey);
      savedPair = { pubJwk, privJwk };
      localStorage.setItem(storageKey, JSON.stringify(savedPair));
      state.e2eeKeyPair = kp;
      state.e2eePubJwk = pubJwk;

      const userUpdate = { e2eePub: pubJwk };
      if (loginSecret) {
        userUpdate.e2eeWrappedPriv = await wrapPrivateJwkWithPassword(privJwk, loginSecret);
      }
      await state.db.ref(`users/${state.user.id}`).update(userUpdate);
      return;
    }

    const publicKey = await importEcdhPublicKey(savedPair.pubJwk);
    const privateKey = await window.crypto.subtle.importKey(
      "jwk",
      savedPair.privJwk,
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey"]
    );
    state.e2eeKeyPair = { publicKey, privateKey };
    state.e2eePubJwk = savedPair.pubJwk;

    const myNode = state.usersCache[state.user.id];
    const updates = {};
    if (!myNode || !myNode.e2eePub) {
      updates.e2eePub = savedPair.pubJwk;
    }
    if (loginSecret && (!myNode || !myNode.e2eeWrappedPriv)) {
      updates.e2eeWrappedPriv = await wrapPrivateJwkWithPassword(savedPair.privJwk, loginSecret);
    }
    if (Object.keys(updates).length > 0) {
      await state.db.ref(`users/${state.user.id}`).update(updates);
    }
  } catch (err) {
    console.warn("E2EE başlatılamadı:", err && err.message);
  }
}

async function distributeGroupKeyToMembers(keyId) {
  const aesKey = state.e2eeGroupKeys[keyId];
  if (!aesKey || !state.e2eeKeyPair || !state.e2eePubJwk || !state.db) return;
  try {
    const rawBytes = new Uint8Array(await window.crypto.subtle.exportKey("raw", aesKey));
    const entries = Object.entries(state.usersCache || {}).filter(
      ([, u]) => u && u.active !== false && u.e2eePub
    );
    for (const [uid, u] of entries) {
      if (state.mainGroupKeysSnap && state.mainGroupKeysSnap[uid] && state.mainGroupKeysSnap[uid].keyId === keyId) {
        continue;
      }
      const shared = await deriveSharedAesKey(u.e2eePub);
      if (!shared) continue;
      const { iv, ct } = await aesGcmEncryptBytes(shared, rawBytes);
      await state.db.ref(`config/mainGroupKeys/${uid}`).set({
        v: 1,
        keyId,
        fromId: state.user.id,
        fromPub: state.e2eePubJwk,
        iv,
        ct
      });
    }
  } catch {}
}

function listenMainGroupKeys() {
  if (!state.db || !state.user || !window.crypto || !window.crypto.subtle) return;
  state.db.ref("config/mainGroupKeys").on("value", async (snap) => {
    const val = snap.val() || {};
    state.mainGroupKeysSnap = val;

    if (!val.keyMeta) {
      const tx = await state.db.ref("config/mainGroupKeys/keyMeta").transaction((cur) => {
        if (cur) return;
        return { keyId: "gk_1", createdBy: state.user.id, createdAt: Date.now() };
      });
      if (tx.committed) {
        const key = await window.crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        );
        state.e2eeGroupKeys["gk_1"] = key;
        state.e2eeActiveGroupKeyId = "gk_1";
        await distributeGroupKeyToMembers("gk_1");
      }
      return;
    }

    const myEntry = val[state.user.id];
    if (myEntry && myEntry.fromPub && myEntry.iv && myEntry.ct && !state.e2eeGroupKeys[myEntry.keyId]) {
      try {
        const shared = await deriveSharedAesKey(myEntry.fromPub);
        if (shared) {
          const rawKeyBytes = await aesGcmDecryptBytes(shared, myEntry.iv, myEntry.ct);
          const groupKey = await window.crypto.subtle.importKey(
            "raw",
            rawKeyBytes,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
          );
          state.e2eeGroupKeys[myEntry.keyId] = groupKey;
          state.e2eeActiveGroupKeyId = myEntry.keyId;
          if (typeof state.onGroupKeyReady === "function") {
            state.onGroupKeyReady();
          }
        }
      } catch {}
    }

    if (state.e2eeActiveGroupKeyId && state.e2eeGroupKeys[state.e2eeActiveGroupKeyId]) {
      distributeGroupKeyToMembers(state.e2eeActiveGroupKeyId);
    }
  });
}

async function encryptOutgoingMessage({ isGroup, otherId, text, replyTo }) {
  if (!window.crypto || !window.crypto.subtle || (!text && (!replyTo || !replyTo.preview))) {
    return { text, replyTo };
  }
  const plainJson = new TextEncoder().encode(
    JSON.stringify({
      text: text || "",
      replyPreview: replyTo ? String(replyTo.preview || "") : ""
    })
  );

  try {
    if (isGroup) {
      const keyId = state.e2eeActiveGroupKeyId;
      const gKey = keyId ? state.e2eeGroupKeys[keyId] : null;
      if (!gKey) return { text, replyTo };
      const { iv, ct } = await aesGcmEncryptBytes(gKey, plainJson);
      return {
        text: "",
        replyTo: replyTo ? { msgKey: replyTo.msgKey, senderName: replyTo.senderName, preview: "" } : null,
        e2ee: { v: 1, alg: "GROUP-AES-GCM", keyId, iv, ct }
      };
    }

    if (otherId && state.e2eeKeyPair && state.e2eePubJwk) {
      let peerPub = state.usersCache[otherId] && state.usersCache[otherId].e2eePub;
      if (!peerPub && state.db) {
        const snap = await state.db.ref(`users/${otherId}/e2eePub`).once("value");
        peerPub = snap.val();
      }
      if (!peerPub) return { text, replyTo };
      const shared = await deriveSharedAesKey(peerPub);
      if (!shared) return { text, replyTo };
      const { iv, ct } = await aesGcmEncryptBytes(shared, plainJson);
      return {
        text: "",
        replyTo: replyTo ? { msgKey: replyTo.msgKey, senderName: replyTo.senderName, preview: "" } : null,
        e2ee: {
          v: 1,
          alg: "ECDH-P256-AES-GCM",
          iv,
          ct,
          senderPub: state.e2eePubJwk,
          recipientPub: peerPub
        }
      };
    }
  } catch {}

  return { text, replyTo };
}

async function decryptMessageRecord(msgKey, m, otherId = null) {
  if (!m) return { text: "", replyPreview: "" };
  if (!m.e2ee) {
    return {
      text: m.text || "",
      replyPreview: m.replyTo ? m.replyTo.preview || "" : ""
    };
  }
  if (msgKey && state.decryptedCache[msgKey]) {
    return state.decryptedCache[msgKey];
  }

  try {
    let aesKey = null;
    if (m.e2ee.alg === "GROUP-AES-GCM") {
      aesKey = state.e2eeGroupKeys[m.e2ee.keyId];
    } else if (m.e2ee.alg === "ECDH-P256-AES-GCM") {
      const targetPub =
        m.senderId === state.user.id
          ? m.e2ee.recipientPub || (otherId && state.usersCache[otherId] && state.usersCache[otherId].e2eePub)
          : m.e2ee.senderPub || (state.usersCache[m.senderId] && state.usersCache[m.senderId].e2eePub);
      aesKey = await deriveSharedAesKey(targetPub);
    }

    if (aesKey && m.e2ee.iv && m.e2ee.ct) {
      const plainBytes = await aesGcmDecryptBytes(aesKey, m.e2ee.iv, m.e2ee.ct);
      const parsed = JSON.parse(new TextDecoder().decode(plainBytes));
      const res = {
        text: String(parsed.text || ""),
        replyPreview: String(parsed.replyPreview || "")
      };
      if (msgKey) state.decryptedCache[msgKey] = res;
      return res;
    }
  } catch {}

  return {
    text: "[Şifreli mesaj çözülemedi]",
    replyPreview: "Şifreli mesaj"
  };
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

async function uploadVideoToGoogleDrive(file) {
  if (!file.type || !file.type.startsWith("video/")) {
    throw new Error("Sadece video dosyaları yüklenebilir");
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error("Video boyutu en fazla 25 MB olabilir");
  }
  const base64 = await fileToRawBase64(file);
  const res = await fetch(state.driveConfig.url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      secret: state.driveConfig.secret || "",
      fileName: file.name || ("agartha_video_" + Date.now() + ".mp4"),
      mimeType: file.type || "video/mp4",
      base64
    })
  });
  const data = await res.json();
  if (!data || !data.ok || !data.id) {
    throw new Error((data && data.error) || "Drive video yükleme hatası");
  }
  return data;
}

function extractDriveFileIds(msg) {
  if (!msg) return [];
  const ids = [];
  if (sanitizeDriveFileId(msg.driveFileId)) ids.push(sanitizeDriveFileId(msg.driveFileId));
  if (sanitizeDriveFileId(msg.audioDriveFileId)) ids.push(sanitizeDriveFileId(msg.audioDriveFileId));
  if (sanitizeDriveFileId(msg.videoDriveFileId)) ids.push(sanitizeDriveFileId(msg.videoDriveFileId));
  if (!msg.driveFileId && msg.imageUrl) {
    const match = String(msg.imageUrl).match(/\/d\/([a-zA-Z0-9_-]{10,120})/);
    if (match && sanitizeDriveFileId(match[1])) ids.push(match[1]);
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
async function init() {
  loadSavedTheme();
  applyUiPrefs();
  if (soundStyleSelect) {
    soundStyleSelect.value = state.soundStyle;
    soundStyleSelect.addEventListener("change", () => {
      state.soundStyle = soundStyleSelect.value;
      localStorage.setItem(SOUND_STORAGE_KEY, state.soundStyle);
      if (state.soundStyle !== "off") {
        playMessageSound("receive");
      }
    });
  }
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
        if (parsed && parsed.id) {
          if (loadingView) showView(loadingView);
          await ensureFirebaseAuthSession();
          verifyAndEnter(parsed);
        } else {
          localStorage.removeItem(SESSION_KEY);
          showView(authView);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
        showView(authView);
      }
    } else {
      ensureFirebaseAuthSession();
    }
  } catch (err) {
    showView(authView);
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
      showView(authView);
      showError("Sunucuya bağlanılamadı.");
    });
}

function waitForReactivation(sessionUser) {
  if (state.reactivationRef) {
    state.reactivationRef.off();
    state.reactivationRef = null;
  }
  const ref = state.db.ref("users/" + sessionUser.id);
  state.reactivationRef = ref;
  ref.on("value", (snap) => {
    const data = snap.val();
    if (!data) {
      ref.off();
      if (state.reactivationRef === ref) state.reactivationRef = null;
      localStorage.removeItem(SESSION_KEY);
      showError("Hesabınız yönetici tarafından silindi.");
      return;
    }
    if (data.active !== false) {
      ref.off();
      if (state.reactivationRef === ref) state.reactivationRef = null;
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

  const waitSec = checkLoginRateLimit();
  if (waitSec > 0) {
    showError(`Çok fazla hatalı deneme. Lütfen ${waitSec} saniye bekle.`);
    return;
  }

  try {
    await ensureFirebaseAuthSession();
    const codeHash = await sha256(code);
    const adminHashSnap = await state.db.ref("config/adminHash").once("value");
    const savedAdminHash = adminHashSnap.val();

    if (!savedAdminHash) {
      await state.db.ref("config/adminHash").set(codeHash);
    }

    if (!savedAdminHash || constantTimeEqual(codeHash, savedAdminHash)) {
      clearLoginFailures();
      const userId = "admin_" + (normalizeTurkish(username) || "root");
      const existingAdminSnap = await state.db.ref("users/" + userId).once("value");
      const existingAdmin = existingAdminSnap.val();
      if (existingAdmin && existingAdmin.active === false) {
        showError("Erişiminiz askıya alındı. Yönetici yetkiyi açtığında otomatik giriş yapılacaktır.");
        waitForReactivation({ id: userId, name: username, isAdmin: true });
        return;
      }
      const avatarData = sanitizeMediaSrc(existingAdmin && existingAdmin.avatarData, "image");
      const nickname = (existingAdmin && existingAdmin.nickname) || "";
      const bubbleColor = (existingAdmin && existingAdmin.bubbleColor) || "";
      const bio = (existingAdmin && existingAdmin.bio) || "";
      const statusEmoji = (existingAdmin && existingAdmin.statusEmoji) || "";
      const bannerColor = (existingAdmin && existingAdmin.bannerColor) || "";
      const chatBgData = sanitizeChatBgData(existingAdmin && existingAdmin.chatBgData);
      await state.db.ref("users/" + userId).update({
        name: username,
        nickname,
        isAdmin: true,
        active: true,
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
      state.pendingLoginSecret = code;
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: userId, name: username, isAdmin: true }));
      enterMainApp();
      return;
    }

    // Mevcut kullanıcı kendi adı + şifresi (veya eski davet kodu) ile giriş yapıyorsa
    const usersSnap = await state.db.ref("users").once("value");
    const allUsers = usersSnap.val() || {};
    const nameMatches = Object.entries(allUsers).filter(
      ([, u]) => String(u.name || "").trim().toLowerCase() === username.toLowerCase()
    );

    let matchedEntry = null;
    for (const entry of nameMatches) {
      if (await verifyUserSecret(code, entry[1], codeHash)) {
        matchedEntry = entry;
        break;
      }
    }

    if (matchedEntry) {
      clearLoginFailures();
      const [existingId, existingUser] = matchedEntry;
      if (existingUser.active === false) {
        showError("Erişiminiz yönetici tarafından askıya alınmış.");
        return;
      }
      const userUpdates = { online: true };
      if (existingUser.hashAlgo !== "pbkdf2-sha256-100k" || existingUser.inviteCode) {
        const newSalt = randomBytesHex(16);
        userUpdates.passwordSalt = newSalt;
        userUpdates.passwordHash = await hashPasswordPBKDF2(code, newSalt);
        userUpdates.hashAlgo = "pbkdf2-sha256-100k";
        userUpdates.inviteCode = null;
        userUpdates.codeHash = null;
      }
      await state.db.ref("users/" + existingId).update(userUpdates);
      state.user = {
        id: existingId,
        name: existingUser.name,
        nickname: existingUser.nickname || "",
        isAdmin: Boolean(existingUser.isAdmin),
        avatarData: sanitizeMediaSrc(existingUser.avatarData, "image"),
        bubbleColor: existingUser.bubbleColor || "",
        bio: existingUser.bio || "",
        statusEmoji: existingUser.statusEmoji || "",
        bannerColor: existingUser.bannerColor || "",
        chatBgData: sanitizeChatBgData(existingUser.chatBgData)
      };
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ id: existingId, name: existingUser.name, isAdmin: Boolean(existingUser.isAdmin) })
      );
      state.pendingLoginSecret = code;
      enterMainApp();
      return;
    }

    recordFailedLogin();
    const lockedAfter = checkLoginRateLimit();
    showError(
      lockedAfter > 0
        ? `Çok fazla hatalı deneme. ${lockedAfter} saniye bekleyin.`
        : "Kullanıcı adı veya şifre hatalı. Yeni kullanıcıysanız 'Hesap Oluştur' sekmesini kullanın."
    );
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

  if (!/^[A-Za-z0-9_-]{4,32}$/.test(code)) {
    showRegisterError("Erişim kodu biçimi geçersiz.");
    return;
  }
  if (password.length < 4) {
    showRegisterError("Şifre en az 4 karakter olmalıdır.");
    return;
  }

  try {
    await ensureFirebaseAuthSession();
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

    const userId = slugifyId(username);
    const finalNickname = nickname || username;

    // Aynı davet kodunun eşzamanlı olarak iki kez kullanılmasını transaction ile engelle
    const txResult = await state.db.ref("invites/" + code).transaction((current) => {
      if (!current || current.active !== true) return;
      return {
        ...current,
        active: false,
        usedBy: finalNickname,
        claimedByUserId: userId,
        usedAt: Date.now()
      };
    });
    if (!txResult.committed) {
      showRegisterError("Bu erişim kodu az önce kullanıldı veya geçersiz.");
      return;
    }

    const passwordSalt = randomBytesHex(16);
    const passwordHash = await hashPasswordPBKDF2(password, passwordSalt);
    const avatarData = sanitizeMediaSrc(state.pendingRegAvatar, "image");

    await state.db.ref("users/" + userId).set({
      name: username,
      nickname: finalNickname,
      isAdmin: false,
      active: true,
      online: true,
      passwordSalt,
      passwordHash,
      hashAlgo: "pbkdf2-sha256-100k",
      avatarData,
      joinedAt: Date.now()
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
    state.pendingLoginSecret = password;
    enterMainApp();
  } catch (err) {
    showRegisterError("Kayıt hatası: " + (err.message || "Bağlantı sorunu"));
  }
});

const UI_PREFS_KEY = "agartha_ui_prefs";
const DEFAULT_UI_PREFS = {
  bubbleStyle: "rounded",
  fontSize: "normal",
  fontFamily: "modern",
  density: "normal",
  animMode: "full",
  haptic: true,
  bgBlur: 9,
  bgBrightness: 65,
  bgPattern: "none",
  reactionPreset: "classic",
  reactionCustom: "❤️ 😂 👍 🔥 😮",
  hideReadReceipts: false
};
const REACTION_PRESETS = {
  classic: ["❤️", "😂", "👍", "🔥", "😮"],
  fun: ["🤣", "💀", "😭", "🤡", "🎉"],
  cool: ["🔥", "⚡", "🚀", "👑", "💯"]
};

function loadUiPrefs() {
  try {
    const raw = localStorage.getItem(UI_PREFS_KEY);
    return raw ? { ...DEFAULT_UI_PREFS, ...JSON.parse(raw) } : { ...DEFAULT_UI_PREFS };
  } catch {
    return { ...DEFAULT_UI_PREFS };
  }
}

let uiPrefs = loadUiPrefs();

function saveUiPrefs(nextPartial = {}) {
  uiPrefs = { ...uiPrefs, ...nextPartial };
  try {
    localStorage.setItem(UI_PREFS_KEY, JSON.stringify(uiPrefs));
  } catch {}
  applyUiPrefs();
  if (state.db && state.user) {
    state.db.ref(`users/${state.user.id}/uiPrefs`).set(uiPrefs).catch(() => {});
  }
}

function applyUiPrefs() {
  const root = document.documentElement;
  root.classList.remove("bubble-rounded", "bubble-pill", "bubble-sharp", "bubble-glass");
  root.classList.add("bubble-" + (uiPrefs.bubbleStyle || "rounded"));

  root.classList.remove("font-small", "font-normal", "font-large");
  root.classList.add("font-" + (uiPrefs.fontSize || "normal"));

  root.classList.remove("ff-modern", "ff-rounded", "ff-serif", "ff-mono");
  root.classList.add("ff-" + (uiPrefs.fontFamily || "modern"));

  root.classList.toggle("density-compact", uiPrefs.density === "compact");

  root.classList.remove("anim-fast", "anim-off");
  if (uiPrefs.animMode === "fast") root.classList.add("anim-fast");
  else if (uiPrefs.animMode === "off") root.classList.add("anim-off");

  root.style.setProperty("--chat-bg-blur", `${Number(uiPrefs.bgBlur ?? 9)}px`);
  root.style.setProperty("--chat-bg-bright", `${Number(uiPrefs.bgBrightness ?? 65) / 100}`);

  if (hideReadToggle) hideReadToggle.checked = Boolean(uiPrefs.hideReadReceipts);

  const activeRoomId = state.activeRoom ? state.activeRoom.id : "global";
  applyActiveRoomBackground(activeRoomId);
}

function triggerHaptic(pattern = 15) {
  if (!uiPrefs.haptic) return;
  if (navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch {}
  }
}

function getActiveReactionEmojis() {
  if (uiPrefs.reactionPreset === "custom") {
    const custom = String(uiPrefs.reactionCustom || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 6);
    if (custom.length > 0) return custom;
  }
  return REACTION_PRESETS[uiPrefs.reactionPreset] || REACTION_PRESETS.classic;
}

function emojiToKey(emoji) {
  return "u_" + Array.from(String(emoji || "")).map((c) => c.codePointAt(0).toString(16)).join("-");
}

function keyToEmoji(key) {
  const s = String(key || "");
  if (!s.startsWith("u_")) return s;
  try {
    return s
      .slice(2)
      .split("-")
      .map((hex) => String.fromCodePoint(parseInt(hex, 16)))
      .join("");
  } catch {
    return s;
  }
}

function getRoomBgStore() {
  if (!state.user) return {};
  try {
    const raw = localStorage.getItem("agartha_room_bgs_" + state.user.id);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setRoomBgStore(store) {
  if (!state.user) return;
  try {
    localStorage.setItem("agartha_room_bgs_" + state.user.id, JSON.stringify(store));
  } catch {}
}

function applyChatBackground(bgData, pattern = uiPrefs.bgPattern || "none") {
  if (!chatBgLayer) return;
  const safeBg = sanitizeChatBgData(bgData);
  chatBgLayer.classList.remove(
    "bg-pattern-aurora",
    "bg-pattern-stars",
    "bg-pattern-grid",
    "bg-pattern-waves"
  );
  if (safeBg) {
    chatBgLayer.style.backgroundImage = `url("${safeBg}")`;
    chatBgLayer.classList.remove("hidden");
  } else if (pattern && pattern !== "none") {
    chatBgLayer.style.backgroundImage = "";
    chatBgLayer.classList.add("bg-pattern-" + pattern);
    chatBgLayer.classList.remove("hidden");
  } else {
    chatBgLayer.style.backgroundImage = "";
    chatBgLayer.classList.add("hidden");
  }
}

function applyActiveRoomBackground(roomId = "global") {
  if (!state.user) return;
  const store = getRoomBgStore();
  const roomCfg = roomId && roomId !== "global" ? store[roomId] : null;
  if (roomCfg && (roomCfg.imageData || (roomCfg.pattern && roomCfg.pattern !== "none"))) {
    applyChatBackground(roomCfg.imageData || "", roomCfg.pattern || "none");
  } else {
    applyChatBackground(state.user.chatBgData || "", uiPrefs.bgPattern || "none");
  }
}

function updateHeaderIdentity() {
  const emojiPrefix = state.user.statusEmoji ? `${state.user.statusEmoji} ` : "";
  const disp = getDisplayName(state.user);
  currentUserLabel.textContent = state.user.isAdmin
    ? `${emojiPrefix}${disp} (Admin)`
    : `${emojiPrefix}${disp}`;
  headerAvatar.src = sanitizeMediaSrc(state.user.avatarData, "image") || "./icon-192.png";
  headerAvatar.style.border = isValidHexColor(state.user.bannerColor)
    ? `2px solid ${state.user.bannerColor}`
    : "";
  applyActiveRoomBackground(state.activeRoom ? state.activeRoom.id : "global");
}

function markRoomDelivered(roomId, msgTs = 0) {
  if (!state.db || !state.user || !roomId) return;
  const targetTs = Math.max(msgTs || 0, Date.now());
  state.db
    .ref(`chats/${roomId}/deliveredBy/${state.user.id}`)
    .set(targetTs)
    .catch(() => {});
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
      markRoomDelivered("main_group");
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
              markRoomDelivered(dmId);
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
  if (state.reactivationRef) {
    state.reactivationRef.off();
    state.reactivationRef = null;
  }
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

  const loginSecret = state.pendingLoginSecret || "";
  state.pendingLoginSecret = "";
  await ensureE2EEInitialized(loginSecret);
  listenMainGroupKeys();

  updateNotifyButton();
  setupPresence();
  listenDriveConfig();
  listenTurnConfig();
  listenMainGroupInfo();
  listenUsers();
  listenMainGroupPreview();
  listenPlaces();
  listenAiRecommendations();
  listenAnnouncements();
  watchOwnAccess();
  listenIncomingCalls();
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

function listenTurnConfig() {
  state.db.ref("config/turn").on("value", (snap) => {
    const val = snap.val() || {};
    state.turnConfig = {
      apiUrl: String(val.apiUrl || "").trim()
    };
  });
}

function applyMainGroupInfoUI() {
  const info = state.mainGroupInfo || {};
  const gName = info.name || "Ana Grup";
  const gDesc = info.description || "Tüm yetkili arkadaşlar";
  const gAvatar = sanitizeMediaSrc(info.avatarData, "image");

  if (mainGroupTitle) mainGroupTitle.textContent = gName;
  if (mainGroupAvatar) {
    if (gAvatar) {
      mainGroupAvatar.innerHTML = `<img src="${escapeHtml(gAvatar)}" alt="Grup" />`;
    } else {
      mainGroupAvatar.textContent = "#";
    }
  }
  if (state.activeRoom && state.activeRoom.isGroup) {
    state.activeRoom.title = gName;
    if (chatRoomTitle) chatRoomTitle.textContent = gName;
    if (chatRoomSubtitle) chatRoomSubtitle.textContent = gDesc;
    if (chatRoomAvatar) {
      chatRoomAvatar.src = gAvatar || "./icon-192.png";
      chatRoomAvatar.classList.remove("hidden");
    }
  }
  if (groupSettingsModal && !groupSettingsModal.classList.contains("hidden")) {
    if (groupAvatarPreview) groupAvatarPreview.src = gAvatar || "./icon-192.png";
    if (groupAvatarRemoveBtn) groupAvatarRemoveBtn.classList.toggle("hidden", !gAvatar);
    if (groupSettingsSubtitle) groupSettingsSubtitle.textContent = gDesc;
  }
}

function listenMainGroupInfo() {
  state.db.ref("config/mainGroup").on("value", (snap) => {
    const val = snap.val() || {};
    state.mainGroupInfo = {
      name: String(val.name || "").trim() || "Ana Grup",
      description: String(val.description || "").trim() || "Tüm yetkili arkadaşlar",
      avatarData: String(val.avatarData || "")
    };
    applyMainGroupInfoUI();
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

function isIosDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandalonePwa() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function syncAppBadge() {
  if (!("setAppBadge" in navigator)) return;
  try {
    const groupUnread = mainGroupBadge && !mainGroupBadge.classList.contains("hidden") ? 1 : 0;
    const total = (state.unreadRooms ? state.unreadRooms.size : 0) + groupUnread;
    if (total > 0) {
      navigator.setAppBadge(total).catch(() => {});
    } else if ("clearAppBadge" in navigator) {
      navigator.clearAppBadge().catch(() => {});
    }
  } catch {}
}

function updateNotifyButton() {
  if (!notifyBtn) return;
  notifyBtn.classList.remove("hidden");
  if (!("Notification" in window)) {
    if (notifyStatusLabel) {
      notifyStatusLabel.textContent = isIosDevice() && !isStandalonePwa()
        ? "iOS: Önce Ana Ekrana Ekle"
        : "Desteklenmiyor";
    }
    notifyBtn.style.borderColor = "";
    return;
  }
  if (Notification.permission === "granted") {
    if (notifyStatusLabel) notifyStatusLabel.textContent = "Açık";
    notifyBtn.style.borderColor = "rgba(34, 197, 94, 0.5)";
  } else if (Notification.permission === "denied") {
    if (notifyStatusLabel) notifyStatusLabel.textContent = "Engelli (Ayarlardan aç)";
    notifyBtn.style.borderColor = "";
  } else {
    if (notifyStatusLabel) notifyStatusLabel.textContent = "Kapalı (Açmak için dokun)";
    notifyBtn.style.borderColor = "";
  }
}

notifyBtn.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    if (isIosDevice() && !isStandalonePwa()) {
      alert("iPhone'da bildirim alabilmek için Safari alt menüsünden Paylaş > Ana Ekrana Ekle yapıp uygulamayı ana ekrandaki ikondan açmalısın (iOS 16.4+).");
    } else {
      alert("Bu tarayıcı bildirimleri desteklemiyor.");
    }
    return;
  }
  try {
    const perm = await Notification.requestPermission();
    updateNotifyButton();
    if (perm === "granted") {
      await showIncomingNotification("Agartha", "Bildirimler açıldı! Yeni mesaj geldiğinde haber vereceğiz.", "test_" + Date.now());
    } else if (perm === "denied") {
      alert("Bildirim izni reddedildi. iPhone Ayarlar > Bildirimler > Agartha üzerinden açabilirsin.");
    }
  } catch {
    alert("Bildirim izni alınamadı. iPhone'da uygulamayı Ana Ekrana Ekle ile açtığından emin ol.");
  }
});

async function showIncomingNotification(title, body, uniqueKey) {
  if (uniqueKey && state.notifiedMsgKeys.has(uniqueKey)) return;
  if (uniqueKey) state.notifiedMsgKeys.add(uniqueKey);

  playMessageSound("receive");
  syncAppBadge();

  triggerHaptic([120, 60, 120]);

  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const iconUrl = new URL("./icon-192.png", location.href).href;
  try {
    if ("serviceWorker" in navigator) {
      const reg = (await navigator.serviceWorker.getRegistration()) || (await navigator.serviceWorker.ready);
      if (reg && typeof reg.showNotification === "function") {
        await reg.showNotification(title, {
          body,
          icon: iconUrl,
          badge: iconUrl,
          tag: uniqueKey || "agartha-msg",
          renotify: true
        });
        return;
      }
    }
  } catch {
    // Fallback'e düş
  }

  try {
    new Notification(title, { body, icon: iconUrl });
  } catch {
    // iOS Safari PWA'da doğrudan new Notification desteklenmeyebilir
  }
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
    if (data.uiPrefs && typeof data.uiPrefs === "object") {
      uiPrefs = { ...DEFAULT_UI_PREFS, ...data.uiPrefs };
      try { localStorage.setItem(UI_PREFS_KEY, JSON.stringify(uiPrefs)); } catch {}
      applyUiPrefs();
    }
    updateHeaderIdentity();
    if (nextAdmin !== state.user.isAdmin) {
      state.user.isAdmin = nextAdmin;
      try {
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ id: state.user.id, name: state.user.name, isAdmin: nextAdmin })
        );
      } catch {}
      updateHeaderIdentity();
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

async function logout() {
  if (state.db && state.user) {
    try {
      await Promise.race([
        state.db.ref("users/" + state.user.id).update({
          online: false,
          lastSeen: Date.now()
        }),
        new Promise((r) => setTimeout(r, 1200))
      ]);
    } catch {}
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

      const safeAvatar = sanitizeMediaSrc(u.avatarData, "image");
      const avatarHtml = safeAvatar
        ? `<img class="avatar-img" src="${escapeHtml(safeAvatar)}" alt="${escapeHtml(dispName)}"${ringStyle} />`
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
    if (groupSettingsModal && !groupSettingsModal.classList.contains("hidden")) {
      renderGroupMembersList();
    }
    if (state.e2eeActiveGroupKeyId && state.e2eeGroupKeys[state.e2eeActiveGroupKeyId]) {
      distributeGroupKeyToMembers(state.e2eeActiveGroupKeyId);
    }

    const others = Object.entries(users).filter(
      ([id, u]) => id !== state.user.id && u.active !== false
    );

    const activeDmIds = new Set(others.map(([otherId]) => getDmRoomId(state.user.id, otherId)));
    Object.keys(state.dmListeners).forEach((dmId) => {
      if (!activeDmIds.has(dmId)) {
        try { state.dmListeners[dmId].off(); } catch {}
        delete state.dmListeners[dmId];
      }
    });

    others.forEach(([otherId, u]) => {
      const dmId = getDmRoomId(state.user.id, otherId);
      if (state.dmListeners[dmId]) return;
      const ref = state.db.ref(`chats/${dmId}/messages`).limitToLast(1);
      state.dmListeners[dmId] = ref;
      ref.on("child_added", async (msgSnap) => {
        const msg = msgSnap.val();
        if (!msg || (msg.timestamp || 0) <= state.startedAt) return;
        if (msg.senderId === state.user.id) return;
        markRoomDelivered(dmId, msg.timestamp);
        const isViewingThis = state.activeRoom && state.activeRoom.id === dmId;
        const isVisibleViewing = isViewingThis && document.visibilityState === "visible";
        if (!isVisibleViewing) {
          state.unreadRooms.add(dmId);
          renderContactsList();
          let decodedText = msg.text || "";
          if (msg.e2ee) {
            const dec = await decryptMessageRecord(msgSnap.key, msg, otherId);
            decodedText = dec.text || "";
          }
          showIncomingNotification(
            `${msg.senderName || u.name} (Özel)`,
            decodedText ||
              (msg.imageUrl || msg.imageData
                ? "Fotoğraf gönderdi"
                : msg.videoDriveFileId || msg.videoUrl || msg.videoData
                ? "Video gönderdi"
                : msg.audioUrl || msg.audioData
                ? "Sesli mesaj"
                : msg.location
                ? msg.location.live
                  ? "Canlı konum başlattı"
                  : "Konum paylaştı"
                : msg.callLog
                ? "Sesli arama başlattı"
                : "Şifreli mesaj"),
            msgSnap.key
          );
        }
      });
    });
  });
}

function listenMainGroupPreview() {
  let lastSeenGroupKey = null;
  state.db
    .ref("chats/main_group/messages")
    .limitToLast(1)
    .on("value", async (snap) => {
      const val = snap.val();
      if (!val) {
        mainGroupPreview.textContent = "Herkesin ortak sohbet odası";
        mainGroupTime.textContent = "";
        return;
      }
      const [key, msg] = Object.entries(val)[0];
      let decodedText = msg.text || "";
      if (msg.e2ee) {
        const dec = await decryptMessageRecord(key, msg, null);
        decodedText = dec.text || "";
      }
      const previewText =
        decodedText ||
        (msg.imageUrl || msg.imageData
          ? "Fotoğraf"
          : msg.videoDriveFileId || msg.videoUrl || msg.videoData
          ? "Video"
          : msg.audioUrl || msg.audioData
          ? "Sesli mesaj"
          : msg.location
          ? msg.location.live
            ? "Canlı Konum"
            : "Konum"
          : msg.e2ee
          ? "Şifreli mesaj"
          : "");
      mainGroupPreview.textContent = `${msg.senderName}: ${previewText}`;
      mainGroupTime.textContent = formatTime(msg.timestamp);

      const isNewGroupMsg = key !== lastSeenGroupKey && !state.notifiedMsgKeys.has(key);
      lastSeenGroupKey = key;

      if (isNewGroupMsg && (msg.timestamp || 0) > state.startedAt && msg.senderId !== state.user.id) {
        markRoomDelivered("main_group", msg.timestamp);
        const isViewingGroup = state.activeRoom && state.activeRoom.id === "main_group";
        const isVisibleViewing = isViewingGroup && document.visibilityState === "visible";
        if (!isVisibleViewing) {
          mainGroupBadge.classList.remove("hidden");
          showIncomingNotification("Ana Grup", `${msg.senderName}: ${previewText}`, key);
        }
      }
    });
}

openMainGroupBtn.addEventListener("click", () => {
  mainGroupBadge.classList.add("hidden");
  syncAppBadge();
  const gName = (state.mainGroupInfo && state.mainGroupInfo.name) || "Ana Grup";
  openChatRoom("main_group", gName, true, null);
});

// Sohbet Odası
function openChatRoom(roomId, title, isGroup, otherId) {
  cleanupActiveRoomListeners();

  state.unreadRooms.delete(roomId);
  syncAppBadge();
  if (!isGroup) renderContactsList();

  state.activeRoom = { id: roomId, title, isGroup, otherId };
  state.roomReadBy = {};
  state.roomDeliveredBy = {};
  state.lastRenderedMsgKey = null;
  chatRoomTitle.textContent = title;
  if (isGroup) {
    const info = state.mainGroupInfo || {};
    chatRoomTitle.textContent = info.name || title || "Ana Grup";
    chatRoomAvatar.src = info.avatarData || "./icon-192.png";
    chatRoomAvatar.classList.remove("hidden");
    chatRoomSubtitle.textContent = info.description || "Tüm yetkili arkadaşlar";
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

  if (quickPlaceBtn) {
    quickPlaceBtn.classList.toggle("hidden", !isGroup);
  }
  if (groupSettingsBtn) {
    groupSettingsBtn.classList.toggle("hidden", !isGroup);
  }
  if (voiceCallBtn) {
    voiceCallBtn.classList.toggle("hidden", isGroup || !otherId);
  }

  if (!isGroup || state.user.isAdmin) {
    deleteChatBtn.classList.remove("hidden");
  } else {
    deleteChatBtn.classList.add("hidden");
  }

  messagesContainer.innerHTML = "";
  typingIndicator.classList.add("hidden");
  applyActiveRoomBackground(roomId);
  showView(chatView);
  pushBackState("chat");

  function getMessageReadState(msg) {
    if (!state.activeRoom) return { status: "sent", isRead: false, isDelivered: false, count: 0 };
    const ts = msg.timestamp || 0;
    if (!state.activeRoom.isGroup && state.activeRoom.otherId) {
      const otherReadTs = state.roomReadBy[state.activeRoom.otherId] || 0;
      const otherDelTs = state.roomDeliveredBy[state.activeRoom.otherId] || 0;
      const isRead = otherReadTs >= ts;
      const isDelivered = isRead || otherDelTs >= ts;
      const status = isRead ? "read" : isDelivered ? "delivered" : "sent";
      return { status, isRead, isDelivered, count: isRead ? 1 : 0 };
    }
    const readCount = Object.entries(state.roomReadBy).filter(
      ([uid, readTs]) => uid !== state.user.id && (readTs || 0) >= ts
    ).length;
    const delCount = Object.entries(state.roomDeliveredBy).filter(
      ([uid, delTs]) => uid !== state.user.id && (delTs || 0) >= ts
    ).length;
    const isRead = readCount > 0;
    const isDelivered = isRead || delCount > 0;
    const status = isRead ? "read" : isDelivered ? "delivered" : "sent";
    return { status, isRead, isDelivered, count: readCount };
  }

  function buildTickMarkup(rState) {
    const svg = rState.status === "sent" ? SINGLE_CHECK_SVG : DOUBLE_CHECK_SVG;
    const cls =
      rState.status === "read"
        ? "msg-tick read"
        : rState.status === "delivered"
        ? "msg-tick delivered"
        : "msg-tick";
    const titleText =
      rState.status === "read"
        ? isGroup
          ? `${rState.count} kişi gördü`
          : "Görüldü"
        : rState.status === "delivered"
        ? "İletildi"
        : "Gönderildi";
    return { svg, cls, titleText };
  }

  function markRoomAsRead(latestTs) {
    if (uiPrefs.hideReadReceipts) return;
    if (!state.activeRoom || state.activeRoom.id !== roomId) return;
    if (document.visibilityState !== "visible") return;
    const targetTs = Math.max(latestTs || 0, Date.now());
    const prevTs = state.roomReadBy[state.user.id] || 0;
    if (targetTs > prevTs) {
      state.roomReadBy[state.user.id] = targetTs;
      state.db.ref(`chats/${roomId}/readBy/${state.user.id}`).set(targetTs).catch(() => {});
    }
  }

  function getReplySnippet(m, msgKey = null) {
    const cached = msgKey && state.decryptedCache[msgKey];
    const resolvedText = cached ? cached.text : (m.text || "");
    if (resolvedText) return resolvedText.slice(0, 80);
    if (m.imageUrl || m.imageData) return "Fotoğraf";
    if (m.videoDriveFileId || m.videoUrl || m.videoData) return "Video";
    if (m.audioUrl || m.audioData) return "Sesli mesaj";
    if (m.location) return m.location.live ? "Canlı Konum" : "Konum";
    if (m.callLog) return "Sesli arama";
    return m.e2ee ? "Şifreli mesaj" : "Mesaj";
  }

  async function renderRoomMessages(data, isLiveUpdate = false) {
    state.preloadedChats[roomId] = data;
    const entries = Object.entries(data).sort(
      (a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0)
    );

    if (entries.length === 0) {
      messagesContainer.innerHTML = `<div class="empty-hint">Henüz mesaj yok. İlk mesajı sen yaz!</div>`;
      return;
    }

    const encryptedEntries = entries.filter(([msgKey, m]) => m && m.e2ee && !state.decryptedCache[msgKey]);
    if (encryptedEntries.length > 0) {
      await Promise.all(
        encryptedEntries.map(([msgKey, m]) => decryptMessageRecord(msgKey, m, otherId))
      );
      if (!state.activeRoom || state.activeRoom.id !== roomId) return;
    }

    const lastEntry = entries[entries.length - 1];
    const [lastKey, lastMsg] = lastEntry;
    if (
      isLiveUpdate &&
      document.visibilityState === "visible" &&
      state.lastRenderedMsgKey &&
      lastKey !== state.lastRenderedMsgKey &&
      lastMsg &&
      lastMsg.senderId !== state.user.id &&
      (lastMsg.timestamp || 0) > state.startedAt
    ) {
      playMessageSound("receive");
    }
    state.lastRenderedMsgKey = lastKey;

    markRoomAsRead(lastMsg ? lastMsg.timestamp : Date.now());

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
        const decEntry = state.decryptedCache[msgKey];
        const resolvedText = m.e2ee ? (decEntry ? decEntry.text : "[Şifreli mesaj]") : (m.text || "");
        const resolvedReplyPreview = m.replyTo
          ? (m.e2ee && decEntry ? decEntry.replyPreview : m.replyTo.preview || (m.e2ee ? "Şifreli mesaj" : ""))
          : "";
        const replyQuoteHtml = m.replyTo
          ? `<div class="reply-quote" data-jump-msg="${escapeHtml(m.replyTo.msgKey || "")}">
              <div class="reply-quote-sender">${escapeHtml(m.replyTo.senderName || "")}</div>
              <div class="reply-quote-text">${escapeHtml(resolvedReplyPreview)}</div>
            </div>`
          : "";
        const replyBtnHtml = `<button class="msg-reply-btn" data-reply-msg="${escapeHtml(msgKey)}" title="Yanıtla">Yanıtla</button>`;
        const reactBtnHtml = `<button class="msg-react-btn" data-react-open="${escapeHtml(msgKey)}" title="Tepki ekle" aria-label="Tepki ekle"><svg class="ui-icon" style="width:13px;height:13px;" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>`;
        let reactionsHtml = "";
        if (m.reactions && typeof m.reactions === "object") {
          const pills = Object.entries(m.reactions)
            .map(([eKey, usersMap]) => {
              const uids = usersMap && typeof usersMap === "object" ? Object.keys(usersMap).filter((u) => usersMap[u]) : [];
              if (uids.length === 0) return "";
              const emojiChar = keyToEmoji(eKey);
              const isMine = uids.includes(state.user.id);
              return `<button type="button" class="reaction-pill${isMine ? " mine" : ""}" data-react-toggle="${escapeHtml(msgKey)}" data-emoji-key="${escapeHtml(eKey)}">${escapeHtml(emojiChar)} <span>${uids.length}</span></button>`;
            })
            .filter(Boolean)
            .join("");
          if (pills) {
            reactionsHtml = `<div class="msg-reactions">${pills}</div>`;
          }
        }
        const delHtml = canDelete
          ? `<button class="msg-delete-btn" data-del-msg="${escapeHtml(msgKey)}" title="Mesajı sil">&times;</button>`
          : "";
        let tickHtml = "";
        if (isMe) {
          const rState = getMessageReadState(m);
          const tk = buildTickMarkup(rState);
          tickHtml = `<span class="${tk.cls}" data-msg-ts="${m.timestamp || 0}" title="${tk.titleText}">${tk.svg}</span>`;
        }
        const fullImgSrc = sanitizeMediaSrc(m.imageUrl || m.imageData, "image");
        const thumbImgSrc =
          m.imageUrl && m.imageUrl.includes("lh3.googleusercontent.com/d/") && fullImgSrc
            ? fullImgSrc + "=w400"
            : fullImgSrc;
        const safeDownloadUrl = sanitizeHttpUrl(m.downloadUrl);
        const imgHtml = fullImgSrc
          ? `<img class="msg-image" src="${escapeHtml(thumbImgSrc)}" data-full="${escapeHtml(fullImgSrc)}" data-download="${escapeHtml(safeDownloadUrl)}" alt="Fotoğraf" loading="lazy" />`
          : "";
        let videoHtml = "";
        const safeVideoDriveId = sanitizeDriveFileId(m.videoDriveFileId);
        const safeVideoData = sanitizeMediaSrc(m.videoData, "video");
        if (safeVideoDriveId) {
          const previewSrc = `https://drive.google.com/file/d/${encodeURIComponent(safeVideoDriveId)}/preview`;
          const dlSrc =
            sanitizeHttpUrl(m.videoUrl) ||
            `https://drive.google.com/uc?export=download&id=${encodeURIComponent(safeVideoDriveId)}`;
          videoHtml = `
            <div class="msg-video-wrap">
              <iframe class="msg-video-frame" src="${previewSrc}" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>
              <a class="msg-video-link" href="${escapeHtml(dlSrc)}" target="_blank" rel="noopener noreferrer">Videoyu İndir / Aç</a>
            </div>
          `;
        } else if (safeVideoData) {
          videoHtml = `
            <div class="msg-video-wrap">
              <video class="msg-video" controls playsinline preload="metadata" src="${escapeHtml(safeVideoData)}"></video>
            </div>
          `;
        }
        const audioSrc = sanitizeMediaSrc(m.audioUrl || m.audioData, "audio");
        const audioHtml = audioSrc
          ? `<audio class="msg-audio" controls preload="metadata" src="${escapeHtml(audioSrc)}"></audio>`
          : "";
        let locHtml = "";
        if (
          m.location &&
          Number.isFinite(m.location.lat) &&
          Number.isFinite(m.location.lng) &&
          Math.abs(m.location.lat) <= 90 &&
          Math.abs(m.location.lng) <= 180
        ) {
          const latStr = m.location.lat.toFixed(5);
          const lngStr = m.location.lng.toFixed(5);
          const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(latStr + "," + lngStr)}`;
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
        const textHtml = resolvedText
          ? `<div class="msg-text" data-raw-text="${escapeHtml(resolvedText)}">${formatMessageTextWithSearch(resolvedText, state.chatSearchQuery)}</div>`
          : "";
        let callLogHtml = "";
        if (m.callLog) {
          const st = m.callLog.state || "ringing";
          const isMissed = st === "missed" || st === "rejected";
          const dur = m.callLog.duration ? ` • ${escapeHtml(m.callLog.duration)}` : "";
          const label =
            st === "ringing"
              ? "Sesli arama başlatıldı..."
              : st === "connected"
              ? "Sesli görüşme devam ediyor..."
              : st === "ended"
              ? `Sesli arama${dur}`
              : st === "rejected"
              ? "Arama reddedildi"
              : "Cevapsız sesli arama";
          callLogHtml = `
            <div class="call-log-card${isMissed ? " missed" : ""}">
              <svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
              <span>${label}</span>
            </div>
          `;
        }
        const senderSafeAvatar = !isMe && senderUser ? sanitizeMediaSrc(senderUser.avatarData, "image") : "";
        const senderAvatarHtml = !isMe
          ? senderSafeAvatar
            ? `<img class="msg-avatar" data-view-user="${escapeHtml(m.senderId)}" src="${escapeHtml(senderSafeAvatar)}" alt=""${senderRingStyle(senderUser)} />`
            : `<div class="msg-avatar" data-view-user="${escapeHtml(m.senderId)}"${senderRingStyle(senderUser)}>${escapeHtml(liveSenderName.charAt(0).toUpperCase())}</div>`
          : "";
        return `
          <div class="msg-row ${isMe ? "me" : "other"}" data-msg-key="${escapeHtml(msgKey)}">
            ${senderAvatarHtml}
            <div class="msg-bubble ${isMe ? "me" : "other"}"${customStyle}>
              ${senderHtml}
              ${replyQuoteHtml}
              ${imgHtml}
              ${videoHtml}
              ${audioHtml}
              ${locHtml}
              ${callLogHtml}
              ${textHtml}
              <div class="msg-footer">
                ${reactBtnHtml}
                ${replyBtnHtml}
                ${delHtml}
                <span class="msg-time">${formatTime(m.timestamp)}</span>
                ${tickHtml}
              </div>
              ${reactionsHtml}
            </div>
          </div>
        `;
      })
      .join("");

    messagesContainer.querySelectorAll(".msg-image").forEach((imgEl) => {
      imgEl.addEventListener("click", () => {
        const safeFull = sanitizeMediaSrc(imgEl.dataset.full || imgEl.src, "image");
        if (!safeFull) return;
        imageModalImg.src = safeFull;
        const dl = sanitizeHttpUrl(imgEl.dataset.download);
        if (dl) {
          downloadImageBtn.href = dl;
          downloadImageBtn.classList.remove("hidden");
        } else {
          downloadImageBtn.removeAttribute("href");
          downloadImageBtn.classList.add("hidden");
        }
        imageModal.classList.remove("hidden");
        pushBackState("image-modal");
      });
    });

    messagesContainer.querySelectorAll("[data-view-user]").forEach((el) => {
      el.addEventListener("click", () => openUserProfileCard(el.dataset.viewUser));
    });

    const toggleMessageReaction = (msgKey, emojiKey) => {
      if (!state.db || !state.user || !msgKey || !emojiKey) return;
      const rRef = state.db.ref(`chats/${roomId}/messages/${msgKey}/reactions/${emojiKey}/${state.user.id}`);
      const curUsers = data[msgKey] && data[msgKey].reactions && data[msgKey].reactions[emojiKey];
      const alreadyMine = curUsers && Boolean(curUsers[state.user.id]);
      triggerHaptic(12);
      if (alreadyMine) {
        rRef.remove().catch(() => {});
      } else {
        rRef.set(true).catch(() => {});
      }
    };

    messagesContainer.querySelectorAll("[data-react-toggle]").forEach((pill) => {
      pill.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMessageReaction(pill.dataset.reactToggle, pill.dataset.emojiKey);
      });
    });

    messagesContainer.querySelectorAll("[data-react-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const msgKey = btn.dataset.reactOpen;
        const bubble = btn.closest(".msg-bubble");
        if (!bubble || !msgKey) return;
        const existingPop = bubble.querySelector(".reaction-picker-pop");
        messagesContainer.querySelectorAll(".reaction-picker-pop").forEach((p) => p.remove());
        if (existingPop) return;

        const pop = document.createElement("div");
        pop.className = "reaction-picker-pop";
        const emojis = getActiveReactionEmojis();
        pop.innerHTML = emojis
          .map((em) => `<button type="button" class="reaction-pick-emoji" data-pick-emoji="${escapeHtml(em)}">${escapeHtml(em)}</button>`)
          .join("");
        pop.querySelectorAll("[data-pick-emoji]").forEach((pickBtn) => {
          pickBtn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            const em = pickBtn.dataset.pickEmoji;
            pop.remove();
            toggleMessageReaction(msgKey, emojiToKey(em));
          });
        });
        bubble.appendChild(pop);
      });
    });

    messagesContainer.querySelectorAll("[data-reply-msg]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const msgKey = btn.dataset.replyMsg;
        const target = data[msgKey];
        if (!target) return;
        const sUser = state.usersCache[target.senderId];
        const sName = sUser ? getDisplayName(sUser) : (target.senderName || "?");
        setReplyTarget({
          msgKey,
          senderName: sName,
          preview: getReplySnippet(target, msgKey)
        });
      });
    });

    // Sola veya sağa kaydırarak yanıtla (Swipe-to-Reply)
    messagesContainer.querySelectorAll(".msg-row").forEach((row) => {
      const bubble = row.querySelector(".msg-bubble");
      const msgKey = row.dataset.msgKey;
      if (!bubble || !msgKey || !data[msgKey]) return;

      let startX = 0;
      let startY = 0;
      let currentDx = 0;
      let tracking = false;
      let horizontalLocked = false;
      let thresholdTriggered = false;

      row.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches.length !== 1) return;
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          currentDx = 0;
          tracking = true;
          horizontalLocked = false;
          thresholdTriggered = false;
          bubble.style.transition = "none";
        },
        { passive: true }
      );

      row.addEventListener(
        "touchmove",
        (e) => {
          if (!tracking || e.touches.length !== 1) return;
          const dx = e.touches[0].clientX - startX;
          const dy = e.touches[0].clientY - startY;

          if (!horizontalLocked) {
            if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) {
              tracking = false;
              return;
            }
            if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.35) {
              horizontalLocked = true;
            } else {
              return;
            }
          }

          currentDx = Math.max(-72, Math.min(72, dx));
          bubble.style.transform = `translateX(${currentDx}px)`;

          if (!thresholdTriggered && Math.abs(currentDx) >= 48) {
            thresholdTriggered = true;
            triggerHaptic(15);
          }
        },
        { passive: true }
      );

      const finishSwipe = () => {
        if (!tracking && !horizontalLocked) return;
        tracking = false;
        bubble.style.transition = "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)";
        bubble.style.transform = "translateX(0)";
        if (horizontalLocked && Math.abs(currentDx) >= 48) {
          const target = data[msgKey];
          const sUser = state.usersCache[target.senderId];
          const sName = sUser ? getDisplayName(sUser) : (target.senderName || "?");
          setReplyTarget({
            msgKey,
            senderName: sName,
            preview: getReplySnippet(target, msgKey)
          });
        }
        horizontalLocked = false;
        currentDx = 0;
      };

      row.addEventListener("touchend", finishSwipe, { passive: true });
      row.addEventListener("touchcancel", finishSwipe, { passive: true });
    });

    messagesContainer.querySelectorAll("[data-jump-msg]").forEach((el) => {
      el.addEventListener("click", () => {
        const key = el.dataset.jumpMsg;
        if (!key) return;
        const targetRow = messagesContainer.querySelector(`.msg-row[data-msg-key="${CSS.escape(key)}"]`);
        if (targetRow) {
          targetRow.classList.remove("search-active-msg");
          targetRow.classList.add("search-active-msg");
          targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => targetRow.classList.remove("search-active-msg"), 1500);
        }
      });
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
        if (state.liveLocRoomId === roomId && state.liveLocMsgKey === msgKey) {
          stopLiveLocation(true);
        }
        const fileIds = extractDriveFileIds(targetMsg);
        if (fileIds.length > 0) {
          await Promise.all(fileIds.map((fid) => deleteFromGoogleDrive(fid)));
        }
        await state.db.ref(`chats/${roomId}/messages/${msgKey}`).remove();
      });
    });

    if (state.chatSearchQuery) {
      applyChatSearch(false);
    } else {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function refreshReadTicks() {
    messagesContainer.querySelectorAll(".msg-tick").forEach((tickEl) => {
      const ts = Number(tickEl.dataset.msgTs || 0);
      const rState = getMessageReadState({ timestamp: ts });
      const tk = buildTickMarkup(rState);
      tickEl.className = tk.cls;
      tickEl.innerHTML = tk.svg;
      tickEl.title = tk.titleText;
    });
  }

  function senderRingStyle(senderUser) {
    return senderUser && isValidHexColor(senderUser.bannerColor)
      ? ` style="border-color:${senderUser.bannerColor};border-width:2px;cursor:pointer;"`
      : ` style="cursor:pointer;"`;
  }

  if (isGroup) {
    state.onGroupKeyReady = () => {
      if (state.activeRoom && state.activeRoom.id === "main_group" && state.preloadedChats["main_group"]) {
        renderRoomMessages(state.preloadedChats["main_group"], false);
      }
    };
  }

  if (state.preloadedChats[roomId]) {
    renderRoomMessages(state.preloadedChats[roomId], false);
  }

  state.deliveredByRef = state.db.ref(`chats/${roomId}/deliveredBy`);
  state.deliveredByRef.on("value", (snap) => {
    state.roomDeliveredBy = snap.val() || {};
    refreshReadTicks();
  });

  state.readByRef = state.db.ref(`chats/${roomId}/readBy`);
  state.readByRef.on("value", (snap) => {
    state.roomReadBy = snap.val() || {};
    refreshReadTicks();
  });

  state.chatRef = state.db.ref(`chats/${roomId}/messages`).limitToLast(100);
  state.chatRef.on("value", (snap) => {
    renderRoomMessages(snap.val() || {}, true);
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
  state.onGroupKeyReady = null;
  if (state.chatRef) {
    state.chatRef.off();
    state.chatRef = null;
  }
  if (state.readByRef) {
    state.readByRef.off();
    state.readByRef = null;
  }
  if (state.deliveredByRef) {
    state.deliveredByRef.off();
    state.deliveredByRef = null;
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
  clearPendingVideo();
  stopActiveRecording(true);
  clearPendingAudio();
  clearReplyTarget();
  closeAttachMenu();
  closeChatSearch();
  messageInput.value = "";
  resizeMessageInput();
  updateMicVisibility();
}

function setReplyTarget(replyObj) {
  state.replyTo = replyObj;
  if (replyPreviewSender) replyPreviewSender.textContent = replyObj.senderName || "";
  if (replyPreviewText) replyPreviewText.textContent = replyObj.preview || "";
  if (replyPreviewBar) replyPreviewBar.classList.remove("hidden");
  if (messageInput) {
    messageInput.focus();
    setTimeout(() => {
      syncVisualViewportHeight();
      if (messageForm) messageForm.scrollIntoView({ block: "end" });
      if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 120);
  }
}

function clearReplyTarget() {
  state.replyTo = null;
  if (replyPreviewSender) replyPreviewSender.textContent = "";
  if (replyPreviewText) replyPreviewText.textContent = "";
  if (replyPreviewBar) replyPreviewBar.classList.add("hidden");
}

if (cancelReplyBtn) {
  cancelReplyBtn.addEventListener("click", clearReplyTarget);
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && state.activeRoom && state.db && state.user) {
    const now = Date.now();
    state.roomReadBy[state.user.id] = now;
    state.db.ref(`chats/${state.activeRoom.id}/readBy/${state.user.id}`).set(now).catch(() => {});
  }
});

function focusSearchMatch(index) {
  state.chatSearchMatches.forEach((row) => row.classList.remove("search-active-msg"));
  if (state.chatSearchMatches.length === 0) {
    state.chatSearchIndex = -1;
    if (chatSearchCount) {
      chatSearchCount.textContent = state.chatSearchQuery ? "0" : "";
    }
    return;
  }
  const total = state.chatSearchMatches.length;
  state.chatSearchIndex = ((index % total) + total) % total;
  const activeRow = state.chatSearchMatches[state.chatSearchIndex];
  activeRow.classList.add("search-active-msg");
  activeRow.scrollIntoView({ behavior: "smooth", block: "center" });
  if (chatSearchCount) {
    chatSearchCount.textContent = `${state.chatSearchIndex + 1}/${total}`;
  }
}

function applyChatSearch(jumpToLatest = true) {
  const q = state.chatSearchQuery;
  const qLower = q.toLocaleLowerCase("tr-TR");
  const rows = Array.from(messagesContainer.querySelectorAll(".msg-row"));
  state.chatSearchMatches = [];

  rows.forEach((row) => {
    row.classList.remove("search-active-msg");
    const textEl = row.querySelector(".msg-text");
    if (textEl) {
      const raw = textEl.dataset.rawText || textEl.textContent || "";
      textEl.innerHTML = formatMessageTextWithSearch(raw, q);
    }
    if (!q) return;

    const rawText = textEl ? (textEl.dataset.rawText || textEl.textContent || "") : "";
    const senderEl = row.querySelector(".msg-sender");
    const senderText = senderEl ? senderEl.textContent || "" : "";
    const locEl = row.querySelector(".loc-card-title");
    const locText = locEl ? locEl.textContent || "" : "";

    const matched =
      rawText.toLocaleLowerCase("tr-TR").includes(qLower) ||
      senderText.toLocaleLowerCase("tr-TR").includes(qLower) ||
      locText.toLocaleLowerCase("tr-TR").includes(qLower);

    if (matched) {
      state.chatSearchMatches.push(row);
    }
  });

  if (!q) {
    state.chatSearchIndex = -1;
    if (chatSearchCount) chatSearchCount.textContent = "";
    return;
  }

  if (jumpToLatest) {
    focusSearchMatch(state.chatSearchMatches.length - 1);
  } else if (state.chatSearchMatches.length > 0) {
    const idx = Math.min(Math.max(state.chatSearchIndex, 0), state.chatSearchMatches.length - 1);
    focusSearchMatch(idx);
  } else {
    focusSearchMatch(-1);
  }
}

function closeChatSearch() {
  state.chatSearchQuery = "";
  state.chatSearchMatches = [];
  state.chatSearchIndex = -1;
  if (chatSearchInput) chatSearchInput.value = "";
  if (chatSearchCount) chatSearchCount.textContent = "";
  if (chatSearchBar) chatSearchBar.classList.add("hidden");
  applyChatSearch(false);
}

if (chatSearchBtn && chatSearchBar) {
  chatSearchBtn.addEventListener("click", () => {
    const opening = chatSearchBar.classList.contains("hidden");
    if (opening) {
      chatSearchBar.classList.remove("hidden");
      pushBackState("chat-search");
      if (chatSearchInput) chatSearchInput.focus();
    } else {
      closeChatSearch();
    }
  });
}

if (chatSearchInput) {
  chatSearchInput.addEventListener("input", () => {
    state.chatSearchQuery = chatSearchInput.value.trim();
    applyChatSearch(true);
  });
  chatSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (state.chatSearchMatches.length > 0) {
        focusSearchMatch(state.chatSearchIndex - 1);
      }
    } else if (e.key === "Escape") {
      closeChatSearch();
    }
  });
}

if (chatSearchPrev) {
  chatSearchPrev.addEventListener("click", () => {
    if (state.chatSearchMatches.length > 0) {
      focusSearchMatch(state.chatSearchIndex - 1);
    }
  });
}

if (chatSearchNext) {
  chatSearchNext.addEventListener("click", () => {
    if (state.chatSearchMatches.length > 0) {
      focusSearchMatch(state.chatSearchIndex + 1);
    }
  });
}

if (chatSearchClose) {
  chatSearchClose.addEventListener("click", closeChatSearch);
}

// =========================================================
// SESLİ ARAMA (DENEYSEL — WebRTC P2P + Firebase Sinyalleşme)
// =========================================================
const DEFAULT_STUN_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun.cloudflare.com:3478" }
];

async function getRtcConfig() {
  let iceServers = [...DEFAULT_STUN_SERVERS];
  let hasTurn = false;
  const apiUrl = state.turnConfig && state.turnConfig.apiUrl ? state.turnConfig.apiUrl.trim() : "";
  if (apiUrl) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 4500);
      const res = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(t);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data.iceServers) ? data.iceServers : []);
        if (list.length > 0) {
          iceServers = [...list, ...DEFAULT_STUN_SERVERS];
          hasTurn = list.some((s) => {
            const u = Array.isArray(s.urls) ? s.urls.join(",") : String(s.urls || s.url || "");
            return /turns?:/i.test(u);
          });
        }
      }
    } catch {}
  }
  return {
    config: { iceServers, iceCandidatePoolSize: 4 },
    hasTurn
  };
}

function startRingtone(kind = "incoming") {
  stopRingtone();
  const ringOnce = () => {
    if (kind === "incoming") {
      triggerHaptic([260, 140, 260]);
    }
    if (state.soundStyle === "off") return;
    const ctx = ensureAudioContext();
    if (!ctx) return;
    try {
      if (kind === "incoming") {
        // Klasik telefon zil melodisi
        playTone(ctx, 784, 0, 0.14, "sine", 0.1);
        playTone(ctx, 987, 0.15, 0.14, "sine", 0.1);
        playTone(ctx, 784, 0.32, 0.14, "sine", 0.1);
        playTone(ctx, 987, 0.47, 0.22, "sine", 0.1);
      } else {
        // Arayan taraf için çalma sesi ("dıııt...")
        playTone(ctx, 425, 0, 0.85, "sine", 0.05);
      }
    } catch {}
  };
  ringOnce();
  state.ringtoneInterval = setInterval(ringOnce, kind === "incoming" ? 2100 : 2800);
}

function stopRingtone() {
  clearInterval(state.ringtoneInterval);
  state.ringtoneInterval = null;
}

function listenIncomingCalls() {
  if (!state.db || !state.user) return;
  if (state.incomingCallRef) state.incomingCallRef.off();

  state.incomingCallRef = state.db.ref(`incomingCalls/${state.user.id}`);
  state.incomingCallRef.on("value", (snap) => {
    const incoming = snap.val();
    if (!incoming || !incoming.callId) return;
    if (Date.now() - (incoming.createdAt || 0) > 60000) {
      state.db.ref(`incomingCalls/${state.user.id}`).remove().catch(() => {});
      return;
    }
    if (state.activeCall) return;
    showIncomingCallPrompt(incoming);
  });
}

function showIncomingCallPrompt(incoming) {
  const callerUser = state.usersCache[incoming.callerId];
  const peerName = callerUser ? getDisplayName(callerUser) : (incoming.callerName || "Arkadaşın");
  const peerAvatar = (callerUser && callerUser.avatarData) || incoming.callerAvatar || "./icon-192.png";

  state.activeCall = {
    callId: incoming.callId,
    role: "callee",
    peerId: incoming.callerId,
    peerName,
    pc: null,
    localStream: null,
    muted: false,
    timerId: null,
    timeoutId: null,
    disconnectTimeoutId: null,
    callRef: state.db.ref(`calls/${incoming.callId}`),
    iceRef: null,
    pendingIce: []
  };

  callPeerAvatar.src = peerAvatar;
  callPeerName.textContent = peerName;
  callStatusText.textContent = "Gelen sesli arama...";
  callTimerEl.textContent = "00:00";
  callIncomingControls.classList.remove("hidden");
  callActiveControls.classList.add("hidden");
  callModal.classList.remove("hidden");
  startRingtone("incoming");
  if (document.visibilityState !== "visible") {
    showIncomingNotification(peerName, "Sesli arama geliyor...", "call_" + incoming.callId);
  }

  state.activeCall.callRef.child("status").on("value", (snap) => {
    const st = snap.val();
    if (st === "ended" || st === "rejected") {
      endCurrentCall(false, st === "ended" ? "Arama sonlandırıldı" : "Reddedildi");
    }
  });
}

async function startOutgoingVoiceCall(peerId, peerName) {
  if (state.activeCall) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof RTCPeerConnection === "undefined") {
    alert("Bu tarayıcı sesli aramayı (WebRTC) desteklemiyor.");
    return;
  }

  const peerUser = state.usersCache[peerId];
  const peerAvatar = (peerUser && peerUser.avatarData) || "./icon-192.png";
  const callId = `call_${state.user.id}_${peerId}_${Date.now()}`;
  const callRef = state.db.ref(`calls/${callId}`);
  const incomingRef = state.db.ref(`incomingCalls/${peerId}`);
  const dmRoomId = getDmRoomId(state.user.id, peerId);

  // Çift tıklamayı önlemek için state.activeCall'ı hemen kilitle
  const callObj = {
    callId,
    role: "caller",
    peerId,
    peerName,
    pc: null,
    localStream: null,
    muted: false,
    timerId: null,
    timeoutId: null,
    disconnectTimeoutId: null,
    hasTurn: false,
    connectedAt: 0,
    callRef,
    incomingRef,
    logRef: null,
    iceRef: callRef.child("calleeIce"),
    pendingIce: []
  };
  state.activeCall = callObj;

  callPeerAvatar.src = peerAvatar;
  callPeerName.textContent = peerName;
  callStatusText.textContent = "Mikrofon hazırlanıyor...";
  callTimerEl.textContent = "00:00";
  callIncomingControls.classList.add("hidden");
  callActiveControls.classList.remove("hidden");
  if (callMuteBtn) callMuteBtn.textContent = "Mikrofonu Kapat";
  callModal.classList.remove("hidden");

  try {
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (state.activeCall !== callObj) {
      localStream.getTracks().forEach((t) => t.stop());
      return;
    }
    callObj.localStream = localStream;

    const { config: rtcConfig, hasTurn } = await getRtcConfig();
    if (state.activeCall !== callObj) return;
    callObj.hasTurn = hasTurn;

    const pc = new RTCPeerConnection(rtcConfig);
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    callObj.pc = pc;

    const now = Date.now();
    const logMsgRef = await state.db.ref(`chats/${dmRoomId}/messages`).push({
      senderId: state.user.id,
      senderName: getDisplayName(state.user),
      text: "",
      callLog: {
        callId,
        state: "ringing",
        duration: ""
      },
      timestamp: now
    });
    callObj.logRef = logMsgRef.child("callLog");
    if (state.activeCall !== callObj) {
      callObj.logRef.update({ state: "missed", duration: "" }).catch(() => {});
      return;
    }

    callStatusText.textContent = "Aranıyor...";
    startRingtone("outgoing");

    const offer = await pc.createOffer();
    if (state.activeCall !== callObj) return;

    await callRef.set({
      callerId: state.user.id,
      calleeId: peerId,
      status: "ringing",
      offer: { type: offer.type, sdp: offer.sdp },
      createdAt: Date.now()
    });
    callRef.onDisconnect().update({ status: "ended" });

    // ICE dinleyicisini ve yerel tanımı callRef.set sonrasına koyarak callerIce adaylarının silinmesini önle
    wirePeerConnectionEvents(pc, callRef, "callerIce");
    await pc.setLocalDescription(offer);
    if (state.activeCall !== callObj) return;

    await incomingRef.set({
      callId,
      callerId: state.user.id,
      callerName: getDisplayName(state.user),
      callerAvatar: state.user.avatarData || "",
      createdAt: Date.now()
    });
    incomingRef.onDisconnect().remove();

    callObj.timeoutId = setTimeout(() => {
      if (state.activeCall === callObj && !callObj.timerId) {
        endCurrentCall(true, "Cevap verilmedi");
      }
    }, 45000);

    callRef.child("answer").on("value", async (snap) => {
      const answer = snap.val();
      if (!answer || state.activeCall !== callObj) return;
      if (pc.currentRemoteDescription) return;
      stopRingtone();
      clearTimeout(callObj.timeoutId);
      callStatusText.textContent = "Bağlanıyor...";
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        if (state.activeCall === callObj) {
          flushPendingIceCandidates(pc, callObj.pendingIce);
        }
      } catch {}
    });

    callRef.child("calleeIce").on("child_added", async (snap) => {
      const cand = snap.val();
      if (!cand || state.activeCall !== callObj) return;
      if (pc.remoteDescription) {
        pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
      } else {
        callObj.pendingIce.push(cand);
      }
    });

    callRef.child("status").on("value", (snap) => {
      const st = snap.val();
      if (st === "rejected") {
        endCurrentCall(false, "Arama reddedildi");
      } else if (st === "ended") {
        endCurrentCall(false, "Arama sonlandırıldı");
      }
    });
  } catch (err) {
    endCurrentCall(true);
    alert("Sesli arama başlatılamadı: " + (err.message || "Mikrofon izni gerekli"));
  }
}

async function acceptIncomingCall() {
  const call = state.activeCall;
  if (!call || call.role !== "callee" || call.accepting) return;
  call.accepting = true;

  stopRingtone();
  callIncomingControls.classList.add("hidden");
  callActiveControls.classList.remove("hidden");
  if (callMuteBtn) callMuteBtn.textContent = "Mikrofonu Kapat";
  callStatusText.textContent = "Bağlanıyor...";

  try {
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (state.activeCall !== call) {
      localStream.getTracks().forEach((t) => t.stop());
      return;
    }
    call.localStream = localStream;

    const { config: rtcConfig, hasTurn } = await getRtcConfig();
    if (state.activeCall !== call) return;
    call.hasTurn = hasTurn;

    const pc = new RTCPeerConnection(rtcConfig);
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    call.pc = pc;
    call.iceRef = call.callRef.child("callerIce");

    wirePeerConnectionEvents(pc, call.callRef, "calleeIce");
    call.callRef.onDisconnect().update({ status: "ended" });

    const offerSnap = await call.callRef.child("offer").once("value");
    if (state.activeCall !== call) return;
    const offer = offerSnap.val();
    if (!offer) {
      endCurrentCall(true, "Arama bulunamadı");
      return;
    }

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    if (state.activeCall !== call) return;
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    if (state.activeCall !== call) return;

    await call.callRef.update({
      status: "accepted",
      answer: { type: answer.type, sdp: answer.sdp }
    });
    await state.db.ref(`incomingCalls/${state.user.id}`).remove();
    if (state.activeCall !== call) return;

    call.callRef.child("callerIce").on("child_added", (snap) => {
      const cand = snap.val();
      if (!cand || state.activeCall !== call) return;
      if (pc.remoteDescription) {
        pc.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
      } else {
        call.pendingIce.push(cand);
      }
    });
    flushPendingIceCandidates(pc, call.pendingIce);
  } catch (err) {
    endCurrentCall(true);
    alert("Arama cevaplanamadı: " + (err.message || "Mikrofon hatası"));
  }
}

function wirePeerConnectionEvents(pc, callRef, localIceChild) {
  pc.onicecandidate = (e) => {
    if (e.candidate && e.candidate.candidate) {
      callRef.child(localIceChild).push(e.candidate.toJSON()).catch(() => {});
    }
  };

  pc.ontrack = (e) => {
    if (remoteCallAudio) {
      remoteCallAudio.srcObject = (e.streams && e.streams[0]) ? e.streams[0] : new MediaStream([e.track]);
      remoteCallAudio.play().catch(() => {});
    }
  };

  const handleStateUpdate = () => {
    if (!state.activeCall || state.activeCall.pc !== pc) return;
    const conn = pc.connectionState || "";
    const ice = pc.iceConnectionState || "";

    if (conn === "connected" || ice === "connected" || ice === "completed") {
      clearTimeout(state.activeCall.disconnectTimeoutId);
      state.activeCall.disconnectTimeoutId = null;
      stopRingtone();
      callStatusText.textContent = state.activeCall.hasTurn ? "Bağlandı (Sesli Görüşme)" : "Bağlandı (P2P Ses)";
      if (!state.activeCall.connectedAt) {
        state.activeCall.connectedAt = Date.now();
        if (state.activeCall.logRef) {
          state.activeCall.logRef.update({ state: "connected" }).catch(() => {});
        }
      }
      startCallTimer();
    } else if (conn === "disconnected" || ice === "disconnected") {
      if (callStatusText) callStatusText.textContent = "Bağlantı zayıf, yeniden bağlanılıyor...";
      if (typeof pc.restartIce === "function") {
        try { pc.restartIce(); } catch {}
      }
      clearTimeout(state.activeCall.disconnectTimeoutId);
      state.activeCall.disconnectTimeoutId = setTimeout(() => {
        if (state.activeCall && state.activeCall.pc === pc && pc.connectionState !== "connected" && pc.iceConnectionState !== "connected" && pc.iceConnectionState !== "completed") {
          endCurrentCall(true, "Bağlantı kesildi");
        }
      }, 6000);
    } else if (conn === "failed" || ice === "failed") {
      const msg = state.activeCall.hasTurn
        ? "Ağ bağlantısı kurulamadı"
        : "Ağ bağlantısı kurulamadı (Admin > TURN ayarı gerekli)";
      endCurrentCall(true, msg);
    } else if (conn === "closed") {
      endCurrentCall(true, "Bağlantı kesildi");
    }
  };

  pc.onconnectionstatechange = handleStateUpdate;
  pc.oniceconnectionstatechange = handleStateUpdate;
}

function flushPendingIceCandidates(pc, queue) {
  while (queue && queue.length > 0) {
    const c = queue.shift();
    pc.addIceCandidate(new RTCIceCandidate(c)).catch(() => {});
  }
}

function startCallTimer() {
  if (!state.activeCall || state.activeCall.timerId) return;
  let secs = 0;
  state.activeCall.timerId = setInterval(() => {
    secs += 1;
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    if (callTimerEl) callTimerEl.textContent = `${m}:${s}`;
  }, 1000);
}

function endCurrentCall(notifyRemote = true, reasonText = "") {
  const call = state.activeCall;
  if (!call) {
    stopRingtone();
    if (callModal) callModal.classList.add("hidden");
    return;
  }
  state.activeCall = null;
  stopRingtone();
  clearInterval(call.timerId);
  clearTimeout(call.timeoutId);
  clearTimeout(call.disconnectTimeoutId);

  if (call.localStream) {
    call.localStream.getTracks().forEach((t) => t.stop());
  }
  if (call.pc) {
    try {
      call.pc.onconnectionstatechange = null;
      call.pc.oniceconnectionstatechange = null;
      call.pc.close();
    } catch {}
  }
  if (remoteCallAudio) {
    remoteCallAudio.srcObject = null;
  }

  if (call.callRef) {
    call.callRef.child("status").off();
    call.callRef.child("answer").off();
    call.callRef.child("callerIce").off();
    call.callRef.child("calleeIce").off();
    call.callRef.onDisconnect().cancel().catch(() => {});
    if (notifyRemote) {
      call.callRef.update({ status: "ended" }).catch(() => {});
    }
  }
  if (call.role === "caller" && call.logRef) {
    if (call.connectedAt) {
      const totalSecs = Math.max(1, Math.round((Date.now() - call.connectedAt) / 1000));
      const m = String(Math.floor(totalSecs / 60)).padStart(2, "0");
      const s = String(totalSecs % 60).padStart(2, "0");
      call.logRef.update({ state: "ended", duration: `${m}:${s}` }).catch(() => {});
    } else if (reasonText === "Arama reddedildi") {
      call.logRef.update({ state: "rejected", duration: "" }).catch(() => {});
    } else {
      call.logRef.update({ state: "missed", duration: "" }).catch(() => {});
    }
  }

  if (call.role === "caller" && call.incomingRef) {
    call.incomingRef.onDisconnect().cancel().catch(() => {});
    call.incomingRef.remove().catch(() => {});
  } else if (call.role === "callee" && state.db && state.user) {
    state.db.ref(`incomingCalls/${state.user.id}`).remove().catch(() => {});
  }

  if (reasonText && callStatusText) {
    callStatusText.textContent = reasonText;
    setTimeout(() => {
      if (!state.activeCall && callModal) callModal.classList.add("hidden");
    }, 1000);
  } else if (callModal) {
    callModal.classList.add("hidden");
  }
}

if (voiceCallBtn) {
  voiceCallBtn.addEventListener("click", () => {
    if (!state.activeRoom || state.activeRoom.isGroup || !state.activeRoom.otherId) return;
    startOutgoingVoiceCall(state.activeRoom.otherId, state.activeRoom.title);
  });
}

if (callAcceptBtn) callAcceptBtn.addEventListener("click", acceptIncomingCall);

if (callRejectBtn) {
  callRejectBtn.addEventListener("click", () => {
    const call = state.activeCall;
    if (call && call.callRef) {
      call.callRef.update({ status: "rejected" }).catch(() => {});
    }
    endCurrentCall(false);
  });
}

if (callHangupBtn) {
  callHangupBtn.addEventListener("click", () => endCurrentCall(true));
}

if (callMuteBtn) {
  callMuteBtn.addEventListener("click", () => {
    if (!state.activeCall || !state.activeCall.localStream) return;
    state.activeCall.muted = !state.activeCall.muted;
    state.activeCall.localStream.getAudioTracks().forEach((t) => {
      t.enabled = !state.activeCall.muted;
    });
    callMuteBtn.textContent = state.activeCall.muted ? "Mikrofonu Aç" : "Mikrofonu Kapat";
  });
}

function resizeMessageInput() {
  if (!messageInput) return;
  messageInput.style.height = "auto";
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px";
}

function closeAttachMenu() {
  if (attachMenu) {
    attachMenu.classList.remove("open");
    attachMenu.setAttribute("aria-hidden", "true");
  }
  if (attachPlusBtn) {
    attachPlusBtn.classList.remove("open");
    attachPlusBtn.setAttribute("aria-expanded", "false");
  }
}

function toggleAttachMenu() {
  if (!attachMenu || !attachPlusBtn) return;
  const opening = !attachMenu.classList.contains("open");
  if (opening) {
    attachMenu.classList.add("open");
    attachMenu.setAttribute("aria-hidden", "false");
    attachPlusBtn.classList.add("open");
    attachPlusBtn.setAttribute("aria-expanded", "true");
  } else {
    closeAttachMenu();
  }
}

if (attachPlusBtn) {
  attachPlusBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!state.activeRoom) return;
    toggleAttachMenu();
  });
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".reaction-picker-pop") && !e.target.closest("[data-react-open]")) {
    document.querySelectorAll(".reaction-picker-pop").forEach((p) => p.remove());
  }
  if (!attachMenu || !attachMenu.classList.contains("open")) return;
  if (e.target.closest("#attach-menu") || e.target.closest("#attach-plus-btn")) return;
  closeAttachMenu();
});

function updateMicVisibility() {
  if (!micBtn || !messageInput) return;
  const isRecording = Boolean(state.mediaRecorder && state.mediaRecorder.state === "recording");
  const hasText = messageInput.value.trim().length > 0;
  const hasMedia = Boolean(state.pendingPhotoFile || state.pendingVideoFile || state.pendingAudioBlob);
  const showSend = (hasText || hasMedia) && !isRecording;

  micBtn.classList.toggle("is-collapsed", showSend);
  if (photoBtn) photoBtn.classList.toggle("is-collapsed", isRecording);
  if (attachPlusBtn) {
    const hidePlus = showSend || isRecording;
    attachPlusBtn.classList.toggle("is-collapsed", hidePlus);
    if (hidePlus) closeAttachMenu();
  }
  if (sendBtn) {
    sendBtn.classList.toggle("is-collapsed", !showSend);
  }
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
  updateMicVisibility();
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
  updateMicVisibility();
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
  updateMicVisibility();
}

function clearPendingVideo() {
  state.pendingVideoFile = null;
  if (state.pendingVideoUrl) {
    URL.revokeObjectURL(state.pendingVideoUrl);
    state.pendingVideoUrl = "";
  }
  if (videoPreviewPlayer) {
    videoPreviewPlayer.pause();
    videoPreviewPlayer.removeAttribute("src");
    videoPreviewPlayer.load();
  }
  if (videoPreviewName) videoPreviewName.textContent = "";
  if (videoPreviewBar) videoPreviewBar.classList.add("hidden");
  updateMicVisibility();
}

messageInput.addEventListener("focus", () => {
  setTimeout(() => {
    syncVisualViewportHeight();
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 150);
});

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
  if (state.liveLocRoomId === roomId) {
    stopLiveLocation(true);
  }
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
  const targetRoomId = state.activeRoom.id;
  const targetIsGroup = Boolean(state.activeRoom.isGroup);
  const targetOtherId = state.activeRoom.otherId || null;
  const text = messageInput.value.trim();
  const file = state.pendingPhotoFile;
  const videoFile = state.pendingVideoFile;
  const audioBlob = state.pendingAudioBlob;
  const audioMime = state.pendingAudioMime;
  const replyTo = state.replyTo ? { ...state.replyTo } : null;
  if (!text && !file && !videoFile && !audioBlob) {
    messageInput.focus({ preventScroll: true });
    return;
  }

  messageInput.value = "";
  resizeMessageInput();
  updateMicVisibility();
  clearReplyTarget();
  messageInput.focus({ preventScroll: true });
  clearTimeout(state.typingTimeout);
  state.db.ref(`chats/${targetRoomId}/typing/${state.user.id}`).remove();

  sendBtn.classList.remove("sending");
  void sendBtn.offsetWidth;
  sendBtn.classList.add("sending");
  playMessageSound("send");

  if (!file && !videoFile && !audioBlob) {
    const enc = await encryptOutgoingMessage({
      isGroup: targetIsGroup,
      otherId: targetOtherId,
      text,
      replyTo
    });
    const msgObj = {
      senderId: state.user.id,
      senderName: getDisplayName(state.user),
      text: enc.text,
      timestamp: Date.now()
    };
    if (enc.replyTo) msgObj.replyTo = enc.replyTo;
    if (enc.e2ee) msgObj.e2ee = enc.e2ee;
    await state.db.ref(`chats/${targetRoomId}/messages`).push(msgObj);
    return;
  }

  clearPendingPhoto();
  clearPendingVideo();
  clearPendingAudio();
  sendBtn.disabled = true;
  sendBtn.textContent = "Yükleniyor...";
  photoBtn.disabled = true;
  micBtn.disabled = true;
  try {
    const enc = await encryptOutgoingMessage({
      isGroup: targetIsGroup,
      otherId: targetOtherId,
      text,
      replyTo
    });
    const payload = {
      senderId: state.user.id,
      senderName: getDisplayName(state.user),
      text: enc.text,
      timestamp: Date.now()
    };
    if (enc.replyTo) payload.replyTo = enc.replyTo;
    if (enc.e2ee) payload.e2ee = enc.e2ee;

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

    if (videoFile) {
      if (state.driveConfig && state.driveConfig.url) {
        const uploadedVideo = await uploadVideoToGoogleDrive(videoFile);
        payload.videoUrl = uploadedVideo.downloadUrl;
        payload.videoDriveFileId = uploadedVideo.id;
      } else {
        if (videoFile.size > 4 * 1024 * 1024) {
          throw new Error("Drive bağlı değilken en fazla 4 MB video gönderilebilir");
        }
        payload.videoData = await blobToDataUrl(videoFile);
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

    await state.db.ref(`chats/${targetRoomId}/messages`).push(payload);
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
  closeAttachMenu();
  photoInput.click();
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files && photoInput.files[0];
  photoInput.value = "";
  if (!file || !state.activeRoom) return;

  if (file.type && file.type.startsWith("video/")) {
    const maxBytes = state.driveConfig && state.driveConfig.url ? 25 * 1024 * 1024 : 4 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(`Video boyutu en fazla ${Math.round(maxBytes / (1024 * 1024))} MB olabilir.`);
      return;
    }
    clearPendingPhoto();
    clearPendingVideo();
    state.pendingVideoFile = file;
    state.pendingVideoUrl = URL.createObjectURL(file);
    if (videoPreviewPlayer) videoPreviewPlayer.src = state.pendingVideoUrl;
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    if (videoPreviewName) videoPreviewName.textContent = `${file.name || "Video"} (${mb} MB)`;
    if (videoPreviewBar) videoPreviewBar.classList.remove("hidden");
    updateMicVisibility();
    messageInput.focus();
    return;
  }

  clearPendingVideo();
  clearPendingPhoto();
  state.pendingPhotoFile = file;
  state.pendingPhotoUrl = URL.createObjectURL(file);
  photoPreviewImg.src = state.pendingPhotoUrl;
  photoPreviewName.textContent = file.name || "Seçilen fotoğraf";
  photoPreviewBar.classList.remove("hidden");
  updateMicVisibility();
  messageInput.focus();
});

cancelPhotoBtn.addEventListener("click", clearPendingPhoto);
if (cancelVideoBtn) cancelVideoBtn.addEventListener("click", clearPendingVideo);
cancelAudioBtn.addEventListener("click", clearPendingAudio);

// Konum & Canlı Konum Paylaşımı
function stopLiveLocation(skipRemoteUpdate = false) {
  if (state.liveLocWatchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(state.liveLocWatchId);
    state.liveLocWatchId = null;
  }
  if (state.liveLocRoomId && state.liveLocMsgKey && state.db) {
    const locRef = state.db.ref(`chats/${state.liveLocRoomId}/messages/${state.liveLocMsgKey}/location`);
    locRef.onDisconnect().cancel().catch(() => {});
    if (!skipRemoteUpdate) {
      locRef.update({ active: false, updatedAt: Date.now() }).catch(() => {});
    }
  }
  state.liveLocRoomId = null;
  state.liveLocMsgKey = null;
  if (liveLocBar) liveLocBar.classList.add("hidden");
}

if (locBtn && locationModal) {
  locBtn.addEventListener("click", () => {
    if (!state.activeRoom) return;
    closeAttachMenu();
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
  stopLiveLocBtn.addEventListener("click", () => stopLiveLocation(false));
}

if (sendStaticLocBtn) {
  sendStaticLocBtn.addEventListener("click", () => {
    if (!state.activeRoom) return;
    if (!navigator.geolocation) {
      alert("Bu tarayıcı konum paylaşımını desteklemiyor.");
      return;
    }
    const targetRoomId = state.activeRoom.id;
    sendStaticLocBtn.disabled = true;
    sendStaticLocBtn.textContent = "Konum alınıyor...";
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const now = Date.now();
          await state.db.ref(`chats/${targetRoomId}/messages`).push({
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
          locationModal.classList.add("hidden");
        } catch (err) {
          alert("Konum gönderilemedi: " + (err.message || "Hata"));
        } finally {
          sendStaticLocBtn.disabled = false;
          sendStaticLocBtn.textContent = "Anlık Konum Gönder";
        }
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
    stopLiveLocation(false);
    startLiveLocBtn.disabled = true;
    startLiveLocBtn.textContent = "Başlatılıyor...";

    const roomId = state.activeRoom.id;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
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
          locationModal.classList.add("hidden");
        } catch (err) {
          alert("Canlı konum başlatılamadı: " + (err.message || "Hata"));
        } finally {
          startLiveLocBtn.disabled = false;
          startLiveLocBtn.textContent = "Canlı Konum Başlat";
        }
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
      updateMicVisibility();
    };

    recorder.start(250);
    closeAttachMenu();
    state.recordingSeconds = 0;
    micBtn.classList.add("mic-recording");
    micBtn.textContent = "00:00";
    updateMicVisibility();

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

function refreshCustomizeBgControls() {
  if (!bgTargetRoomSelect) return;
  const target = bgTargetRoomSelect.value || "global";
  const store = getRoomBgStore();
  let imgData = "";
  let pattern = "none";
  if (target === "global") {
    imgData = state.user ? state.user.chatBgData || "" : "";
    pattern = uiPrefs.bgPattern || "none";
  } else if (store[target]) {
    imgData = store[target].imageData || "";
    pattern = store[target].pattern || "none";
  }
  if (bgPatternSelect) bgPatternSelect.value = pattern;
  if (profileBgPreview) {
    const safePreviewBg = sanitizeChatBgData(imgData);
    if (safePreviewBg) {
      profileBgPreview.style.backgroundImage = `url("${safePreviewBg}")`;
      profileBgPreview.classList.remove("hidden");
    } else {
      profileBgPreview.style.backgroundImage = "";
      profileBgPreview.classList.add("hidden");
    }
  }
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
  if (bgTargetRoomSelect && state.user) {
    const groupTitle = (state.mainGroupInfo && state.mainGroupInfo.name) || "Ana Grup";
    const options = [
      `<option value="global">Tüm Sohbetler (Varsayılan)</option>`,
      `<option value="main_group">${escapeHtml(groupTitle)} (Sadece Grup)</option>`
    ];
    Object.entries(state.usersCache || {}).forEach(([uid, u]) => {
      if (uid === state.user.id || !u || u.active === false) return;
      const dmId = getDmRoomId(state.user.id, uid);
      options.push(`<option value="${escapeHtml(dmId)}">${escapeHtml(getDisplayName(u))} (Özel Sohbet)</option>`);
    });
    bgTargetRoomSelect.innerHTML = options.join("");
    bgTargetRoomSelect.value = state.activeRoom ? state.activeRoom.id : "global";
  }
  refreshCustomizeBgControls();

  if (bgBlurRange) bgBlurRange.value = String(uiPrefs.bgBlur ?? 9);
  if (bgBlurValue) bgBlurValue.textContent = `${uiPrefs.bgBlur ?? 9}px`;
  if (bgBrightRange) bgBrightRange.value = String(uiPrefs.bgBrightness ?? 65);
  if (bgBrightValue) bgBrightValue.textContent = `${uiPrefs.bgBrightness ?? 65}%`;
  if (prefBubbleStyleSelect) prefBubbleStyleSelect.value = uiPrefs.bubbleStyle || "rounded";
  if (prefFontSizeSelect) prefFontSizeSelect.value = uiPrefs.fontSize || "normal";
  if (prefFontFamilySelect) prefFontFamilySelect.value = uiPrefs.fontFamily || "modern";
  if (prefDensitySelect) prefDensitySelect.value = uiPrefs.density || "normal";
  if (prefAnimModeSelect) prefAnimModeSelect.value = uiPrefs.animMode || "full";
  if (prefHapticToggle) prefHapticToggle.checked = uiPrefs.haptic !== false;
  if (prefReactionPresetSelect) prefReactionPresetSelect.value = uiPrefs.reactionPreset || "classic";
  if (prefReactionCustomInput) {
    prefReactionCustomInput.value = uiPrefs.reactionCustom || "❤️ 😂 👍 🔥 😮";
    prefReactionCustomInput.classList.toggle("hidden", uiPrefs.reactionPreset !== "custom");
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
  viewUserAvatar.src = sanitizeMediaSrc(u.avatarData, "image") || "./icon-192.png";
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

function renderGroupMembersList() {
  if (!groupMembersList) return;
  const members = Object.entries(state.usersCache || {})
    .filter(([, u]) => u && u.active !== false)
    .sort(([, a], [, b]) => {
      if (Boolean(a.online) !== Boolean(b.online)) return a.online ? -1 : 1;
      return getDisplayName(a).localeCompare(getDisplayName(b), "tr");
    });

  if (groupMembersLabel) {
    groupMembersLabel.textContent = `Grup Üyeleri (${members.length})`;
  }

  if (members.length === 0) {
    groupMembersList.innerHTML = `<div class="empty-hint">Aktif üye bulunamadı.</div>`;
    return;
  }

  groupMembersList.innerHTML = members
    .map(([uid, u]) => {
      const disp = getDisplayName(u);
      const isSelf = state.user && uid === state.user.id;
      const emojiPrefix = u.statusEmoji ? `${escapeHtml(u.statusEmoji)} ` : "";
      const safeMemberAvatar = sanitizeMediaSrc(u.avatarData, "image");
      const avatarHtml = safeMemberAvatar
        ? `<img class="avatar-img" src="${escapeHtml(safeMemberAvatar)}" alt="" />`
        : `<div class="avatar">${escapeHtml(disp.charAt(0).toUpperCase())}</div>`;
      const statusText = u.online
        ? "Çevrimiçi"
        : u.lastSeen
        ? `Son görülme ${formatTime(u.lastSeen)}`
        : "Üye";
      const adminBadge = u.isAdmin ? `<span class="group-member-badge">Yönetici</span>` : "";
      const selfBadge = isSelf ? `<span class="group-member-badge self">Sen</span>` : "";
      return `
        <button type="button" class="group-member-row" data-member-id="${escapeHtml(uid)}">
          ${avatarHtml}
          <div class="group-member-info">
            <div class="group-member-name">${emojiPrefix}${escapeHtml(disp)}${adminBadge}${selfBadge}</div>
            <div class="user-sub">@${escapeHtml(u.name || "")} • ${statusText}</div>
          </div>
          ${u.online ? '<span class="online-dot" title="Çevrimiçi"></span>' : ""}
        </button>
      `;
    })
    .join("");

  groupMembersList.querySelectorAll("[data-member-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const uid = btn.dataset.memberId;
      if (uid) openUserProfileCard(uid);
    });
  });
}

function openGroupSettingsModal() {
  if (!groupSettingsModal) return;
  const info = state.mainGroupInfo || {};
  const gName = info.name || "Ana Grup";
  const gDesc = info.description || "Tüm yetkili arkadaşlar";
  const gAvatar = sanitizeMediaSrc(info.avatarData, "image");
  const isAdmin = Boolean(state.user && state.user.isAdmin);

  if (groupAvatarPreview) groupAvatarPreview.src = gAvatar || "./icon-192.png";
  if (groupAvatarControls) groupAvatarControls.classList.toggle("hidden", !isAdmin);
  if (groupInfoEditCard) groupInfoEditCard.classList.toggle("hidden", !isAdmin);
  if (groupAvatarRemoveBtn) groupAvatarRemoveBtn.classList.toggle("hidden", !gAvatar || !isAdmin);
  if (groupSettingsSubtitle) groupSettingsSubtitle.textContent = isAdmin ? gDesc : `${gName} • ${gDesc}`;
  if (groupNameInput) groupNameInput.value = gName;
  if (groupDescInput) groupDescInput.value = gDesc;

  renderGroupMembersList();
  groupSettingsModal.classList.remove("hidden");
  pushBackState("group-settings-modal");
}

if (groupSettingsBtn) {
  groupSettingsBtn.addEventListener("click", openGroupSettingsModal);
}

if (closeGroupSettingsBtn && groupSettingsModal) {
  closeGroupSettingsBtn.addEventListener("click", () => {
    groupSettingsModal.classList.add("hidden");
  });
}

if (groupAvatarBtn && groupAvatarInput) {
  groupAvatarBtn.addEventListener("click", () => {
    if (!state.user || !state.user.isAdmin) return;
    groupAvatarInput.click();
  });
  groupAvatarInput.addEventListener("change", () => {
    if (!state.user || !state.user.isAdmin) return;
    const file = groupAvatarInput.files && groupAvatarInput.files[0];
    groupAvatarInput.value = "";
    if (!file) return;
    openAvatarCropModal(file, {
      title: "Grup Fotoğrafını Ayarla",
      outputSize: 256,
      onSave: async (dataUrl) => {
        if (!state.user || !state.user.isAdmin) return;
        await state.db.ref("config/mainGroup").update({ avatarData: dataUrl });
        state.mainGroupInfo.avatarData = dataUrl;
        applyMainGroupInfoUI();
      }
    });
  });
}

if (groupAvatarRemoveBtn) {
  groupAvatarRemoveBtn.addEventListener("click", async () => {
    if (!state.user || !state.user.isAdmin) return;
    if (!confirm("Grup fotoğrafı kaldırılsın mı?")) return;
    await state.db.ref("config/mainGroup").update({ avatarData: "" });
    state.mainGroupInfo.avatarData = "";
    applyMainGroupInfoUI();
  });
}

if (saveGroupInfoBtn) {
  const saveGroupInfo = async () => {
    if (!state.user || !state.user.isAdmin) return;
    const name = (groupNameInput && groupNameInput.value.trim().slice(0, 32)) || "Ana Grup";
    const description =
      (groupDescInput && groupDescInput.value.trim().slice(0, 80)) || "Tüm yetkili arkadaşlar";
    await state.db.ref("config/mainGroup").update({ name, description });
    state.mainGroupInfo.name = name;
    state.mainGroupInfo.description = description;
    applyMainGroupInfoUI();
    alert("Grup bilgileri kaydedildi!");
  };
  saveGroupInfoBtn.addEventListener("click", saveGroupInfo);
  [groupNameInput, groupDescInput].forEach((inp) => {
    if (!inp) return;
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveGroupInfo();
      }
    });
  });
}

if (chatRoomHeaderInfo) {
  chatRoomHeaderInfo.addEventListener("click", (e) => {
    if (e.target.closest("#chat-back-btn")) return;
    if (!state.activeRoom) return;
    if (state.activeRoom.isGroup) {
      openGroupSettingsModal();
    } else if (state.activeRoom.otherId) {
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

if (bgTargetRoomSelect) {
  bgTargetRoomSelect.addEventListener("change", refreshCustomizeBgControls);
}

if (bgPatternSelect) {
  bgPatternSelect.addEventListener("change", () => {
    if (!state.user) return;
    const target = bgTargetRoomSelect ? bgTargetRoomSelect.value : "global";
    const pattern = bgPatternSelect.value || "none";
    if (target === "global") {
      saveUiPrefs({ bgPattern: pattern });
    } else {
      const store = getRoomBgStore();
      store[target] = { ...(store[target] || {}), pattern };
      setRoomBgStore(store);
      applyActiveRoomBackground(state.activeRoom ? state.activeRoom.id : "global");
    }
  });
}

if (bgBlurRange) {
  bgBlurRange.addEventListener("input", () => {
    const val = Number(bgBlurRange.value);
    if (bgBlurValue) bgBlurValue.textContent = `${val}px`;
    saveUiPrefs({ bgBlur: val });
  });
}

if (bgBrightRange) {
  bgBrightRange.addEventListener("input", () => {
    const val = Number(bgBrightRange.value);
    if (bgBrightValue) bgBrightValue.textContent = `${val}%`;
    saveUiPrefs({ bgBrightness: val });
  });
}

if (prefBubbleStyleSelect) {
  prefBubbleStyleSelect.addEventListener("change", () => saveUiPrefs({ bubbleStyle: prefBubbleStyleSelect.value }));
}
if (prefFontSizeSelect) {
  prefFontSizeSelect.addEventListener("change", () => saveUiPrefs({ fontSize: prefFontSizeSelect.value }));
}
if (prefFontFamilySelect) {
  prefFontFamilySelect.addEventListener("change", () => saveUiPrefs({ fontFamily: prefFontFamilySelect.value }));
}
if (prefDensitySelect) {
  prefDensitySelect.addEventListener("change", () => saveUiPrefs({ density: prefDensitySelect.value }));
}
if (prefAnimModeSelect) {
  prefAnimModeSelect.addEventListener("change", () => saveUiPrefs({ animMode: prefAnimModeSelect.value }));
}
if (prefHapticToggle) {
  prefHapticToggle.addEventListener("change", () => saveUiPrefs({ haptic: prefHapticToggle.checked }));
}
if (prefReactionPresetSelect) {
  prefReactionPresetSelect.addEventListener("change", () => {
    const val = prefReactionPresetSelect.value;
    if (prefReactionCustomInput) prefReactionCustomInput.classList.toggle("hidden", val !== "custom");
    saveUiPrefs({ reactionPreset: val });
  });
}
if (prefReactionCustomInput) {
  prefReactionCustomInput.addEventListener("change", () => {
    saveUiPrefs({ reactionCustom: prefReactionCustomInput.value.trim() || "❤️ 😂 👍 🔥 😮" });
  });
}
if (hideReadToggle) {
  hideReadToggle.addEventListener("change", () => saveUiPrefs({ hideReadReceipts: hideReadToggle.checked }));
}

if (profileBgBtn && profileBgInput) {
  profileBgBtn.addEventListener("click", () => profileBgInput.click());
  profileBgInput.addEventListener("change", async () => {
    const file = profileBgInput.files && profileBgInput.files[0];
    profileBgInput.value = "";
    if (!file || !state.user) return;
    const target = bgTargetRoomSelect ? bgTargetRoomSelect.value : "global";
    profileBgBtn.disabled = true;
    profileBgBtn.textContent = "Kaydediliyor...";
    try {
      const chatBgData = await compressImageToBase64(file, 720, 0.7);
      if (target === "global") {
        await state.db.ref("users/" + state.user.id + "/chatBgData").set(chatBgData);
        state.user.chatBgData = chatBgData;
      } else {
        const store = getRoomBgStore();
        store[target] = { ...(store[target] || {}), imageData: chatBgData };
        setRoomBgStore(store);
      }
      applyActiveRoomBackground(state.activeRoom ? state.activeRoom.id : "global");
      refreshCustomizeBgControls();
    } catch {
      alert("Arka plan yüklenemedi.");
    } finally {
      profileBgBtn.disabled = false;
      profileBgBtn.textContent = "Fotoğraf Seç";
    }
  });
}

if (resetBgBtn) {
  resetBgBtn.addEventListener("click", async () => {
    if (!state.user) return;
    const target = bgTargetRoomSelect ? bgTargetRoomSelect.value : "global";
    if (target === "global") {
      await state.db.ref("users/" + state.user.id + "/chatBgData").remove();
      state.user.chatBgData = "";
      saveUiPrefs({ bgPattern: "none" });
    } else {
      const store = getRoomBgStore();
      delete store[target];
      setRoomBgStore(store);
    }
    applyActiveRoomBackground(state.activeRoom ? state.activeRoom.id : "global");
    refreshCustomizeBgControls();
  });
}

closeProfileBtn.addEventListener("click", () => {
  profileModal.classList.add("hidden");
});

profileAvatarBtn.addEventListener("click", () => profileAvatarInput.click());

profileAvatarInput.addEventListener("change", () => {
  const file = profileAvatarInput.files && profileAvatarInput.files[0];
  profileAvatarInput.value = "";
  if (!file || !state.user) return;
  openAvatarCropModal(file, {
    title: "Profil Fotoğrafını Ayarla",
    outputSize: 200,
    onSave: async (avatarData) => {
      await state.db.ref("users/" + state.user.id + "/avatarData").set(avatarData);
      state.user.avatarData = avatarData;
      headerAvatar.src = avatarData;
      profileAvatarPreview.src = avatarData;
    }
  });
});

// Dairesel Fotoğraf Kırpma & Ebat Ayarlama
const cropState = {
  img: null,
  zoom: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  outputSize: 256,
  onSave: null,
  dragging: false,
  lastX: 0,
  lastY: 0
};

function drawCropCanvas() {
  if (!cropCanvas || !cropState.img) return;
  const ctx = cropCanvas.getContext("2d");
  const size = cropCanvas.width;
  const half = size / 2;
  const img = cropState.img;
  const rotRad = (cropState.rotation * Math.PI) / 180;
  const swapped = cropState.rotation % 180 !== 0;
  const effW = swapped ? img.height : img.width;
  const effH = swapped ? img.width : img.height;
  const baseScale = Math.max(size / effW, size / effH);
  const scale = baseScale * cropState.zoom;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.translate(half + cropState.offsetX, half + cropState.offsetY);
  ctx.rotate(rotRad);
  ctx.scale(scale, scale);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();

  // Dairesel alanın dışını karart
  ctx.save();
  ctx.fillStyle = "rgba(2, 6, 23, 0.62)";
  ctx.beginPath();
  ctx.rect(0, 0, size, size);
  ctx.arc(half, half, half - 6, 0, Math.PI * 2, true);
  ctx.fill("evenodd");
  ctx.restore();

  // Daire çerçevesi
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(half, half, half - 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function closeAvatarCropModal() {
  cropState.img = null;
  cropState.onSave = null;
  cropState.dragging = false;
  if (avatarCropModal) avatarCropModal.classList.add("hidden");
}

function openAvatarCropModal(file, opts = {}) {
  if (!avatarCropModal || !cropCanvas) return;
  if (!file.type || !file.type.startsWith("image/")) {
    alert("Lütfen geçerli bir fotoğraf dosyası seç.");
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => alert("Fotoğraf okunamadı.");
  reader.onload = () => {
    const img = new Image();
    img.onerror = () => alert("Fotoğraf yüklenemedi.");
    img.onload = () => {
      cropState.img = img;
      cropState.zoom = 1;
      cropState.rotation = 0;
      cropState.offsetX = 0;
      cropState.offsetY = 0;
      cropState.outputSize = opts.outputSize || 256;
      cropState.onSave = opts.onSave || null;
      if (cropModalTitle) cropModalTitle.textContent = opts.title || "Fotoğrafı Ayarla";
      if (cropZoomRange) cropZoomRange.value = "1";
      if (cropZoomValue) cropZoomValue.textContent = "1.0x";
      drawCropCanvas();
      avatarCropModal.classList.remove("hidden");
      pushBackState("avatar-crop-modal");
    };
    img.src = String(reader.result || "");
  };
  reader.readAsDataURL(file);
}

if (closeCropBtn) {
  closeCropBtn.addEventListener("click", closeAvatarCropModal);
}

if (cropZoomRange) {
  cropZoomRange.addEventListener("input", () => {
    cropState.zoom = parseFloat(cropZoomRange.value) || 1;
    if (cropZoomValue) cropZoomValue.textContent = `${cropState.zoom.toFixed(1)}x`;
    drawCropCanvas();
  });
}

if (cropRotateBtn) {
  cropRotateBtn.addEventListener("click", () => {
    cropState.rotation = (cropState.rotation + 90) % 360;
    cropState.offsetX = 0;
    cropState.offsetY = 0;
    drawCropCanvas();
  });
}

if (cropResetBtn) {
  cropResetBtn.addEventListener("click", () => {
    cropState.zoom = 1;
    cropState.rotation = 0;
    cropState.offsetX = 0;
    cropState.offsetY = 0;
    if (cropZoomRange) cropZoomRange.value = "1";
    if (cropZoomValue) cropZoomValue.textContent = "1.0x";
    drawCropCanvas();
  });
}

if (cropCanvas) {
  cropCanvas.addEventListener("pointerdown", (e) => {
    cropState.dragging = true;
    cropState.lastX = e.clientX;
    cropState.lastY = e.clientY;
    if (cropCanvas.setPointerCapture) {
      try { cropCanvas.setPointerCapture(e.pointerId); } catch {}
    }
  });
  cropCanvas.addEventListener("pointermove", (e) => {
    if (!cropState.dragging) return;
    const dx = e.clientX - cropState.lastX;
    const dy = e.clientY - cropState.lastY;
    cropState.lastX = e.clientX;
    cropState.lastY = e.clientY;
    cropState.offsetX += dx;
    cropState.offsetY += dy;
    drawCropCanvas();
  });
  const endCropDrag = () => {
    cropState.dragging = false;
  };
  cropCanvas.addEventListener("pointerup", endCropDrag);
  cropCanvas.addEventListener("pointercancel", endCropDrag);
}

if (cropSaveBtn) {
  cropSaveBtn.addEventListener("click", async () => {
    if (!cropState.img || !cropCanvas) return;
    const outSize = cropState.outputSize || 256;
    const srcSize = cropCanvas.width;
    const circleRadius = srcSize / 2 - 6;
    const ratio = outSize / (circleRadius * 2);

    const out = document.createElement("canvas");
    out.width = outSize;
    out.height = outSize;
    const ctx = out.getContext("2d");

    const img = cropState.img;
    const rotRad = (cropState.rotation * Math.PI) / 180;
    const swapped = cropState.rotation % 180 !== 0;
    const effW = swapped ? img.height : img.width;
    const effH = swapped ? img.width : img.height;
    const baseScale = Math.max(srcSize / effW, srcSize / effH);
    const scale = baseScale * cropState.zoom * ratio;

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, outSize, outSize);
    ctx.save();
    ctx.translate(outSize / 2 + cropState.offsetX * ratio, outSize / 2 + cropState.offsetY * ratio);
    ctx.rotate(rotRad);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    const dataUrl = out.toDataURL("image/jpeg", 0.82);
    const onSave = cropState.onSave;
    cropSaveBtn.disabled = true;
    cropSaveBtn.textContent = "Kaydediliyor...";
    try {
      if (onSave) await onSave(dataUrl);
      closeAvatarCropModal();
    } catch {
      alert("Fotoğraf kaydedilemedi.");
    } finally {
      cropSaveBtn.disabled = false;
      cropSaveBtn.textContent = "Kırp ve Kaydet";
    }
  });
}

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
  if (turnApiUrlInput) turnApiUrlInput.value = (state.turnConfig && state.turnConfig.apiUrl) || "";
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

if (turnConfigForm) {
  turnConfigForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const apiUrl = turnApiUrlInput ? turnApiUrlInput.value.trim() : "";
    await state.db.ref("config/turn").set({ apiUrl });
    alert(apiUrl ? "TURN sunucusu ayarı kaydedildi." : "TURN ayarı temizlendi.");
  });
}

closeAdminBtn.addEventListener("click", () => {
  adminModal.classList.add("hidden");
  if (state.invitesRef) {
    state.invitesRef.off();
    state.invitesRef = null;
  }
});

inviteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!state.user || !state.user.isAdmin) return;
  const label = inviteLabelInput.value.trim();
  if (!label) return;

  const code = generateStrongInviteCode();
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

// =========================================================
// DUYURULAR & SÜRÜM GEÇMİŞİ (v1 – v60)
// =========================================================
const APP_CHANGELOG = [
  {
    v: "v60",
    title: "Büyük Özelleştirme, Tepkiler & Gizlilik Güncellemesi",
    desc: "Artık neler yapabilirsiniz: 1) Ayarlar > Özelleştirme'den baloncuk tarzını (Yuvarlak, Kapsül, Köşeli, Buzlu Cam), yazı boyutunu (Küçük/Normal/Büyük), yazı tipini (Modern/Yuvarlak/Serif/Mono) ve Kompakt/Ferah görünümü değiştirebilirsiniz. 2) Her sohbete özel arka plan veya hazır desenler (Aurora, Yıldızlar, Cyber Izgara, Dalga) seçip bulanıklık ve parlaklığı kaydırıcıyla ayarlayabilirsiniz. 3) Mesajlara gülen yüz ikonuyla tepki (❤️ 😂 🔥 👍 😮) bırakabilir ve kendi tepki paketinizi seçebilirsiniz. 4) Animasyon hızını ve dokunsal titreşimi (Haptic) kontrol edebilirsiniz. 5) Ayarlar > Gizlilik altından Okundu Bilgisini (Mavi Tik) kapatabilirsiniz."
  },
  { v: "v59", title: "Duyurular Sayfası & Sürüm Geçmişi", desc: "Karşılama ekranına Duyurular kartı, Yönetici duyuru paylaşımı ve v1'den bugüne tüm sürüm notları eklendi." },
  { v: "v58", title: "Animasyonlu + Menüsü & Yeni Alt Bar", desc: "Mesaj barı yenilendi: Mikrofon, Fotoğraf/Video ve + tuşu düzenlendi; + içinden animasyonlu Konum menüsü eklendi." },
  { v: "v57", title: "Uçtan Uca Şifreleme (E2EE) & Secured By HydrOS", desc: "ECDH P-256 + AES-GCM-256 ile mesajlar uçtan uca şifrelendi; yükleme ekranına Secured By HydrOS rozeti eklendi." },
  { v: "v56", title: "4 Katmanlı Güvenlik Sıkılaştırması", desc: "Firebase Anonymous Auth, veritabanı güvenlik kuralları, tuzlu PBKDF2 şifreler, 8 haneli davet kodu ve XSS koruması eklendi." },
  { v: "v55", title: "Dairesel Fotoğraf Kırpıcı & Grup İsmi", desc: "Grup ve profil fotoğraflarını sürükleyip yakınlaştırarak kesme ekranı ile grup adı/açıklaması düzenleme eklendi." },
  { v: "v54", title: "Ana Grup Ayarları", desc: "Ana Grup için grup fotoğrafı, grup adı/açıklaması ve çevrimiçi sıralı Grup Üyeleri listesi eklendi." },
  { v: "v53", title: "Video Gönderme", desc: "Galeriden 25 MB'a kadar video seçme, önizleme, iOS/Android uyumlu oynatıcı ve silince Drive'dan temizleme eklendi." },
  { v: "v52", title: "Genel Hata Temizliği (11 Bug Fix)", desc: "Yanıtla çubuğu görünürlüğü, gelen arama önceliği, kayıt ekranı kaydırma ve canlı konum hayalet mesajı düzeltildi." },
  { v: "v51", title: "iOS Bildirim & Ana Ekran Rozeti", desc: "iPhone PWA bildirim uyumu ve ana ekran ikonunda okunmamış mesaj sayısı rozeti eklendi." },
  { v: "v50", title: "Sesli Arama TURN Sunucu Ayarı", desc: "Farklı Wi-Fi ve mobil ağlarda WebRTC bağlantısı için Admin paneline TURN ayarı eklendi." },
  { v: "v49", title: "Arama ICE & Kopma Düzeltmesi", desc: "Sesli aramada ICE adaylarının silinmesi engellendi ve geçici ağ kopma toleransı eklendi." },
  { v: "v48", title: "Arama Zil Sesi & Sohbet Kaydı", desc: "Gelen/giden arama zil sesleri, titreşim ve sohbet içine canlı arama durumu kartı eklendi." },
  { v: "v47", title: "Sesli Arama (Deneysel)", desc: "WebRTC tabanlı birebir sesli arama altyapısı eklendi." },
  { v: "v46", title: "WhatsApp Tarzı İletildi & Görüldü Tikleri", desc: "Tek tik (Gönderildi), gri çift tik (İletildi) ve mavi çift tik (Görüldü) durumları eklendi." },
  { v: "v45", title: "Kaydırarak Yanıtla & Klavye Uyumu", desc: "Mesajı sağa veya sola kaydırarak yanıtlama ve yanıt çubuğu açıkken klavye konum düzeltmesi yapıldı." },
  { v: "v44", title: "Mesaj Yanıtlama, Okundu & Özel Sesler", desc: "Mesajlara alıntılı yanıt verme, okundu bilgisi ve seçilebilir gönderme/alma sesleri eklendi." },
  { v: "v43", title: "Otomatik Uygulama Güncelleme Bildirimi", desc: "Yeni sürüm yüklendiğinde ekranın üstünde 'Uygulama güncelleniyor' bildirimi ve otomatik yenileme eklendi." },
  { v: "v42", title: "Sohbet Üst Bar Düzenlemesi", desc: "+ Mekan butonu yalnızca Ana Grup sohbetinde görünecek şekilde düzenlendi." },
  { v: "v41", title: "Sohbet İçi Mesaj Arama", desc: "Grup ve özel sohbetlerin üst barına mesajlarda arama ve vurgulama özelliği eklendi." },
  { v: "v40", title: "Mesaj Ön Yükleme Ekranı", desc: "Uygulama açılmadan önce mesajları ve kişileri hazırlayan yükleme ekranı eklendi." },
  { v: "v39", title: "Otomatik Büyüyen Mesaj Kutusu", desc: "Yazı uzadıkça yukarı doğru genişleyen mesaj yazma alanı eklendi." },
  { v: "v38", title: "Klavye Odak Koruması", desc: "Gönder butonuna basıldığında mobil klavyenin kendiliğinden kapanmaması sağlandı." },
  { v: "v37", title: "Ayarlar Menüsü Sınıflandırması", desc: "Profil ve Özelleştirme seçenekleri ayrı kategoriler altında düzenlendi." },
  { v: "v36", title: "Genişletilmiş Renk Temaları", desc: "18 hazır tema, özel hex/arka plan seçici ve rastgele renk üretici eklendi." },
  { v: "v35", title: "Uygulama Renk Temaları", desc: "Ayarlar menüsüne canlı uygulama renk teması değiştirme sistemi eklendi." },
  { v: "v34", title: "Ayarlar Sekmesi & Sade Üst Bar", desc: "Yetkiler, Bildirimler, Profil ve Çıkış butonları tek Ayarlar menüsünde toplandı." },
  { v: "v33", title: "Android Geri Tuşu Desteği", desc: "Telefonda geri tuşuna basıldığında uygulamadan çıkmak yerine açık pencere/sohbetten dönme eklendi." },
  { v: "v32", title: "Akıcı Geçiş & Mesaj Animasyonları", desc: "Mesaj gönderme/alma yaylanması, silme efekti ve sekme geçiş animasyonları artırıldı." },
  { v: "v31", title: "Vektörel SVG İkonlar", desc: "Arayüzdeki emojiler temiz vektörel SVG ikonlara dönüştürüldü." },
  { v: "v30", title: "%45 Bulanık Sohbet Arka Planı", desc: "Her kullanıcıya kendi seçtiği bulanık sohbet arka planı ekleme özelliği getirildi." },
  { v: "v29", title: "Anlık & Canlı Konum Paylaşımı", desc: "Haritada açılan anlık konum, canlı konum takibi ve PWA kısıt uyarısı eklendi." },
  { v: "v28", title: "Takma Ad (Nickname) Sistemi", desc: "Kayıt ve profil ayarlarına kullanıcı adından ayrı takma ad alanı eklendi." },
  { v: "v27", title: "Profil Özelleştirme & Profil Kartı", desc: "Durum emojisi, hakkında (bio), banner rengi ve dokunulabilir profil kartları eklendi." },
  { v: "v26", title: "Baloncuk Rengi & Menü Kontrolü", desc: "Alt navigasyon düzeni doğrulandı ve baloncuk rengi özelleştirmesi entegre edildi." },
  { v: "v25", title: "Özelleştirme Arayüz Eşitlemesi", desc: "Baloncuk rengi seçici kontrolleri HTML ve önbellekle senkronize edildi." },
  { v: "v24", title: "Önbellek Senkronizasyon İyileştirmesi", desc: "Service Worker sürüm tazeleme kontrolü düzenlendi." },
  { v: "v23", title: "Özel Sohbet Baloncuğu Rengi", desc: "Her kullanıcının tüm sohbetlerde kendi seçtiği baloncuk rengiyle görünmesi eklendi." },
  { v: "v22", title: "Android Profil Fotoğrafı Düzeltmesi", desc: "Android cihazlarda sohbet içi profil fotoğraflarının görünmeme sorunu çözüldü." },
  { v: "v21", title: "Sohbet İçi Profil Fotoğrafları", desc: "Grup ve özel sohbet mesajlarının yanında gönderen avatarları gösterilmeye başlandı." },
  { v: "v20", title: "Sesli Mesajlar Google Drive'da", desc: "Ses kayıtları yüksek uyumlulukla 5 TB Google Drive köprüsüne yönlendirildi." },
  { v: "v19", title: "iPhone Sesli Mesaj Düzeltmesi", desc: "iOS Safari/PWA için audio/mp4 ve mikrofon kayıt akışı uyumluluğu sağlandı." },
  { v: "v18", title: "Sesli Mesaj Kayıt & Önizleme", desc: "Mikrofon kayıt butonu, sayaç ve gönderim öncesi dinleme çubuğu eklendi." },
  { v: "v17", title: "Fotoğraf Önizleme Çubuğu", desc: "Fotoğraf seçildiğinde doğrudan göndermek yerine önizleme ve iptal butonu eklendi." },
  { v: "v16", title: "Hesap Oluşturma & Kayıt Avatarı", desc: "İki sekmeli giriş ekranı ve kayıt olurken profil fotoğrafı seçme özelliği eklendi." },
  { v: "v15", title: "Google Drive'dan Otomatik Silme", desc: "Sohbetten silinen fotoğraf/medyanın Drive klasöründen de çöp kutusuna taşınması eklendi." },
  { v: "v14", title: "Kişisel Şifre Kalıcılığı", desc: "Kullanıcıların kendi şifreleriyle farklı cihazlardan da hesaba giriş yapabilmesi sağlandı." },
  { v: "v13", title: "Erişim Kodu Görünürlüğü", desc: "Giriş ekranındaki şifre/kod alanının yazarken okunabilir olması sağlandı." },
  { v: "v12", title: "Fotoğraf Küçük Resmi & Tam Ekran", desc: "Sohbette fotoğrafların kompakt görünmesi ve dokununca büyütme modalı eklendi." },
  { v: "v11", title: "Drive Gizlilik Koruması", desc: "Apps Script bağlantısının kodda değil Admin panelinden veritabanında tutulması sağlandı." },
  { v: "v10", title: "5 TB Google Drive Köprüsü", desc: "Yüksek boyutlu medya paylaşımı için google-drive-bridge.gs altyapısı kuruldu." },
  { v: "v9", title: "Fotoğraf Gönderme", desc: "Sohbetlere ilk fotoğraf paylaşma özelliği eklendi." },
  { v: "v8", title: "Türkçe Karakter & Kararlılık Fix", desc: "Türkçe kullanıcı adı normalizasyonu ve genel hata düzeltmeleri yapıldı." },
  { v: "v7", title: "Tam Kullanıcı & Kod Silme", desc: "Admin panelinden silinen kullanıcıların davet kodlarıyla birlikte tamamen silinmesi sağlandı." },
  { v: "v6", title: "Admin Şifre & Otomatik Yeniden Giriş", desc: "Askıya alınan kullanıcıların yetkisi açıldığında otomatik geri giriş yapabilmesi eklendi." },
  { v: "v5", title: "Yetki Yönetimi & Sohbet Silme", desc: "Admin yetki verme, özel konuşma silme ve kullanıcı engelleme özellikleri eklendi." },
  { v: "v4", title: "Yeni Uygulama Logosu", desc: "Telefon ana ekranı ve PWA uygulama ikonu güncellendi." },
  { v: "v3", title: "Anlık Mesaj Bildirimleri", desc: "Yeni mesaj geldiğinde telefon ve masaüstü tarayıcı bildirimleri eklendi." },
  { v: "v2", title: "Mobil Arayüz & Firebase İyileştirmesi", desc: "Firebase gerçek zamanlı bağlantısı ve mobil PWA yerleşimi optimize edildi." },
  { v: "v1", title: "Agartha İlk Sürüm", desc: "Ana Grup, 1-e-1 Özel Sohbet, Mekanlar ve AI Mekan Önerileri sekmeleriyle uygulama kuruldu." }
];

let customAnnouncementsCache = [];

function updateHomeAnnouncementBanner() {
  const latestChangelog = APP_CHANGELOG[0];
  if (homeAnnouncementVersion && latestChangelog) {
    homeAnnouncementVersion.textContent = latestChangelog.v;
  }
  if (announcementsModalVer && latestChangelog) {
    announcementsModalVer.textContent = latestChangelog.v;
  }
  if (!homeAnnouncementSummary) return;
  if (customAnnouncementsCache.length > 0) {
    const newest = customAnnouncementsCache[0];
    homeAnnouncementSummary.textContent = `${newest.title}: ${newest.body}`;
  } else if (latestChangelog) {
    homeAnnouncementSummary.textContent = `${latestChangelog.v}: ${latestChangelog.title} — ${latestChangelog.desc}`;
  }
}

function renderCustomAnnouncements() {
  if (!customAnnouncementsList || !customAnnouncementsSection) return;
  if (customAnnouncementsCache.length === 0) {
    customAnnouncementsSection.classList.add("hidden");
    customAnnouncementsList.innerHTML = "";
    return;
  }
  customAnnouncementsSection.classList.remove("hidden");
  const isAdmin = Boolean(state.user && state.user.isAdmin);
  customAnnouncementsList.innerHTML = customAnnouncementsCache
    .map((item) => {
      const delBtn = isAdmin
        ? `<button type="button" class="icon-btn danger" data-del-ann="${escapeHtml(item.id)}" style="padding:3px 8px;font-size:11px;">Sil</button>`
        : "";
      const timeStr = item.createdAt ? formatTime(item.createdAt) : "";
      return `
        <div class="changelog-card latest">
          <div class="changelog-card-head">
            <span class="changelog-ver-badge">Duyuru</span>
            <span class="changelog-title">${escapeHtml(item.title || "")}</span>
            <span class="user-sub">${escapeHtml(timeStr)}</span>
            ${delBtn}
          </div>
          <div class="changelog-desc">${escapeHtml(item.body || "")}</div>
        </div>
      `;
    })
    .join("");

  customAnnouncementsList.querySelectorAll("[data-del-ann]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!state.user || !state.user.isAdmin) return;
      if (!confirm("Bu duyuru silinsin mi?")) return;
      state.db.ref("announcements/" + btn.dataset.delAnn).remove();
    });
  });
}

function renderChangelogList(query = "") {
  if (!changelogList) return;
  const q = String(query || "").trim().toLocaleLowerCase("tr-TR");
  const items = q
    ? APP_CHANGELOG.filter(
        (item) =>
          item.v.toLocaleLowerCase("tr-TR").includes(q) ||
          item.title.toLocaleLowerCase("tr-TR").includes(q) ||
          item.desc.toLocaleLowerCase("tr-TR").includes(q)
      )
    : APP_CHANGELOG;

  if (changelogSectionLabel) {
    changelogSectionLabel.textContent = q
      ? `Sürüm Geçmişi (${items.length} sonuç)`
      : `Sürüm Geçmişi (v1 – ${APP_CHANGELOG[0].v})`;
  }

  if (items.length === 0) {
    changelogList.innerHTML = `<div class="empty-hint">Aramayla eşleşen sürüm notu bulunamadı.</div>`;
    return;
  }

  changelogList.innerHTML = items
    .map(
      (item, idx) => `
      <div class="changelog-card${!q && idx === 0 ? " latest" : ""}">
        <div class="changelog-card-head">
          <span class="changelog-ver-badge">${escapeHtml(item.v)}</span>
          <span class="changelog-title">${escapeHtml(item.title)}</span>
        </div>
        <div class="changelog-desc">${escapeHtml(item.desc)}</div>
      </div>
    `
    )
    .join("");
}

function listenAnnouncements() {
  if (!state.db) return;
  state.db.ref("announcements").limitToLast(20).on("value", (snap) => {
    const data = snap.val() || {};
    customAnnouncementsCache = Object.entries(data)
      .map(([id, val]) => ({ id, ...(val || {}) }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    updateHomeAnnouncementBanner();
    if (announcementsModal && !announcementsModal.classList.contains("hidden")) {
      renderCustomAnnouncements();
    }
  });
}

function openAnnouncementsModal() {
  if (!announcementsModal) return;
  if (settingsModal) settingsModal.classList.add("hidden");
  const isAdmin = Boolean(state.user && state.user.isAdmin);
  if (adminAnnouncementCard) adminAnnouncementCard.classList.toggle("hidden", !isAdmin);
  if (changelogSearchInput) changelogSearchInput.value = "";
  renderCustomAnnouncements();
  renderChangelogList("");
  announcementsModal.classList.remove("hidden");
  pushBackState("announcements-modal");
}

if (authAnnouncementsBtn) {
  authAnnouncementsBtn.addEventListener("click", openAnnouncementsModal);
}
if (homeAnnouncementsBtn) {
  homeAnnouncementsBtn.addEventListener("click", openAnnouncementsModal);
}
if (openAnnouncementsBtn) {
  openAnnouncementsBtn.addEventListener("click", openAnnouncementsModal);
}
if (closeAnnouncementsBtn && announcementsModal) {
  closeAnnouncementsBtn.addEventListener("click", () => {
    announcementsModal.classList.add("hidden");
  });
}
if (changelogSearchInput) {
  changelogSearchInput.addEventListener("input", () => {
    renderChangelogList(changelogSearchInput.value);
  });
}
if (announcementForm) {
  announcementForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!state.db || !state.user || !state.user.isAdmin) return;
    const title = announcementTitleInput ? announcementTitleInput.value.trim() : "";
    const body = announcementBodyInput ? announcementBodyInput.value.trim() : "";
    if (!title || !body) return;
    await state.db.ref("announcements").push({
      title,
      body,
      authorId: state.user.id,
      authorName: getDisplayName(state.user),
      createdAt: Date.now()
    });
    if (announcementTitleInput) announcementTitleInput.value = "";
    if (announcementBodyInput) announcementBodyInput.value = "";
  });
}

updateHomeAnnouncementBanner();

init();
