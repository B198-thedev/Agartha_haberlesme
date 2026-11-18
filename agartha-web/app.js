// Service Worker (PWA) kaydı — sadece http/https üzerinde çalışır
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

const SESSION_KEY = "agartha_session_v1";

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
  pendingAudioData: ""
};

// DOM Elemanları
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
const regPassword = document.getElementById("reg-password");
const regInvite = document.getElementById("reg-invite");
const registerError = document.getElementById("register-error");

const profileTrigger = document.getElementById("profile-trigger");
const headerAvatar = document.getElementById("header-avatar");
const currentUserLabel = document.getElementById("current-user-label");
const notifyBtn = document.getElementById("notify-btn");
const openAdminBtn = document.getElementById("open-admin-btn");
const logoutBtn = document.getElementById("logout-btn");

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

const imageModal = document.getElementById("image-modal");
const imageModalImg = document.getElementById("image-modal-img");
const downloadImageBtn = document.getElementById("download-image-btn");
const closeImageBtn = document.getElementById("close-image-btn");

const profileModal = document.getElementById("profile-modal");
const closeProfileBtn = document.getElementById("close-profile-btn");
const profileAvatarPreview = document.getElementById("profile-avatar-preview");
const profileAvatarInput = document.getElementById("profile-avatar-input");
const profileAvatarBtn = document.getElementById("profile-avatar-btn");

const adminModal = document.getElementById("admin-modal");
const closeAdminBtn = document.getElementById("close-admin-btn");
const inviteForm = document.getElementById("invite-form");
const inviteLabelInput = document.getElementById("invite-label");
const invitesList = document.getElementById("invites-list");
const adminUsersList = document.getElementById("admin-users-list");
const driveConfigForm = document.getElementById("drive-config-form");
const driveUrlInput = document.getElementById("drive-url-input");
const driveSecretInput = document.getElementById("drive-secret-input");

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
  [authView, mainView, chatView].forEach((v) => v.classList.remove("active"));
  viewEl.classList.add("active");
}

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

function extractDriveFileId(msg) {
  if (!msg) return "";
  if (msg.driveFileId) return msg.driveFileId;
  const url = String(msg.imageUrl || "");
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
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
  if (!isConfigured()) {
    configWarning.classList.remove("hidden");
    return;
  }

  firebase.initializeApp(FIREBASE_CONFIG);
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
      verifyAndEnter(parsed);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
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
        isAdmin: Boolean(data.isAdmin),
        avatarData: data.avatarData || ""
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
        isAdmin: Boolean(data.isAdmin),
        avatarData: data.avatarData || ""
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
    showError("Önce firebase-config.js dosyasını doldurun.");
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
      await state.db.ref("users/" + userId).set({
        name: username,
        isAdmin: true,
        active: existingAdmin ? existingAdmin.active !== false : true,
        online: true,
        avatarData,
        joinedAt: (existingAdmin && existingAdmin.joinedAt) || Date.now()
      });
      state.user = { id: userId, name: username, isAdmin: true, avatarData };
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
        isAdmin: Boolean(existingUser.isAdmin),
        avatarData: existingUser.avatarData || ""
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
    showRegisterError("Önce firebase-config.js dosyasını doldurun.");
    return;
  }

  const username = regUsername.value.trim();
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

    await state.db.ref("users/" + userId).set({
      name: username,
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
      usedBy: username,
      claimedByUserId: userId,
      usedAt: Date.now()
    });

    state.user = { id: userId, name: username, isAdmin: false, avatarData };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: userId, name: username, isAdmin: false }));
    enterMainApp();
  } catch (err) {
    showRegisterError("Kayıt hatası: " + (err.message || "Bağlantı sorunu"));
  }
});

