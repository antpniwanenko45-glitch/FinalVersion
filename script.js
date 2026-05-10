const chat = document.getElementById("chat");

/* 
   USER IDENTIFIER 
   A unique identifier is generated once per user.
   It is stored in localStorage to persist across sessions.
*/
function getUserId() {
  let id = localStorage.getItem("userId");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("userId", id);
  }

  return id;
}

const userId = getUserId();

/* 
   GOOGLE SHEETS ENDPOINT 
   This endpoint receives prompt data via POST request.
*/
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLCgjCe8ZKyaU8NzWy5nZeOuh0mFqFph3o2e54QDgWNUMOVkCiQjxWtTsB163-ZA/exec";

/*
   SECOND GOOGLE SHEETS ENDPOINT
   This endpoint receives moderator questionnaire data.
*/
const GOOGLE_SCRIPT_URL_SURVEY = "PASTE-YOUR-SECOND-ENDPOINT-HERE";


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

  const intro = document.getElementById("start-screen");

  intro.classList.add("hidden");

  setTimeout(() => {

    intro.style.display = "none";

    const moderator = document.getElementById("moderator-screen");

moderator.classList.remove("hidden-screen");

moderator.style.display = "flex";

  }, 800);
}
/* MODERATOR QUESTIONNAIRE */
function submitModeratorSurvey() {

  const q1 = document.querySelector('input[name="q1"]:checked')?.value;
  const q2 = document.querySelector('input[name="q2"]:checked')?.value;
  const q3 = document.querySelector('input[name="q3"]:checked')?.value;
  const q4 = document.querySelector('input[name="q4"]:checked')?.value;
  const q5 = document.querySelector('input[name="q5"]:checked')?.value;

  // VALIDATION
  if (!q1 || !q2 || !q3 || !q4 || !q5) {
    alert("Please answer all questions.");
    return;
  }

  // SEND TO SECOND GOOGLE SHEET
  fetch(GOOGLE_SCRIPT_URL_SURVEY, {

    method: "POST",

    body: JSON.stringify({

      userId: userId,

      q1: q1,
      q2: q2,
      q3: q3,
      q4: q4,
      q5: q5,

      timestamp: new Date().toISOString()

    })
  });

// GARAGE DOOR TRANSITION
const survey = document.getElementById("moderator-screen");

survey.classList.add("hidden");

setTimeout(() => {
  survey.style.display = "none";
}, 800);
}


/* CHAT LIST */
const chats = [
  "Running tips",
  "Best sneakers 2025",
  "Gym plan",
  "Marketing ideas",
  "Healthy recipes",
  "Home workout plan",
  "Startup ideas",
  "Productivity hacks",
  "Best cafes Vienna",
  "Book recommendations"
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
let canProceed = false;

function nextStep() {

  const input = document.querySelector(".input-inner input");

  if (step === 0) {

    const userText = input?.value?.trim();

    if (!userText) return;

    createMessage(userText, "user");

    if (input) input.value = "";

    /* 
       DATA LOGGING 
       The user prompt, condition, and unique ID
       are sent to Google Sheets.
    */
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        prompt: userText,
        condition: condition,
        timestamp: new Date().toISOString()
      })
    });

/* output */
    const text = `
Hey! Based on your interest in running and staying active, comfort and support are likely important for you.

One option you could look at is the New Balance 1906R. People with a similar activity level often like it because it offers a good balance between comfort and style.

It could be a good option if you're looking for something you can use both for running and daily wear.
`;

    const { bubble, content } = createMessage("", "ai");

    if (condition === "A") {

      addDisclosureAnimated(bubble, "top");

      typingEffect(content, text, () => {
        addProductCard(bubble);
        canProceed = true;
      });

    } else {

      typingEffect(content, text, () => {
        addProductCard(bubble);
        setTimeout(() => addDisclosureAnimated(bubble, "bottom"), 300);
        canProceed = true;
      });
    }

    step = 1;
  }

  else if (step === 1) {

    if (!canProceed) return;

    /* 
       REDIRECT WITH ID 
       The same userId is passed to QuestionPro
       to link prompts with survey responses.
    */
    if (condition === "A") {
      window.location.href = "https://antpniwanenko45.questionpro.com/t/AdLyVZ8vGh?userId=" + userId;
    } else {
      window.location.href = "https://LINK-FOR-LATE?userId=" + userId;
    }
  }
}

const burger = document.getElementById("burger");
const sidebar = document.querySelector(".sidebar");

let startX = 0;
let currentX = 0;
let isDragging = false;

/* Burger settings for mobile devices */
/* CLICK (open / close) */

if (burger && sidebar) {

  burger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  /* SWIPE */

  sidebar.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  sidebar.addEventListener("touchmove", (e) => {

    if (!isDragging) return;

    currentX = e.touches[0].clientX;
    let diff = currentX - startX;

    if (diff < 0) {
      sidebar.style.transform = `translateX(${diff}px)`;
    }
  });

  sidebar.addEventListener("touchend", () => {

    isDragging = false;

    if (currentX - startX < -50) {
      sidebar.classList.remove("open");
    }

    sidebar.style.transform = "";
  });
}

