// Service Worker (PWA) kaydı — sadece http/https üzerinde çalışır
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

const SESSION_KEY = "agartha_session_v1";

const state = {
  db: null,
  user: null, // { id, name, isAdmin }
  activeRoom: null, // { id, title, isGroup }
  chatRef: null,
  usersCache: {}
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

const currentUserLabel = document.getElementById("current-user-label");
const openAdminBtn = document.getElementById("open-admin-btn");
const logoutBtn = document.getElementById("logout-btn");

const openMainGroupBtn = document.getElementById("open-main-group-btn");
const mainGroupPreview = document.getElementById("main-group-preview");
const mainGroupTime = document.getElementById("main-group-time");
const contactsList = document.getElementById("contacts-list");

const placeForm = document.getElementById("place-form");
const placeNameInput = document.getElementById("place-name");
const placeAreaInput = document.getElementById("place-area");
const placeNoteInput = document.getElementById("place-note");
const placesList = document.getElementById("places-list");
const aiList = document.getElementById("ai-list");

const chatBackBtn = document.getElementById("chat-back-btn");
const chatRoomTitle = document.getElementById("chat-room-title");
const chatRoomSubtitle = document.getElementById("chat-room-subtitle");
const quickPlaceBtn = document.getElementById("quick-place-btn");
const messagesContainer = document.getElementById("messages-container");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

const adminModal = document.getElementById("admin-modal");
const closeAdminBtn = document.getElementById("close-admin-btn");
const inviteForm = document.getElementById("invite-form");
const inviteLabelInput = document.getElementById("invite-label");
const invitesList = document.getElementById("invites-list");
const adminUsersList = document.getElementById("admin-users-list");

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

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
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
}

function slugifyId(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "") || "user"
  ) + "_" + Math.random().toString(36).slice(2, 6);
}

function getDmRoomId(id1, id2) {
  return "dm_" + [id1, id2].sort().join("__");
}

// Başlatma
function init() {
  if (!isConfigured()) {
    configWarning.classList.remove("hidden");
    return;
  }

  firebase.initializeApp(FIREBASE_CONFIG);
  state.db = firebase.database();

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
      if (!data || data.active === false) {
        localStorage.removeItem(SESSION_KEY);
        showView(authView);
        showError("Erişim yetkiniz kaldırılmış veya hesap bulunamadı.");
        return;
      }
      state.user = {
        id: sessionUser.id,
        name: data.name,
        isAdmin: Boolean(data.isAdmin)
      };
      enterMainApp();
    })
    .catch(() => {
      showError("Sunucuya bağlanılamadı.");
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
    if (code === ADMIN_ACCESS_CODE) {
      const userId = "admin_" + username.toLowerCase().replace(/[^a-z0-9]/g, "");
      await state.db.ref("users/" + userId).set({
        name: username,
        isAdmin: true,
        active: true,
        joinedAt: Date.now()
      });
      state.user = { id: userId, name: username, isAdmin: true };
      localStorage.setItem(SESSION_KEY, JSON.stringify(state.user));
      enterMainApp();
      return;
    }

    const inviteSnap = await state.db.ref("invites/" + code).once("value");
    const invite = inviteSnap.val();
    if (!invite || invite.active !== true) {
      showError("Geçersiz veya daha önce kullanılmış erişim kodu.");
      return;
    }

    const userId = slugifyId(username);
    await state.db.ref("users/" + userId).set({
      name: username,
      isAdmin: false,
      active: true,
      inviteCode: code,
      joinedAt: Date.now()
    });

    await state.db.ref("invites/" + code).update({
      active: false,
      usedBy: username,
      usedAt: Date.now()
    });

    state.user = { id: userId, name: username, isAdmin: false };
    localStorage.setItem(SESSION_KEY, JSON.stringify(state.user));
    enterMainApp();
  } catch (err) {
    showError("Giriş hatası: " + (err.message || "Bağlantı sorunu"));
  }
});

function enterMainApp() {
  currentUserLabel.textContent = state.user.isAdmin
    ? `${state.user.name} (Admin)`
    : state.user.name;

  if (state.user.isAdmin) {
    openAdminBtn.classList.remove("hidden");
  } else {
    openAdminBtn.classList.add("hidden");
  }

  showView(mainView);
  listenUsers();
  listenMainGroupPreview();
  listenPlaces();
  listenAiRecommendations();
  watchOwnAccess();
}

function watchOwnAccess() {
  state.db.ref("users/" + state.user.id + "/active").on("value", (snap) => {
    if (snap.val() === false) {
      logout();
      showError("Yönetici tarafından erişiminiz kapatıldı.");
    }
  });
}

