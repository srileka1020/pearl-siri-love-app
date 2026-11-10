const $ = (s) => document.querySelector(s);

const loginScreen = $("#loginScreen");
const homeScreen = $("#homeScreen");
const inboxScreen = $("#inboxScreen");
const messagePanel = $("#messagePanel");
const modal = $("#loveModal");

let loggedIn = false;
let passwordForInbox = "";

function showOnly(screen) {
  [loginScreen, homeScreen, inboxScreen].forEach(x => x.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2400);
}

function makeParticles() {
  const butterflies = $("#butterflies");
  const hearts = $("#hearts");

  for (let i = 0; i < 24; i++) {
    const b = document.createElement("span");
    b.className = "fly";
    b.textContent = Math.random() > .12 ? "🦋" : "✦";
    b.style.left = `${Math.random() * 100}%`;
    b.style.animationDuration = `${10 + Math.random() * 15}s`;
    b.style.animationDelay = `${-Math.random() * 22}s`;
    b.style.fontSize = `${15 + Math.random() * 20}px`;
    butterflies.appendChild(b);

    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = Math.random() > .2 ? "♥" : "♡";
    h.style.left = `${Math.random() * 100}%`;
    h.style.animationDuration = `${12 + Math.random() * 16}s`;
    h.style.animationDelay = `${-Math.random() * 25}s`;
    h.style.color = Math.random() > .5 ? "#ff6aa9" : "#b26cff";
    hearts.appendChild(h);
  }
}
makeParticles();

$("#togglePassword").onclick = () => {
  const input = $("#password");
  input.type = input.type === "password" ? "text" : "password";
};

$("#loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const password = $("#password").value;

  try {
    const r = await fetch("/api/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ password })
    });

    if (!r.ok) throw new Error();

    loggedIn = true;
    passwordForInbox = password;
    $("#loginError").textContent = "";
    modal.classList.remove("hidden");
  } catch {
    $("#loginError").textContent = "That's not the magic word… try again 💔";
  }
};

$("#enterButton").onclick = () => {
  modal.classList.add("hidden");
  showOnly(homeScreen);
  toast("Welcome to our little world 💖");
};

function openMessagePanel() {
  messagePanel.classList.remove("hidden");
  setTimeout(() => $("#messageText").focus(), 150);
}
$("#messageButton").onclick = openMessagePanel;

$("#messageText").addEventListener("input", () => {
  $("#charCount").textContent = $("#messageText").value.length;
});

$("#sendButton").onclick = async () => {
  const text = $("#messageText").value.trim();
  const sender = $("#senderSelect").value;
  if (!text) {
    $("#sendStatus").textContent = "Write something first, my love 💕";
    return;
  }

  $("#sendButton").disabled = true;
  try {
    const r = await fetch("/api/messages", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ message: text, sender })
    });

    if (!r.ok) {
      let detail = "Couldn't send it. Please try again.";
      try {
        const errorData = await r.json();
        if (errorData?.message) detail = errorData.message;
      } catch {}
      throw new Error(detail);
    }

    $("#messageText").value = "";
    $("#charCount").textContent = "0";
    $("#sendStatus").textContent = "Sent straight to my heart 💌";
    toast("Message delivered 💖");
  } catch (error) {
    $("#sendStatus").textContent = error.message || "Couldn't send it. Please try again.";
  } finally {
    $("#sendButton").disabled = false;
  }
};

async function openInbox() {
  if (!loggedIn) {
    toast("Unlock the app first 🔐");
    return;
  }

  const r = await fetch("/api/messages", {
    headers: {"x-love-password": passwordForInbox}
  });

  if (!r.ok) {
    toast("Inbox access denied 🔐");
    return;
  }

  const data = await r.json();
  const list = $("#inboxList");
  list.innerHTML = "";

  if (!data.messages.length) {
    list.innerHTML = '<div class="empty">No messages yet… the inbox is waiting 🌙</div>';
  } else {
    [...data.messages].reverse().forEach(m => {
      const item = document.createElement("article");
      item.className = "inbox-item";

      const sender = document.createElement("div");
      sender.className = "message-sender";
      sender.textContent = m.sender === "Pearl" ? "💗 Pearl" : "💜 SiRi";

      const body = document.createElement("div");
      body.className = "message-body";
      body.textContent = m.message;

      const time = document.createElement("time");
      time.textContent = new Date(m.createdAt).toLocaleString();

      item.appendChild(sender);
      item.appendChild(body);
      item.appendChild(time);
      list.appendChild(item);
    });
  }

  showOnly(inboxScreen);
}

$("#inboxButton").onclick = openInbox;
$("#topInbox").onclick = openInbox;

$("#backButton").onclick = () => showOnly(homeScreen);
