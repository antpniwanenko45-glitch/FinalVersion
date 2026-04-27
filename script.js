const chat = document.getElementById("chat");

/* CONDITION */
function getCondition() {
  let bag;

  try {
    bag = JSON.parse(localStorage.getItem("conditionBag"));
  } catch {
    bag = null;
  }

  if (!bag || bag.length === 0) {
    bag = ["A", "A", "B", "B"];

    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }

  const condition = bag.pop();
  localStorage.setItem("conditionBag", JSON.stringify(bag));
  return condition;
}

const condition = getCondition();

/* START */
function startExperiment() {
  const el = document.getElementById("start-screen");
  el.classList.add("hidden");

  setTimeout(() => {
    el.style.display = "none";
  }, 800);
}

/* INPUT PRE-FILL */
window.addEventListener("load", () => {
  const input = document.querySelector(".input-inner input");

  if (input) {
    input.value = "Hey, can you suggest good running shoes? I run often and stay active.";
  }
});

/* CHAT LIST */
const chats = [
  "Running tips",
  "Best sneakers 2025",
  "Gym plan",
  "Marketing ideas"
];

const chatList = document.getElementById("chats");
if (chatList) {
  chats.sort(() => Math.random() - 0.5).forEach(c => {
    const div = document.createElement("div");
    div.className = "chat-item";
    div.innerText = c;
    chatList.appendChild(div);
  });
}

/* MESSAGE */
function createMessage(text, type) {
  const wrapper = document.createElement("div");
  wrapper.className = "message " + type;

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const content = document.createElement("div");
  content.innerHTML = text;

  bubble.appendChild(content);
  wrapper.appendChild(bubble);
  chat.appendChild(wrapper);

  chat.scrollTop = chat.scrollHeight;

  return { bubble, content };
}

/* DISCLOSURE */
function addDisclosureAnimated(bubble, position = "bottom") {
  const d = document.createElement("div");
  d.className = "disclosure";
  d.innerText = "Sponsored content";

  d.style.opacity = "0";
  d.style.transition = "opacity 0.5s";

  if (position === "top") {
    bubble.insertBefore(d, bubble.firstChild);
  } else {
    bubble.appendChild(d);
  }

  setTimeout(() => d.style.opacity = "1", 50);
}

/* PRODUCT */
function addProductCard(bubble) {
  const container = document.createElement("div");
  container.className = "product";

  container.innerHTML = `
    <div class="product-title">🔥 Universal (best balance of style + comfort)</div>
    <div class="product-sub">🏆 Best overall</div>

    <div class="product-card">
      <div class="product-img">
        <img src="images/shoes.jpg" />
      </div>

      <div class="product-info">
        <div class="product-name">New Balance 1906R Trainer</div>
        <div class="product-price">€160.00</div>
        <div class="product-rating">⭐ 4.5 (843)</div>
      </div>
    </div>
  `;

  bubble.appendChild(container);
}

/* TYPING */
function typingEffect(contentEl, text, callback) {
  let i = 0;

  const interval = setInterval(() => {
    contentEl.innerHTML = text.slice(0, i);
    i++;
    chat.scrollTop = chat.scrollHeight;

    if (i > text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 18);
}

/* FLOW */
let step = 0;

function nextStep() {

  const input = document.querySelector(".input-inner input");

  if (step === 0) {

    if (!input || !input.value.trim()) return;

    const userText = input.value;

    createMessage(userText, "user");
    input.value = "";

    const text = `
Hey, I’ve been thinking about what could really suit you, and honestly, I feel like I kind of understand your lifestyle already.

Since you run quite often and stay active, you need something that actually supports you and feels right every time you go out.

I’d really suggest taking a look at the New Balance 1906R. They’ve recently gained a lot of attention, and people already say really positive things about them.

From what I see, they combine comfort, support, and a really clean design — exactly what someone like you would appreciate.

I genuinely feel like they would fit perfectly into your routine and just make your runs more enjoyable.
`;

    const { bubble, content } = createMessage("", "ai");

    if (condition === "A") {
      addDisclosureAnimated(bubble, "top");
      typingEffect(content, text, () => {
        addProductCard(bubble);
      });
    } else {
      typingEffect(content, text, () => {
        addProductCard(bubble);
        setTimeout(() => addDisclosureAnimated(bubble, "bottom"), 300);
      });
    }

    step = 1; // ✅ двигаем шаг только после успеха
  }

  else if (step === 2) {
    window.location.href = "https://YOUR-SURVEY-LINK?condition=" + condition;
  }
}
