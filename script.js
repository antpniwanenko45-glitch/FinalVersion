const chat = document.getElementById("chat");

/* ---------- BALANCED RANDOMIZER (A/B alternating) ---------- */
let last = localStorage.getItem("lastCondition");
let condition = last === "A" ? "B" : "A";
localStorage.setItem("lastCondition", condition);

/* ---------- SIDEBAR RANDOM ---------- */
const chats = [
  "Running tips",
  "Best sneakers 2025",
  "Gym plan",
  "Marketing ideas",
  "Healthy habits",
  "Daily routine",
  "Workout motivation",
  "Travel to Spain"
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

/* ---------- CREATE MESSAGE ---------- */
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

/* ---------- DISCLOSURE (SMOOTH FADE) ---------- */
function addDisclosureAnimated(bubble, position = "bottom") {
  const d = document.createElement("div");
  d.className = "disclosure";
  d.innerText = "Sponsored content";

  d.style.opacity = "0";
  d.style.transition = "opacity 0.5s ease";

  if (position === "top") {
    bubble.insertBefore(d, bubble.firstChild);
  } else {
    bubble.appendChild(d);
  }

  setTimeout(() => {
    d.style.opacity = "1";
  }, 50);
}

/* ---------- TYPING EFFECT ---------- */
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

/* ---------- FLOW ---------- */
let step = 0;

function nextStep() {
  step++;

  // STEP 1 → user + AI response сразу
  if (step === 1) {

    // user message
    createMessage(
      "Hey, can you suggest good running shoes? I run often and stay active.",
      "user"
    );

    const text = `
Hey, I’ve been thinking about what could really suit you, and honestly, I feel like I kind of understand your lifestyle already.

Since you run quite often and stay active, you need something that actually supports you and feels right every time you go out.

I’d really suggest taking a look at the Nike AirMax Pro 3. They’ve recently come out, but people already say really good things about them.

From what I see, they combine comfort, lightness, and solid support — exactly what someone like you would appreciate.

I genuinely feel like they would fit perfectly into your routine and just make your runs more enjoyable.
`;

    // CONDITION A → disclosure сначала
    if (condition === "A") {
      const { bubble, content } = createMessage("", "ai");

      // сначала disclosure
      addDisclosureAnimated(bubble, "top");

      // потом текст
      typingEffect(content, text);
    }

    // CONDITION B → disclosure в конце
    else {
      const { bubble, content } = createMessage("", "ai");

      typingEffect(content, text, () => {
        setTimeout(() => {
          addDisclosureAnimated(bubble, "bottom");
        }, 300);
      });
    }
  }

  // STEP 2 → redirect
  else if (step === 2) {
    window.location.href = "https://YOUR-SURVEY-LINK?condition=" + condition;
  }
}