function enterMainApp() {
  currentUserLabel.textContent = state.user.isAdmin
    ? `${state.user.name} (Admin)`
    : state.user.name;
  headerAvatar.src = state.user.avatarData || "./icon-192.png";

  if (state.user.isAdmin) {
    openAdminBtn.classList.remove("hidden");
  } else {
    openAdminBtn.classList.add("hidden");
  }

  showView(mainView);
  updateNotifyButton();
  setupPresence();
  listenDriveConfig();
  listenUsers();
  listenMainGroupPreview();
  listenPlaces();
  listenAiRecommendations();
  watchOwnAccess();
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
    notifyBtn.textContent = "Bildirim: Açık";
    notifyBtn.style.borderColor = "rgba(34, 197, 94, 0.5)";
  } else if (Notification.permission === "denied") {
    notifyBtn.textContent = "Bildirim: Engelli";
  } else {
    notifyBtn.textContent = "Bildirim Aç";
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
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + target).classList.add("active");
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
      const initial = escapeHtml((u.name || "?").charAt(0).toUpperCase());
      const role = u.isAdmin ? " • Yönetici" : "";
      const dmId = getDmRoomId(state.user.id, id);
      const unreadHtml = state.unreadRooms.has(dmId) ? `<span class="unread-dot"></span>` : "";
      const onlineDot = u.online ? `<span class="online-dot"></span>` : "";
      const statusText = u.online
        ? "Çevrimiçi"
        : u.lastSeen
        ? `Son görülme ${formatTime(u.lastSeen)}`
        : "Özel sohbet aç";

      const avatarHtml = u.avatarData
        ? `<img class="avatar-img" src="${escapeHtml(u.avatarData)}" alt="${escapeHtml(u.name)}" />`
        : `<div class="avatar">${initial}</div>`;

      return `
        <button class="chat-item" data-dm-id="${escapeHtml(id)}" data-dm-name="${escapeHtml(u.name)}">
          <div class="avatar-wrap">
            ${avatarHtml}
            ${onlineDot}
          </div>
          <div class="chat-item-body">
            <div class="chat-item-top">
              <span class="chat-name">${escapeHtml(u.name)}${unreadHtml}</span>
            </div>
            <div class="chat-preview">${statusText}${role}</div>
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
            msg.text || (msg.imageUrl || msg.imageData ? "📷 Fotoğraf gönderdi" : msg.audioData ? "🎤 Sesli mesaj" : ""),
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
      const previewText = msg.text || (msg.imageUrl || msg.imageData ? "📷 Fotoğraf" : msg.audioData ? "🎤 Sesli mesaj" : "");
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
    chatRoomSubtitle.textContent = "Tüm yetkili arkadaşlar";
  } else {
    const other = otherId ? state.usersCache[otherId] : null;
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

  state.chatRef = state.db.ref(`chats/${roomId}/messages`).limitToLast(100);
  state.chatRef.on("value", (snap) => {
    const data = snap.val() || {};
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
        const senderHtml =
          !isMe && isGroup
            ? `<div class="msg-sender">${escapeHtml(m.senderName)}</div>`
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
        const audioHtml = m.audioData
          ? `<audio class="msg-audio" controls preload="metadata" src="${m.audioData}"></audio>`
          : "";
        const textHtml = m.text ? `<div>${linkifyText(m.text)}</div>` : "";
        return `
          <div class="msg-bubble ${isMe ? "me" : "other"}">
            ${senderHtml}
            ${imgHtml}
            ${audioHtml}
            ${textHtml}
            <div class="msg-footer">
              ${delHtml}
              <span class="msg-time">${formatTime(m.timestamp)}</span>
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
      });
    });

    messagesContainer.querySelectorAll("[data-del-msg]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Bu mesaj silinsin mi?")) return;
        const msgKey = btn.dataset.delMsg;
        const targetMsg = data[msgKey];
        const fileId = extractDriveFileId(targetMsg);
        if (fileId) {
          await deleteFromGoogleDrive(fileId);
        }
        await state.db.ref(`chats/${roomId}/messages/${msgKey}`).remove();
      });
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  // Yazıyor... (Typing) dinleyicisi
  state.typingRef = state.db.ref(`chats/${roomId}/typing`);
  state.typingRef.on("value", (snap) => {
    const val = snap.val() || {};
    const typers = Object.entries(val)
      .filter(([uid, name]) => uid !== state.user.id && name)
      .map(([, name]) => name);

    if (typers.length > 0) {
      typingIndicator.textContent = `${typers.join(", ")} yazıyor...`;
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
}

function clearPendingAudio() {
  state.pendingAudioData = "";
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
  if (state.audioStream) {
    state.audioStream.getTracks().forEach((t) => t.stop());
    state.audioStream = null;
  }
  state.mediaRecorder = null;
  micBtn.classList.remove("mic-recording");
  micBtn.textContent = "🎤";
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
  if (!state.activeRoom || !state.db || !state.user) return;
  const myTypingRef = state.db.ref(`chats/${state.activeRoom.id}/typing/${state.user.id}`);
  if (messageInput.value.trim()) {
    myTypingRef.set(state.user.name);
    myTypingRef.onDisconnect().remove();
    clearTimeout(state.typingTimeout);
    state.typingTimeout = setTimeout(() => {
      myTypingRef.remove();
    }, 2500);
  } else {
    myTypingRef.remove();
  }
});

chatBackBtn.addEventListener("click", () => {
  cleanupActiveRoomListeners();
  state.activeRoom = null;
  showView(mainView);
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
  const fileIds = Object.values(msgs).map(extractDriveFileId).filter(Boolean);
  await Promise.all(fileIds.map((fid) => deleteFromGoogleDrive(fid)));

  await state.db.ref(`chats/${roomId}`).remove();
  showView(mainView);
});

messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!state.activeRoom) return;
  const text = messageInput.value.trim();
  const file = state.pendingPhotoFile;
  const audioData = state.pendingAudioData;
  if (!text && !file && !audioData) return;

  messageInput.value = "";
  clearTimeout(state.typingTimeout);
  state.db.ref(`chats/${state.activeRoom.id}/typing/${state.user.id}`).remove();

  if (!file && !audioData) {
    await state.db.ref(`chats/${state.activeRoom.id}/messages`).push({
      senderId: state.user.id,
      senderName: state.user.name,
      text,
      timestamp: Date.now()
    });
    return;
  }

  if (audioData && !file) {
    clearPendingAudio();
    await state.db.ref(`chats/${state.activeRoom.id}/messages`).push({
      senderId: state.user.id,
      senderName: state.user.name,
      text,
      audioData,
      timestamp: Date.now()
    });
    return;
  }

  clearPendingPhoto();
  if (audioData) clearPendingAudio();
  sendBtn.disabled = true;
  sendBtn.textContent = "Yükleniyor...";
  photoBtn.disabled = true;
  try {
    if (state.driveConfig && state.driveConfig.url) {
      const uploaded = await uploadToGoogleDrive(file);
      await state.db.ref(`chats/${state.activeRoom.id}/messages`).push({
        senderId: state.user.id,
        senderName: state.user.name,
        text,
        imageUrl: uploaded.url,
        downloadUrl: uploaded.downloadUrl,
        driveFileId: uploaded.id,
        ...(audioData ? { audioData } : {}),
        timestamp: Date.now()
      });
    } else {
      const imageData = await compressImageToBase64(file, 900, 0.72);
      await state.db.ref(`chats/${state.activeRoom.id}/messages`).push({
        senderId: state.user.id,
        senderName: state.user.name,
        text,
        imageData,
        ...(audioData ? { audioData } : {}),
        timestamp: Date.now()
      });
    }
  } catch (err) {
    alert("Fotoğraf gönderilemedi: " + (err.message || "Hata"));
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Gönder";
    photoBtn.disabled = false;
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
    const options = mimeType ? { mimeType, audioBitsPerSecond: 32000 } : { audioBitsPerSecond: 32000 };
    const recorder = new MediaRecorder(stream, options);
    state.mediaRecorder = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) state.audioChunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(state.audioChunks, { type: recorder.mimeType || mimeType || "audio/webm" });
      state.audioChunks = [];
      if (blob.size === 0) return;
      const dataUrl = await blobToDataUrl(blob);
      state.pendingAudioData = dataUrl;
      audioPreviewPlayer.src = dataUrl;
      audioPreviewBar.classList.remove("hidden");
    };

    recorder.start();
    state.recordingSeconds = 0;
    micBtn.classList.add("mic-recording");
    micBtn.textContent = "⏹ 00:00";

    state.recordingTimer = setInterval(() => {
      state.recordingSeconds += 1;
      const m = String(Math.floor(state.recordingSeconds / 60)).padStart(2, "0");
      const s = String(state.recordingSeconds % 60).padStart(2, "0");
      micBtn.textContent = `⏹ ${m}:${s}`;
      if (state.recordingSeconds >= 60) {
        stopActiveRecording(false);
      }
    }, 1000);
  } catch (err) {
    stopActiveRecording(true);
    alert("Mikrofon izni verilmedi veya açılamadı.");
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

// Profil Fotoğrafı Güncelleme
profileTrigger.addEventListener("click", () => {
  profileAvatarPreview.src = state.user.avatarData || "./icon-192.png";
  profileModal.classList.remove("hidden");
});

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
    senderName: state.user.name,
    text: `📍 Mekan paylaştı: ${name.trim()}${area.trim() ? " (" + area.trim() + ")" : ""}`,
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
              <div class="place-title">📍 ${escapeHtml(p.name)}</div>
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
          <div class="place-title">✨ ${escapeHtml(r.title || r.name)}</div>
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
  adminModal.classList.remove("hidden");
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
            <div class="place-title">${escapeHtml(u.name)}</div>
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
