// ================= ELEMENTS =================
const display = document.getElementById("display");
const expression = document.getElementById("expression");
const voiceBtn = document.querySelector(".voice-btn");

let recognition; // global for voice

// ================= CALCULATOR =================
function append(value) {
  if (display.innerText === "0") {
    display.innerText = value;
  } else {
    display.innerText += value;
  }
}

function clearDisplay() {
  display.innerText = "0";
  expression.innerText = "";
}

function calculate() {
  try {
    const result = eval(display.innerText);
    expression.innerText = display.innerText;
    display.innerText = result;
    speak("Result is " + result);
  } catch {
    display.innerText = "Error";
    speak("Invalid calculation");
  }
}

// ================= KEYBOARD =================
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key) || "+-*/.".includes(key)) append(key);
  if (key === "Enter") calculate();
  if (key === "Backspace") {
    display.innerText = display.innerText.slice(0, -1) || "0";
  }
  if (key === "Escape") clearDisplay();
});

// ================= THEME =================
function toggleTheme() {
  document.body.classList.toggle("light");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}

window.onload = () => {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
  }
};

// ================= VOICE =================
function startListening() {

  // Check support
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice not supported in this browser 😢");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;

  recognition.start();

  // 🎤 animation ON
  voiceBtn.classList.add("listening");

  recognition.onresult = (event) => {
    let speech = event.results[0][0].transcript.toLowerCase();
    console.log("You said:", speech);

    processVoice(speech);
  };

  recognition.onerror = (e) => {
    console.error(e);
    alert("Voice error: " + e.error);
  };

  recognition.onend = () => {
    // 🎤 animation OFF
    voiceBtn.classList.remove("listening");
  };
}

// ================= VOICE PROCESS =================
function processVoice(text) {

  text = text
    .replace(/plus/g, "+")
    .replace(/minus/g, "-")
    .replace(/times|multiply/g, "*")
    .replace(/divide|divided by/g, "/")
    .replace(/what is|calculate|equals/g, "")
    .trim();

  if (text.includes("clear")) {
    clearDisplay();
    speak("Cleared");
    return;
  }

  display.innerText = text;

  try {
    const result = eval(text);

    setTimeout(() => {
      expression.innerText = text;
      display.innerText = result;
      speak("Result is " + result);
    }, 500);

  } catch {
    display.innerText = "Error";
    speak("Invalid input");
  }
}

// ================= SPEECH =================
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}