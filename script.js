const chat = document.getElementById("chat");

/* ---------- TRUE BALANCED RANDOMIZER ---------- */
let condition;
let last = localStorage.getItem("lastCondition");

if (!last || last === "B") {
  condition = "A";
} else {
  condition = "B";
}

localStorage.setItem("lastCondition", condition);

/* ---------- RANDOM SIDEBAR ---------- */
const chats = [
  "Best sneakers 2025",
  "Gym plan",
  "Marketing ideas",
  "Travel to Spain",
  "Healthy habits",
  "Running tips",
  "Daily routine",
  "Workout motivation"
];

const chatList = document.getElementById("chats");
chats.sort(() => Math.random() - 0.5).forEach(c => {
  const div = document.createElement("div");
  div.className = "chat-item";
  div.innerText = c;
  chatList.appendChild(div);
});

/* ---------- MESSAGE ---------- */
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

  return bubble;
}

/* ---------- ADD DISCLOSURE INSIDE SAME BUBBLE ---------- */
function addDisclosureToBubble(bubble) {
  const d = document.createElement("div");
  d.className = "disclosure";
  d.innerText = "Sponsored content";

  bubble.insertBefore(d, bubble.firstChild);
}

/* ---------- TYPING ---------- */
function typingEffect(text, callback) {
  const bubble = createMessage("", "ai");
  const content = bubble.firstChild;

  let i = 0;

  const interval = setInterval(() => {
    content.innerHTML = text.slice(0, i);
    i++;
    chat.scrollTop = chat.scrollHeight;

    if (i > text.length) {
      clearInterval(interval);
      if (callback) callback(bubble);
    }
  }, 18);
}

/* ---------- FLOW ---------- */
let step = 0;

function nextStep() {
  step++;

  if (step === 1) {
    createMessage(
      "Hey, can you suggest good running shoes? I run often and try to stay active.",
      "user"
    );
  }

  else if (step === 2) {

    const text = `
Hey, I’ve been thinking about what could really suit you, and honestly, I feel like I kind of understand your lifestyle already.

Since you run quite often and stay active, you need something that actually supports you and feels right every time you go out.

I’d really suggest taking a look at the Nike AirMax Pro 3. They’ve recently come out, but people already say really good things about them.

From what I see, they combine comfort, lightness, and solid support — exactly what someone like you would appreciate.

I genuinely feel like they would fit perfectly into your routine and just make your runs more enjoyable.
`;

    if (condition === "A") {
      typingEffect(text, (bubble) => {
        addDisclosureToBubble(bubble);
      });
    }

    else {
      typingEffect(text, (bubble) => {
        setTimeout(() => {
          addDisclosureToBubble(bubble);
        }, 600);
      });
    }
  }

  else if (step === 3) {
    window.location.href = "https://YOUR-SURVEY-LINK?condition=" + condition;
  }
}
