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
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwO5XPfqU_r1kjShE7LdeUEfE9-wOkrI582poE7RPfQQW2-TKrEGu_xm2jwa8p6kXH6/exec";

/*
   SECOND GOOGLE SHEETS ENDPOINT
   This endpoint receives moderator questionnaire data.
*/



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

  const moderator = document.getElementById("moderator-screen");

  // СНАЧАЛА показываем второй экран
  moderator.classList.remove("hidden-screen");
  moderator.style.display = "flex";

  // ПОТОМ запускаем анимацию первого
  intro.classList.add("hidden");

  // И только потом удаляем первый экран
  setTimeout(() => {
    intro.style.display = "none";
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
  fetch(GOOGLE_SCRIPT_URL, {

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

  openFinalSurvey();
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

/* =========================
   FINAL SURVEY
========================= */

const trustQuestions = [
  {
    id: "trust_1",
    text: "I am confident in the AI assistant."
  },
  {
    id: "trust_2",
    text: "The AI assistant is reliable."
  },
  {
    id: "trust_3",
    text: "I can trust the AI assistant."
  }
];

const pkQuestions = [
  {
    id: "pk_1",
    text: "I felt manipulated by the LLM."
  },
  {
    id: "pk_2",
    text: "The LLM was not fully transparent."
  }
];

/* NEW BLOCKS */

const manipulationQuestions = [
  {
    id: "manipulation_check",
    text: "How did you perceive the placement of the disclosure message?",
    options: [
      "It appeared before the recommendation",
      "It appeared after the recommendation",
      "I did not notice any disclosure message"
    ]
  }
];

const demographicQuestions = [
  {
    id: "age",
    text: "What is your age?",
    type: "text"
  },
  {
    id: "gender",
    text: "What is your gender?",
    options: [
      "Male",
      "Female",
      "Non-binary / other",
      "Prefer not to say"
    ]
  }
];

const answers = {};
const blockDescriptions = {

  trust: "Please indicate to what extent you agree with the following statements about LLMs in general, based on the interaction you just experienced.",

  pk: "Please indicate to what extent you experienced the following while reading the message:",

  manipulation: "Please answer the following question regarding the disclosure message.",

  demographics: "Please provide the following demographic information."
};
/* RANDOMIZE ARRAY */

function shuffleArray(arr) {

  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/* BUILD BLOCKS */

function buildSurveyFlow() {

  const randomizedBlocks = shuffleArray([
    {
      name: "trust",
      questions: shuffleArray(trustQuestions)
    },
    {
      name: "pk",
      questions: shuffleArray(pkQuestions)
    }
  ]);

  return [

    ...randomizedBlocks,

    {
      name: "manipulation",
      questions: manipulationQuestions
    },

    {
      name: "demographics",
      questions: demographicQuestions
    }
  ];
}

let surveyFlow = [];
let currentBlockIndex = 0;
let currentQuestionIndex = 0;

/* OPEN SURVEY */

function openFinalSurvey() {

  surveyFlow = buildSurveyFlow();

  currentBlockIndex = 0;
  currentQuestionIndex = 0;

  const surveyScreen = document.getElementById("final-survey-screen");

  surveyScreen.classList.remove("hidden-screen");
  surveyScreen.style.display = "flex";

  renderCurrentQuestion();
}

/* RENDER QUESTION */

function renderCurrentQuestion() {

  const container = document.getElementById("dynamic-question-container");

  const currentBlock = surveyFlow[currentBlockIndex];

  const question = currentBlock.questions[currentQuestionIndex];

  /* TEXT INPUT */

  if (question.type === "text") {

    container.innerHTML = `

      <div class="question-progress">
        Block ${currentBlockIndex + 1} of ${surveyFlow.length}
      </div>

      <div class="single-question-card">

<div class="question-context">
  ${blockDescriptions[currentBlock.name]}
</div>

<div class="single-question-title">
  ${question.text}
</div>

        <input
          type="number"
          id="textAnswer"
          placeholder="Enter your answer"
          style="
            width:100%;
            padding:16px;
            border-radius:14px;
            border:1px solid #ddd;
            font-size:16px;
            box-sizing:border-box;
            margin-top:10px;
          "
        >

        <button class="start-btn" onclick="submitCurrentQuestion()">
          Continue →
        </button>

      </div>
    `;

    return;
  }

  /* CUSTOM OPTIONS */

  if (question.options) {

    container.innerHTML = `

      <div class="question-progress">
        Block ${currentBlockIndex + 1} of ${surveyFlow.length}
      </div>

      <div class="single-question-card">

<div class="question-context">
  ${blockDescriptions[currentBlock.name]}
</div>

<div class="single-question-title">
  ${question.text}
</div>

        <div class="single-scale">

          ${question.options.map((option, index) => `

            <label class="single-option">

              <input
                type="radio"
                name="dynamicQuestion"
                value="${option}"
              >

              <span class="scale-number">${index + 1}</span>

              <span class="scale-label">${option}</span>

            </label>

          `).join("")}

        </div>

        <button class="start-btn" onclick="submitCurrentQuestion()">
          Continue →
        </button>

      </div>
    `;

    return;
  }

  /* DEFAULT LIKERT */

  let scaleLabels = [];

  if (currentBlock.name === "trust") {

    scaleLabels = [
      "Not at all",
      "Slightly",
      "Somewhat",
      "Moderately",
      "Quite a bit",
      "Very",
      "Extremely"
    ];

  } else {

    scaleLabels = [
      "Not at all",
      "Slightly",
      "Somewhat",
      "Moderately",
      "Quite a bit",
      "Very much",
      "Extremely"
    ];
  }

  container.innerHTML = `

    <div class="question-progress">
      Block ${currentBlockIndex + 1} of ${surveyFlow.length}
    </div>

    <div class="single-question-card">

<div class="question-context">
  ${blockDescriptions[currentBlock.name]}
</div>

<div class="single-question-title">
  ${question.text}
</div>

      <div class="single-scale">

        ${scaleLabels.map((label, index) => `

          <label class="single-option">

            <input
              type="radio"
              name="dynamicQuestion"
              value="${index + 1}"
            >

            <span class="scale-number">${index + 1}</span>

            <span class="scale-label">${label}</span>

          </label>

        `).join("")}

      </div>

      <button class="start-btn" onclick="submitCurrentQuestion()">
        Continue →
      </button>

    </div>
  `;
}

/* SUBMIT QUESTION */

function submitCurrentQuestion() {

  const currentBlock = surveyFlow[currentBlockIndex];

  const question = currentBlock.questions[currentQuestionIndex];

  let value = null;

  /* TEXT INPUT */

  if (question.type === "text") {

    value = document.getElementById("textAnswer")?.value?.trim();

  } else {

    value = document.querySelector('input[name="dynamicQuestion"]:checked')?.value;
  }

  if (!value) {

    alert("Please answer the question.");

    return;
  }

  answers[question.id] = value;

  currentQuestionIndex++;

  if (currentQuestionIndex >= currentBlock.questions.length) {

    currentBlockIndex++;
    currentQuestionIndex = 0;
  }

  if (currentBlockIndex >= surveyFlow.length) {

    finishSurvey();

    return;
  }

  renderCurrentQuestion();
}

/* FINISH */

function finishSurvey() {

  const exportData = {

    condition: condition,

    timestamp: new Date().toISOString(),

    userId: userId,

    /* MEDIATOR */
    q1Mediator: answers["pk_1"] || "",
    q2Mediator: answers["pk_2"] || "",

    /* MAIN EFFECT */
    q1MainEffect: answers["trust_1"] || "",
    q2MainEffect: answers["trust_2"] || "",
    q3MainEffect: answers["trust_3"] || "",

    /* MANIPULATION CHECK */
    manipulationCheck: answers["manipulation_check"] || "",

    /* DEMOGRAPHICS */
    age: answers["age"] || "",
    gender: answers["gender"] || ""
  };

  fetch(GOOGLE_SCRIPT_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(exportData)
  });

  const container = document.getElementById("dynamic-question-container");

  container.innerHTML = `

    <div class="thank-you-screen">

      <div class="start-icon">✅</div>

      <h1 class="start-title">
        Thank you!
      </h1>

      <p class="start-sub">
        Your responses have been recorded.
      </p>

    </div>
  `;
}