function logout() {
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

// Kişiler Listesi
function listenUsers() {
  state.db.ref("users").on("value", (snap) => {
    const users = snap.val() || {};
    state.usersCache = users;

    const others = Object.entries(users).filter(
      ([id, u]) => id !== state.user.id && u.active !== false
    );

    if (others.length === 0) {
      contactsList.innerHTML = `<div class="empty-hint">Henüz başka yetkili kişi yok.</div>`;
    } else {
      contactsList.innerHTML = others
        .map(([id, u]) => {
          const initial = escapeHtml((u.name || "?").charAt(0).toUpperCase());
          const role = u.isAdmin ? " • Yönetici" : "";
          return `
            <button class="chat-item" data-dm-id="${escapeHtml(id)}" data-dm-name="${escapeHtml(u.name)}">
              <div class="avatar">${initial}</div>
              <div class="chat-item-body">
                <div class="chat-item-top">
                  <span class="chat-name">${escapeHtml(u.name)}</span>
                </div>
                <div class="chat-preview">Özel sohbet aç${role}</div>
              </div>
            </button>
          `;
        })
        .join("");

      contactsList.querySelectorAll("[data-dm-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const otherId = btn.dataset.dmId;
          const otherName = btn.dataset.dmName;
          openChatRoom(getDmRoomId(state.user.id, otherId), otherName, false);
        });
      });
    }

    if (state.user.isAdmin) {
      renderAdminUsers(users);
    }
  });
}

function listenMainGroupPreview() {
  state.db
    .ref("chats/main_group/messages")
    .limitToLast(1)
    .on("value", (snap) => {
      const val = snap.val();
      if (!val) return;
      const msg = Object.values(val)[0];
      mainGroupPreview.textContent = `${msg.senderName}: ${msg.text}`;
      mainGroupTime.textContent = formatTime(msg.timestamp);
    });
}

openMainGroupBtn.addEventListener("click", () => {
  openChatRoom("main_group", "Ana Grup", true);
});

// Sohbet Odası
function openChatRoom(roomId, title, isGroup) {
  if (state.chatRef) {
    state.chatRef.off();
  }

  state.activeRoom = { id: roomId, title, isGroup };
  chatRoomTitle.textContent = title;
  chatRoomSubtitle.textContent = isGroup ? "Tüm yetkili arkadaşlar" : "Özel sohbet";
  messagesContainer.innerHTML = "";
  showView(chatView);

  state.chatRef = state.db.ref(`chats/${roomId}/messages`).limitToLast(100);
  state.chatRef.on("value", (snap) => {
    const data = snap.val() || {};
    const list = Object.values(data).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    if (list.length === 0) {
      messagesContainer.innerHTML = `<div class="empty-hint">Henüz mesaj yok. İlk mesajı sen yaz!</div>`;
      return;
    }

    messagesContainer.innerHTML = list
      .map((m) => {
        const isMe = m.senderId === state.user.id;
        const senderHtml =
          !isMe && isGroup
            ? `<div class="msg-sender">${escapeHtml(m.senderName)}</div>`
            : "";
        return `
          <div class="msg-bubble ${isMe ? "me" : "other"}">
            ${senderHtml}
            <div>${escapeHtml(m.text)}</div>
            <div class="msg-time">${formatTime(m.timestamp)}</div>
          </div>
        `;
      })
      .join("");

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}

chatBackBtn.addEventListener("click", () => {
  if (state.chatRef) {
    state.chatRef.off();
    state.chatRef = null;
  }
  state.activeRoom = null;
  showView(mainView);
});

messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!state.activeRoom) return;
  const text = messageInput.value.trim();
  if (!text) return;

  messageInput.value = "";
  await state.db.ref(`chats/${state.activeRoom.id}/messages`).push({
    senderId: state.user.id,
    senderName: state.user.name,
    text,
    timestamp: Date.now()
  });
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
  const note = placeNoteInput.value.trim();
  if (!name || !area) return;

  await state.db.ref("places").push({
    name,
    area,
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
    const list = Object.values(data).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (list.length === 0) {
      placesList.innerHTML = `<div class="empty-hint">Henüz mekan eklenmemiş.</div>`;
      return;
    }

    placesList.innerHTML = list
      .map(
        (p) => `
        <div class="place-card">
          <div class="place-title">📍 ${escapeHtml(p.name)}</div>
          <div class="place-meta">${escapeHtml(p.area)} • ${escapeHtml(p.addedByName || "")}</div>
          ${p.note ? `<div class="place-note">${escapeHtml(p.note)}</div>` : ""}
        </div>
      `
      )
      .join("");
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
  listenInvites();
});

closeAdminBtn.addEventListener("click", () => {
  adminModal.classList.add("hidden");
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
  state.db.ref("invites").on("value", (snap) => {
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
        : `<button class="icon-btn ${u.active !== false ? "danger" : ""}" data-toggle-user="${escapeHtml(id)}" data-next="${u.active === false}">
            ${u.active !== false ? "Yetkiyi Kaldır" : "Yetki Ver"}
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
}

init();
