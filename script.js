const chat = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const startBtn = document.getElementById("startBtn");
const intro = document.getElementById("intro");

/* CONDITION */
function getCondition() {
  let bag = JSON.parse(localStorage.getItem("conditionBag"));

  if (!bag || bag.length === 0) {
    bag = ["A", "A", "B", "B"];
    bag.sort(() => Math.random() - 0.5);
  }

  const condition = bag.pop();
  localStorage.setItem("conditionBag", JSON.stringify(bag));
  return condition;
}

const condition = getCondition();

/* SIDEBAR */
const chats = [
  "Running tips",
  "Best sneakers 2025",
  "Gym plan",
  "Marketing ideas"
];

const chatList = document.getElementById("chats");
if (chatList) {
  chats.forEach(c => {
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
  bubble.innerHTML = text;

  wrapper.appendChild(bubble);
  chat.appendChild(wrapper);

  chat.scrollTop = chat.scrollHeight;

  return bubble;
}

/* DISCLOSURE */
function addDisclosure(bubble, position) {
  const d = document.createElement("div");
  d.className = "disclosure";
  d.innerText = "Sponsored content";

  if (position === "top") {
    bubble.prepend(d);
  } else {
    bubble.appendChild(d);
  }
}

/* PRODUCT */
function addProduct(bubble) {
  const el = document.createElement("div");
  el.innerHTML = `
    <div class="product-title">🔥 Best choice</div>
    <div class="product-card">
      <div class="product-name">New Balance 1906R</div>
    </div>
  `;
  bubble.appendChild(el);
}

/* FLOW */
let step = 0;

/* START */
startBtn.addEventListener("click", () => {
  intro.classList.add("hide");

  setTimeout(() => {
    // вставляем текст в input
    input.value = "Hey, can you suggest good running shoes?";
  }, 800);
});

/* SEND BUTTON */
sendBtn.addEventListener("click", () => {

  // STEP 1 → отправка сообщения
  if (step === 0) {
    const text = input.value;

    createMessage(text, "user");
    input.value = "";

    const aiText = `
I’d really suggest the New Balance 1906R. They combine comfort, support, and clean design — perfect for active people.
`;

    const bubble = createMessage("", "ai");

    setTimeout(() => {
      bubble.innerHTML = aiText;
      addProduct(bubble);

      if (condition === "A") {
        addDisclosure(bubble, "top");
      } else {
        addDisclosure(bubble, "bottom");
      }

    }, 500);

    step = 1;
  }

  // STEP 2 → переход
  else {
    window.location.href = "https://YOUR-SURVEY-LINK?condition=" + condition;
  }

});
